import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Entrar — ImobiOS" },
      { name: "description", content: "Acesse sua conta ImobiOS." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, configured, signInWithPassword, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [imobiliaria, setImobiliaria] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tipo, setTipo] = useState<"urbana" | "rural">("urbana");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      // Verifica se é super_admin antes de navegar
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "super_admin")
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            navigate({ to: "/admin/dashboard" });
          } else {
            navigate({ to: "/app/dashboard" });
          }
        });
    }
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } =
      mode === "login"
        ? await signInWithPassword(email, password)
        : await signUp({ email, password, nome, imobiliaria, tipo, whatsapp, responsavel });
    setBusy(false);
    if (error) setErr(error);
    else if (mode === "signup") setErr("Conta criada! Verifique seu email para confirmar (se exigido) e entre.");
  }

  return (
    <div className="grid min-h-screen bg-background md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-4" />
            </span>
            <span className="font-display text-lg font-semibold">ImobiOS</span>
          </Link>

          <h1 className="mt-10 font-display text-2xl font-semibold">
            {mode === "login" ? "Entrar na sua conta" : "Criar conta"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Acesse o painel da sua imobiliária." : "Cadastre-se para começar."}
          </p>

          {!configured && (
            <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              Supabase não configurado. Defina <code>VITE_SUPABASE_URL</code> e{" "}
              <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> no <code>.env</code>.
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="nome">Seu nome</Label>
                  <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="imobiliaria">Nome da imobiliária</Label>
                  <Input id="imobiliaria" value={imobiliaria} onChange={(e) => setImobiliaria(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="responsavel">Nome do responsável</Label>
                    <Input
                      id="responsavel"
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      inputMode="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de carteira</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["urbana", "rural"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTipo(t)}
                        className={`rounded-md border px-3 py-2 text-sm capitalize transition ${
                          tipo === t
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-input bg-background text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Escolha o segmento. Você verá no menu apenas o que selecionar.
                  </p>
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "signup" ? 8 : 1}
              />
            </div>

            {err && <p className="text-xs text-destructive">{err}</p>}

            <Button type="submit" className="w-full" disabled={busy || !configured}>
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </Button>

            <button
              type="button"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setErr(null);
                setMode(mode === "login" ? "signup" : "login");
              }}
            >
              {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background md:flex md:items-center md:justify-center">
        <div className="max-w-md p-10 text-center">
          <h2 className="font-display text-3xl font-semibold">Bem-vindo ao ImobiOS</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ERP completo para imobiliárias urbanas e rurais.
          </p>
        </div>
      </div>
    </div>
  );
}
