// Cliente do microserviço whatsmeow real.
// URL padrão: /wa (proxy Caddy). Em dev sem Caddy, defina VITE_WHATSMEOW_URL=http://localhost:8080
import { supabase } from "@/integrations/supabase/client";

const BASE = (import.meta.env.VITE_WHATSMEOW_URL as string) || "/wa";

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export interface WaInstance {
  id: string;
  nome: string;
  jid: string;
  status: "conectado" | "desconectado" | "pareando" | "erro";
  createdAt: string;
}

export async function listInstances(): Promise<WaInstance[]> {
  const res = await fetch(`${BASE}/instances`, { headers: await authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createInstance(nome: string): Promise<WaInstance> {
  const res = await fetch(`${BASE}/instances`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ nome }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteInstance(id: string): Promise<void> {
  const res = await fetch(`${BASE}/instances/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok && res.status !== 204) throw new Error(await res.text());
}

/**
 * Abre stream SSE do QR real. Retorna função para fechar.
 * Eventos: qr (string do QR), paired, timeout, error.
 */
export async function openQRStream(
  instanceId: string,
  handlers: {
    onQR: (code: string) => void;
    onPaired: () => void;
    onTimeout?: () => void;
    onError?: (msg: string) => void;
  },
): Promise<() => void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? "";
  const url = `${BASE}/instances/${instanceId}/qr?token=${encodeURIComponent(token)}`;
  const es = new EventSource(url);
  es.addEventListener("qr", (e) => {
    try {
      const p = JSON.parse((e as MessageEvent).data);
      handlers.onQR(p.data);
    } catch {
      handlers.onQR((e as MessageEvent).data);
    }
  });
  es.addEventListener("paired", () => {
    handlers.onPaired();
    es.close();
  });
  es.addEventListener("timeout", () => {
    handlers.onTimeout?.();
    es.close();
  });
  es.addEventListener("error", () => {
    handlers.onError?.("conexão perdida");
    // não fechar — EventSource reconecta sozinho
  });
  return () => es.close();
}
