import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { planos } from "@/mocks/admin";

export const Route = createFileRoute("/admin/planos")({
  head: () => ({
    meta: [
      { title: "Planos — Super Admin | ImobiOS" },
      { name: "description", content: "Configuração dos planos comerciais da plataforma." },
    ],
  }),
  component: PlanosPage,
});

function PlanosPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Comercial"
        title="Planos"
        description="Estrutura de preços, limites e features de cada tier."
        actions={<Button size="sm">Novo plano</Button>}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {planos.map((p, i) => (
          <div key={p.tier} className="relative rounded-2xl border border-border bg-card p-6">
            {i === 1 && <Badge className="absolute right-4 top-4">Mais popular</Badge>}
            <p className="font-display text-lg font-semibold">{p.nome}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-3xl font-semibold">
                R$ {p.preco.toLocaleString("pt-BR")}
              </span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
              <div className="flex justify-between py-0.5">
                <span>Usuários</span>
                <span className="tabular-nums text-foreground">{p.limites.usuarios}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Imóveis</span>
                <span className="tabular-nums text-foreground">
                  {p.limites.imoveis.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Storage</span>
                <span className="tabular-nums text-foreground">{p.limites.storageGb} GB</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Editar
              </Button>
              <Button size="sm" className="flex-1">
                Ver clientes
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
