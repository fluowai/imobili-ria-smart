import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Bot, KeyRound, Loader2, Server, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useImobiliaria } from "@/hooks/use-imobiliaria";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — ImobiOS" },
      { name: "description", content: "Configure sua instância e chaves de IA." },
    ],
  }),
  component: OnboardingPage,
});

type Tipo = "urbana" | "rural";

function OnboardingPage() {
  const { user, loading, configured } = useAuth();
  const { imob, loading: imobLoading, update } = useImobiliaria();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<Tipo>("urbana");
  const [instancia, setInstancia] = useState("");
  const [openai, setOpenai] = useState("");
  const [anthropic, setAnthropic] = useState("");
  const [gemini, setGemini] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (imob) {
      setTipo(imob.tipo);
      setInstancia(imob.instancia_nome ?? imob.nome ?? "");
      const k = imob.llm_keys ?? {};
      setOpenai(k.openai ?? "");
      setAnthropic(k.anthropic ?? "");
      setGemini(k.gemini ?? "");
    }
  }, [imob]);

  if (configured && loading) return <Spinner />;
  if (configured && !user) return <Navigate to="/auth/login" />;
  if (configured && imobLoading) return <Spinner />;
  if (imob?.onboarding_completed) return <Navigate to="/app/dashboard" />;

  async function saveAndFinish() {
    setErr(null);
    setBusy(true);
    const { error } = await update({
      tipo,
      instancia_nome: instancia.trim(),
      llm_keys: {
        openai: openai.trim(),
        anthropic: anthropic.trim(),
        gemini: gemini.trim(),
      },
      onboarding_completed: true,
    });
    setBusy(false);
    if (error) return setErr(error);
    navigate({ to: "/app/dashboard", replace: true });
  }

  return (
    <div className="theme-app min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Vamos configurar sua conta</h1>
            <p className="text-sm text-muted-foreground">
              Passo {step} de 3 — leva menos de 2 minutos.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Server className="size-4 text-primary" /> Tipo de carteira
              </div>
              <p className="text-sm text-muted-foreground">
                Escolha o segmento que sua imobiliária opera. Você verá no menu apenas o que
                selecionar. Pode alterar depois em Configurações.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["urbana", "rural"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`rounded-lg border px-4 py-6 text-sm capitalize transition ${
                      tipo === t
                        ? "border-primary bg-primary/10"
                        : "border-input bg-background hover:bg-accent"
                    }`}
                  >
                    <div className="font-semibold">{t}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {t === "urbana" && "Imóveis, locação, condomínios"}
                      {t === "rural" && "Fazendas, CAR, valuation"}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => setStep(2)}>Continuar</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Server className="size-4 text-primary" /> Nome da instância
              </div>
              <p className="text-sm text-muted-foreground">
                Como sua instância deve aparecer para sua equipe (ex: nome da imobiliária ou
                filial).
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="instancia">Nome</Label>
                <Input
                  id="instancia"
                  value={instancia}
                  onChange={(e) => setInstancia(e.target.value)}
                  placeholder="Ex: Terra & Lar Curitiba"
                />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button onClick={() => setStep(3)} disabled={!instancia.trim()}>
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bot className="size-4 text-primary" /> Chaves de IA (LLM)
              </div>
              <p className="text-sm text-muted-foreground">
                Cole as chaves dos provedores que você deseja usar nos agentes IA. Você pode pular
                agora e cadastrar depois em Configurações → Conexões. As chaves são armazenadas com
                criptografia no seu banco.
              </p>

              <KeyField label="OpenAI API Key" hint="sk-…" value={openai} onChange={setOpenai} />
              <KeyField
                label="Anthropic (Claude) API Key"
                hint="sk-ant-…"
                value={anthropic}
                onChange={setAnthropic}
              />
              <KeyField
                label="Google Gemini API Key"
                hint="AIza…"
                value={gemini}
                onChange={setGemini}
              />

              {err && <p className="text-xs text-destructive">{err}</p>}

              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Voltar
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={saveAndFinish} disabled={busy}>
                    Pular por enquanto
                  </Button>
                  <Button onClick={saveAndFinish} disabled={busy}>
                    {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Concluir e entrar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KeyField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-sm">
        <KeyRound className="size-3.5 text-muted-foreground" /> {label}
      </Label>
      <Input
        type="password"
        placeholder={hint}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
