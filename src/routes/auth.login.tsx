import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [loading, setLoading] = useState(false);

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

          <h1 className="mt-10 font-display text-2xl font-semibold">Entrar na sua conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse o painel da sua imobiliária.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => navigate({ to: "/app/dashboard" }), 500);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="voce@imobiliaria.com" required />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="senha">Senha</Label>
                <a className="text-xs text-muted-foreground hover:text-foreground" href="#">
                  Esqueci a senha
                </a>
              </div>
              <Input id="senha" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ainda não tem conta?{" "}
            <a className="font-medium text-primary" href="#">
              Fale com o comercial
            </a>
          </p>

          <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
            Demo · qualquer email/senha entra direto no Super Admin.
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-secondary md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <blockquote className="font-display text-2xl font-medium leading-snug text-foreground">
            "Trocamos 4 sistemas por um só. Nossa operação urbana e a carteira rural agora
            falam a mesma língua."
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">
            Carla Menezes · Diretora, Terra & Lar Imóveis
          </p>
        </div>
      </div>
    </div>
  );
}
