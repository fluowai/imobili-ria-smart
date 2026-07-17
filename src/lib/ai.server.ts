// Helper de chamadas ao Groq (server-only).
// Usa GROQ_API_KEY via process.env dentro de handlers.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export async function groqChat(opts: {
  messages: ChatMsg[];
  model?: string;
  json?: boolean;
  temperature?: number;
  max_tokens?: number;
}): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY não configurada no servidor.");

  const body: Record<string, unknown> = {
    model: opts.model ?? DEFAULT_MODEL,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.4,
    max_tokens: opts.max_tokens ?? 2048,
  };
  if (opts.json) body.response_format = { type: "json_object" };

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Groq ${res.status}: ${txt.slice(0, 400)}`);
  }
  const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return j.choices?.[0]?.message?.content ?? "";
}

export async function groqJSON<T = unknown>(opts: {
  system: string;
  user: string;
  model?: string;
}): Promise<T> {
  const raw = await groqChat({
    messages: [
      { role: "system", content: opts.system + "\nResponda SEMPRE em JSON válido." },
      { role: "user", content: opts.user },
    ],
    model: opts.model,
    json: true,
  });
  try {
    return JSON.parse(raw) as T;
  } catch {
    // tenta extrair bloco JSON
    const m = raw.match(/\{[\s\S]*\}$/);
    if (m) return JSON.parse(m[0]) as T;
    throw new Error("Groq retornou JSON inválido: " + raw.slice(0, 200));
  }
}
