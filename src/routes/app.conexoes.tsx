import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import {
  Smartphone,
  QrCode,
  Plus,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Power,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  createInstance,
  deleteInstance,
  listInstances,
  openQRStream,
  type WaInstance,
} from "@/lib/whatsmeow";

export const Route = createFileRoute("/app/conexoes")({
  head: () => ({
    meta: [
      { title: "Conexões WhatsApp — ImobiOS" },
      { name: "description", content: "Conexões WhatsApp reais via whatsmeow — QR Code de verdade." },
    ],
  }),
  component: ConexoesPage,
});

const statusMeta: Record<WaInstance["status"], { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  conectado:    { label: "Conectado",    className: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",       Icon: CheckCircle2 },
  pareando:     { label: "Pareando",     className: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",       Icon: QrCode },
  desconectado: { label: "Desconectado", className: "bg-muted text-muted-foreground",                                              Icon: PauseCircle },
  erro:         { label: "Erro",         className: "bg-[color:var(--color-destructive)]/15 text-[color:var(--color-destructive)]", Icon: AlertCircle },
};

function ConexoesPage() {
  const qc = useQueryClient();
  const { data: instancias = [], isLoading, error } = useQuery({
    queryKey: ["wa-instances"],
    queryFn: listInstances,
    refetchInterval: 5000,
  });
  const [pareando, setPareando] = useState<WaInstance | null>(null);
  const [novoNome, setNovoNome] = useState("");

  const create = useMutation({
    mutationFn: (nome: string) => createInstance(nome),
    onSuccess: (inst) => {
      qc.invalidateQueries({ queryKey: ["wa-instances"] });
      setNovoNome("");
      setPareando(inst);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteInstance(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wa-instances"] }),
  });

  const total = instancias.length;
  const conectadas = instancias.filter((i) => i.status === "conectado").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sistema"
        title="Conexões WhatsApp"
        description="Instâncias reais via whatsmeow — uma por corretor ou setor, com QR Code próprio."
      />

      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card p-4">
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs text-muted-foreground">Nome da nova instância</label>
          <input
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Ex.: Atendimento Principal"
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          disabled={!novoNome.trim() || create.isPending}
          onClick={() => create.mutate(novoNome.trim())}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {create.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Criar instância
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Instâncias" value={`${conectadas}/${total}`} icon={Smartphone} hint="conectadas" />
        <StatCard label="Serviço whatsmeow" value={error ? "offline" : "online"} icon={MessageSquare} />
        <StatCard label="Reconexão" value="automática" hint="sessões persistidas" />
        <StatCard label="QR" value="real" hint="gerado pelo whatsmeow" />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando instâncias…</p>}
      {error && (
        <div className="rounded-xl border border-[color:var(--color-warning)]/40 bg-[color:var(--color-warning)]/5 p-4 text-sm">
          <p className="font-medium text-foreground">Serviço whatsmeow indisponível em <code>{(import.meta.env.VITE_WHATSMEOW_URL as string) || "/wa"}</code>.</p>
          <p className="mt-1 text-muted-foreground">
            Isso é normal no preview do Lovable — o whatsmeow (Go) só roda no seu VPS via <code>docker compose up -d whatsmeow caddy</code>.
            Configure <code>VITE_WHATSMEOW_URL</code> no <code>.env</code> para apontar pro seu host, ou acesse a app pelo domínio do Caddy.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {instancias.map((i) => {
          const meta = statusMeta[i.status] ?? statusMeta.desconectado;
          return (
            <div key={i.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]">
                    <Smartphone className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{i.nome}</p>
                    <p className="text-xs text-muted-foreground">{i.jid || "—"}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>
                  <meta.Icon className="size-3.5" />
                  {meta.label}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-end gap-1.5 text-xs">
                {i.status !== "conectado" && (
                  <button
                    onClick={() => setPareando(i)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 hover:border-primary/50 hover:text-foreground"
                  >
                    <QrCode className="size-3.5" /> QR Code
                  </button>
                )}
                <button
                  onClick={() => remove.mutate(i.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 hover:border-[color:var(--color-destructive)]/50 hover:text-[color:var(--color-destructive)]"
                  title="Desconectar / remover"
                >
                  <Power className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {pareando && <QRDialog instancia={pareando} onClose={() => { setPareando(null); qc.invalidateQueries({ queryKey: ["wa-instances"] }); }} />}
    </div>
  );
}

function QRDialog({ instancia, onClose }: { instancia: WaInstance; onClose: () => void }) {
  const [qr, setQr] = useState<string | null>(null);
  const [estado, setEstado] = useState<"conectando" | "aguardando" | "pareado" | "timeout" | "erro">("conectando");
  const [erro, setErro] = useState<string | null>(null);
  const closeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const close = await openQRStream(instancia.id, {
          onQR: (code) => { if (!mounted) return; setQr(code); setEstado("aguardando"); },
          onPaired: () => { if (!mounted) return; setEstado("pareado"); setTimeout(onClose, 1200); },
          onTimeout: () => { if (!mounted) return; setEstado("timeout"); },
          onError: (msg) => { if (!mounted) return; setErro(msg); setEstado("erro"); },
        });
        closeRef.current = close;
      } catch (e: any) {
        setErro(String(e?.message ?? e));
        setEstado("erro");
      }
    })();
    return () => { mounted = false; closeRef.current?.(); };
  }, [instancia.id, onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Pareamento whatsmeow</p>
            <h3 className="mt-1 font-display text-lg font-semibold">{instancia.nome}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg border border-border px-2 py-1 text-xs hover:border-primary/50">
            Fechar
          </button>
        </div>

        <div className="mt-5 grid min-h-[15rem] place-items-center rounded-2xl bg-white p-6">
          {estado === "conectando" && (
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              Aguardando QR do WhatsApp…
            </div>
          )}
          {qr && estado === "aguardando" && (
            <QRCodeSVG value={qr} size={224} level="M" includeMargin={false} />
          )}
          {estado === "pareado" && (
            <div className="flex flex-col items-center gap-2 text-[color:var(--color-success)]">
              <CheckCircle2 className="size-10" />
              <p className="text-sm font-medium">Conectado!</p>
            </div>
          )}
          {estado === "timeout" && (
            <p className="text-sm text-muted-foreground">QR expirou. Feche e abra novamente para tentar de novo.</p>
          )}
          {estado === "erro" && (
            <p className="text-sm text-[color:var(--color-destructive)]">{erro ?? "Erro ao conectar."}</p>
          )}
        </div>

        <ol className="mt-5 space-y-2 text-sm text-muted-foreground">
          <li>1. Abra o WhatsApp no celular do responsável.</li>
          <li>2. Toque em <span className="text-foreground">Configurações → Aparelhos conectados</span>.</li>
          <li>3. Toque em <span className="text-foreground">Conectar um aparelho</span> e aponte para este QR.</li>
        </ol>

        <p className="mt-4 text-xs text-muted-foreground">
          O QR é regenerado automaticamente pelo whatsmeow. A sessão fica salva no Postgres (schema <code>whatsmeow</code>).
        </p>
      </div>
    </div>
  );
}
