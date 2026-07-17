// Serviço whatsmeow real — gera QR de verdade, mantém sessões no Postgres (schema `whatsmeow`).
// Endpoints:
//   POST   /instances                  -> cria instância (body: { "nome": "..." })
//   GET    /instances                  -> lista instâncias do tenant
//   DELETE /instances/:id              -> remove/logout
//   GET    /instances/:id/qr           -> SSE com QR real (event: qr | paired | timeout)
//   GET    /instances/:id/status       -> status atual
//   POST   /instances/:id/send         -> envia mensagem (body: { "to": "5565...", "text": "..." })
//
// Auth: header Authorization: Bearer <supabase access token>, verificado com SUPABASE_JWT_SECRET (HS256).
// Tenant: derivado da tabela public.memberships (imobiliaria_id do usuário).
package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	_ "github.com/jackc/pgx/v5/stdlib"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/store"
	"go.mau.fi/whatsmeow/store/sqlstore"
	waLog "go.mau.fi/whatsmeow/util/log"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"
)

var (
	db          *sql.DB
	container   *sqlstore.Container
	clients     = map[string]*clientRef{} // instanceID -> client
	clientsMu   sync.Mutex
	jwtSecret   []byte
)

type clientRef struct {
	instanceID string
	imobID     string
	client     *whatsmeow.Client
	qrChan     chan string // fan-out latest QR
	subs       map[chan qrEvent]struct{}
	subsMu     sync.Mutex
	status     string
}

type qrEvent struct {
	Event string `json:"event"` // qr | paired | timeout | error
	Data  string `json:"data"`
}

func main() {
	jwtSecret = []byte(os.Getenv("SUPABASE_JWT_SECRET"))
	if len(jwtSecret) == 0 {
		log.Fatal("SUPABASE_JWT_SECRET required")
	}
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL required")
	}

	var err error
	db, err = sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("db open: %v", err)
	}
	if _, err = db.Exec(`CREATE SCHEMA IF NOT EXISTS whatsmeow`); err != nil {
		log.Fatalf("create schema: %v", err)
	}
	if err = ensureAppTables(); err != nil {
		log.Fatalf("app tables: %v", err)
	}

	dbLog := waLog.Stdout("db", "INFO", true)
	container, err = sqlstore.New("pgx", dsn+"&search_path=whatsmeow", dbLog)
	if err != nil {
		log.Fatalf("sqlstore: %v", err)
	}

	// Auto-restore devices já pareados
	go restoreDevices()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) })
	mux.HandleFunc("/instances", withAuth(handleInstances))
	mux.HandleFunc("/instances/", withAuth(handleInstanceItem))

	addr := ":8080"
	log.Printf("whatsmeow-svc ouvindo em %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func ensureAppTables() error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS whatsmeow.instances (
			id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			imobiliaria_id uuid NOT NULL,
			nome         text NOT NULL,
			jid          text,
			status       text NOT NULL DEFAULT 'desconectado',
			created_at   timestamptz NOT NULL DEFAULT now(),
			updated_at   timestamptz NOT NULL DEFAULT now()
		);
		CREATE INDEX IF NOT EXISTS idx_instances_imob ON whatsmeow.instances(imobiliaria_id);
	`)
	return err
}

// --- Auth ---

type ctxKey string

const ctxUser ctxKey = "user"
const ctxImob ctxKey = "imob"

func withAuth(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		setCORS(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(204)
			return
		}
		auth := r.Header.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			// SSE aceita token via query para EventSource
			if t := r.URL.Query().Get("token"); t != "" {
				auth = "Bearer " + t
			} else {
				http.Error(w, "unauthorized", 401)
				return
			}
		}
		token := strings.TrimPrefix(auth, "Bearer ")
		claims := jwt.MapClaims{}
		_, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil {
			http.Error(w, "invalid token", 401)
			return
		}
		userID, _ := claims["sub"].(string)
		if userID == "" {
			http.Error(w, "no sub", 401)
			return
		}
		var imobID string
		err = db.QueryRow(`SELECT imobiliaria_id::text FROM public.memberships WHERE user_id = $1 LIMIT 1`, userID).Scan(&imobID)
		if err != nil {
			http.Error(w, "sem imobiliária", 403)
			return
		}
		ctx := context.WithValue(r.Context(), ctxUser, userID)
		ctx = context.WithValue(ctx, ctxImob, imobID)
		h(w, r.WithContext(ctx))
	}
}

func setCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "authorization, content-type")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS")
}

func imobOf(r *http.Request) string { return r.Context().Value(ctxImob).(string) }

// --- Handlers ---

func handleInstances(w http.ResponseWriter, r *http.Request) {
	imob := imobOf(r)
	switch r.Method {
	case http.MethodGet:
		rows, err := db.Query(`SELECT id, nome, jid, status, created_at FROM whatsmeow.instances WHERE imobiliaria_id=$1 ORDER BY created_at DESC`, imob)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		defer rows.Close()
		out := []map[string]any{}
		for rows.Next() {
			var id, nome, status string
			var jid sql.NullString
			var created time.Time
			rows.Scan(&id, &nome, &jid, &status, &created)
			out = append(out, map[string]any{
				"id": id, "nome": nome, "jid": jid.String, "status": status, "createdAt": created,
			})
		}
		writeJSON(w, out)
	case http.MethodPost:
		var body struct{ Nome string `json:"nome"` }
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || strings.TrimSpace(body.Nome) == "" {
			http.Error(w, "nome obrigatório", 400)
			return
		}
		var id string
		err := db.QueryRow(`INSERT INTO whatsmeow.instances(imobiliaria_id, nome, status) VALUES ($1,$2,'desconectado') RETURNING id`, imob, body.Nome).Scan(&id)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		writeJSON(w, map[string]string{"id": id, "nome": body.Nome, "status": "desconectado"})
	default:
		http.Error(w, "method", 405)
	}
}

func handleInstanceItem(w http.ResponseWriter, r *http.Request) {
	imob := imobOf(r)
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/instances/"), "/")
	id := parts[0]
	sub := ""
	if len(parts) > 1 {
		sub = parts[1]
	}
	// Autoriza a instância
	var owner string
	if err := db.QueryRow(`SELECT imobiliaria_id::text FROM whatsmeow.instances WHERE id=$1`, id).Scan(&owner); err != nil || owner != imob {
		http.Error(w, "não encontrada", 404)
		return
	}

	switch {
	case sub == "qr" && r.Method == http.MethodGet:
		streamQR(w, r, id, imob)
	case sub == "status" && r.Method == http.MethodGet:
		writeJSON(w, map[string]string{"status": currentStatus(id)})
	case sub == "send" && r.Method == http.MethodPost:
		sendMessage(w, r, id)
	case sub == "" && r.Method == http.MethodDelete:
		clientsMu.Lock()
		if ref, ok := clients[id]; ok {
			_ = ref.client.Logout()
			ref.client.Disconnect()
			delete(clients, id)
		}
		clientsMu.Unlock()
		db.Exec(`DELETE FROM whatsmeow.instances WHERE id=$1`, id)
		w.WriteHeader(204)
	default:
		http.Error(w, "not found", 404)
	}
}

// --- QR SSE ---

func streamQR(w http.ResponseWriter, r *http.Request, instanceID, imobID string) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	flusher, _ := w.(http.Flusher)

	ref, err := getOrCreateClient(instanceID, imobID)
	if err != nil {
		fmt.Fprintf(w, "event: error\ndata: %s\n\n", err.Error())
		flusher.Flush()
		return
	}

	// Se já pareado, retorna imediatamente
	if ref.client.Store.ID != nil {
		fmt.Fprintf(w, "event: paired\ndata: %s\n\n", ref.client.Store.ID.String())
		flusher.Flush()
		return
	}

	sub := make(chan qrEvent, 4)
	ref.subsMu.Lock()
	ref.subs[sub] = struct{}{}
	ref.subsMu.Unlock()
	defer func() {
		ref.subsMu.Lock()
		delete(ref.subs, sub)
		ref.subsMu.Unlock()
	}()

	// Dispara pareamento se ainda não iniciou
	go ensurePairing(ref)

	ctx := r.Context()
	for {
		select {
		case <-ctx.Done():
			return
		case ev := <-sub:
			b, _ := json.Marshal(ev)
			fmt.Fprintf(w, "event: %s\ndata: %s\n\n", ev.Event, string(b))
			flusher.Flush()
			if ev.Event == "paired" || ev.Event == "timeout" || ev.Event == "error" {
				return
			}
		}
	}
}

func ensurePairing(ref *clientRef) {
	if ref.client.IsConnected() {
		return
	}
	qrChan, _ := ref.client.GetQRChannel(context.Background())
	if err := ref.client.Connect(); err != nil {
		ref.broadcast(qrEvent{Event: "error", Data: err.Error()})
		return
	}
	for evt := range qrChan {
		switch evt.Event {
		case "code":
			ref.broadcast(qrEvent{Event: "qr", Data: evt.Code})
		case "success":
			ref.broadcast(qrEvent{Event: "paired", Data: ""})
			markStatus(ref.instanceID, "conectado", ref.client.Store.ID)
			return
		case "timeout":
			ref.broadcast(qrEvent{Event: "timeout", Data: ""})
			return
		}
	}
}

func (ref *clientRef) broadcast(ev qrEvent) {
	ref.subsMu.Lock()
	defer ref.subsMu.Unlock()
	for ch := range ref.subs {
		select {
		case ch <- ev:
		default:
		}
	}
}

// --- Client lifecycle ---

func getOrCreateClient(instanceID, imobID string) (*clientRef, error) {
	clientsMu.Lock()
	defer clientsMu.Unlock()
	if ref, ok := clients[instanceID]; ok {
		return ref, nil
	}
	device, err := getDeviceForInstance(instanceID)
	if err != nil {
		return nil, err
	}
	cli := whatsmeow.NewClient(device, waLog.Stdout("wa:"+instanceID[:8], "INFO", true))
	ref := &clientRef{
		instanceID: instanceID,
		imobID:     imobID,
		client:     cli,
		subs:       map[chan qrEvent]struct{}{},
		status:     "desconectado",
	}
	cli.AddEventHandler(func(e any) {
		switch v := e.(type) {
		case *events.Connected:
			markStatus(instanceID, "conectado", cli.Store.ID)
			_ = v
		case *events.Disconnected:
			markStatus(instanceID, "desconectado", nil)
		case *events.LoggedOut:
			markStatus(instanceID, "desconectado", nil)
		}
	})
	clients[instanceID] = ref
	return ref, nil
}

func getDeviceForInstance(instanceID string) (*store.Device, error) {
	// mapeia instanceID -> device via tabela auxiliar
	var jidStr sql.NullString
	if err := db.QueryRow(`SELECT jid FROM whatsmeow.instances WHERE id=$1`, instanceID).Scan(&jidStr); err != nil {
		return nil, err
	}
	if jidStr.Valid && jidStr.String != "" {
		jid, err := types.ParseJID(jidStr.String)
		if err == nil {
			dev, err := container.GetDevice(jid)
			if err == nil && dev != nil {
				return dev, nil
			}
		}
	}
	return container.NewDevice(), nil
}

func markStatus(instanceID, status string, jid *types.JID) {
	jidStr := ""
	if jid != nil {
		jidStr = jid.String()
	}
	if jidStr != "" {
		db.Exec(`UPDATE whatsmeow.instances SET status=$1, jid=$2, updated_at=now() WHERE id=$3`, status, jidStr, instanceID)
	} else {
		db.Exec(`UPDATE whatsmeow.instances SET status=$1, updated_at=now() WHERE id=$2`, status, instanceID)
	}
	clientsMu.Lock()
	if ref, ok := clients[instanceID]; ok {
		ref.status = status
	}
	clientsMu.Unlock()
}

func currentStatus(instanceID string) string {
	clientsMu.Lock()
	defer clientsMu.Unlock()
	if ref, ok := clients[instanceID]; ok {
		if ref.client.IsConnected() {
			return "conectado"
		}
		return ref.status
	}
	return "desconectado"
}

func restoreDevices() {
	rows, err := db.Query(`SELECT id, imobiliaria_id::text FROM whatsmeow.instances WHERE jid IS NOT NULL AND jid <> ''`)
	if err != nil {
		return
	}
	defer rows.Close()
	for rows.Next() {
		var id, imob string
		rows.Scan(&id, &imob)
		ref, err := getOrCreateClient(id, imob)
		if err != nil {
			continue
		}
		if ref.client.Store.ID != nil {
			_ = ref.client.Connect()
		}
	}
}

// --- Send ---

func sendMessage(w http.ResponseWriter, r *http.Request, instanceID string) {
	var body struct {
		To   string `json:"to"`
		Text string `json:"text"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad body", 400)
		return
	}
	clientsMu.Lock()
	ref, ok := clients[instanceID]
	clientsMu.Unlock()
	if !ok || !ref.client.IsConnected() {
		http.Error(w, "não conectado", 409)
		return
	}
	jid := types.NewJID(strings.TrimPrefix(body.To, "+"), types.DefaultUserServer)
	_, err := ref.client.SendMessage(context.Background(), jid, waMessageText(body.Text))
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	writeJSON(w, map[string]any{"ok": true})
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}
