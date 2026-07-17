import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Search, Sparkles, Star } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { leads } from "@/mocks/app";

export const Route = createFileRoute("/app/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes Unificado — Terra & Lar | ImobiOS" },
      { name: "description", content: "Base 360 de clientes com histórico completo." },
    ],
  }),
  component: ClientesPage,
});

function ClientesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação"
        title="Clientes Unificado"
        description="Base 360º com histórico completo de cada cliente — leads, contratos, visitas e financeiro."
        actions={<Button size="sm">Exportar CSV</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniCard label="Clientes ativos" value="1.842" />
        <MiniCard label="Novos no mês" value="128" />
        <MiniCard label="Compradores" value="642" />
        <MiniCard label="Locatários" value="1.200" />
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome, CPF, email ou telefone..." className="pl-9" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {leads.slice(0, 9).map((l) => (
          <div key={l.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {l.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{l.nome}</p>
                <p className="truncate text-xs text-muted-foreground">{l.email}</p>
              </div>
              <button className="text-muted-foreground hover:text-[color:var(--color-warning)]">
                <Star className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="capitalize">
                {l.origem}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {l.status}
              </Badge>
              <Badge variant="secondary">Score 82</Badge>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">Interesse: {l.interesse}</p>

            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="mr-1.5 size-3.5" /> Ligar
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="mr-1.5 size-3.5" /> Email
              </Button>
              <Button size="sm">
                <Sparkles className="mr-1.5 size-3.5" /> IA
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
