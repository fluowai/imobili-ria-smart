import { createFileRoute } from "@tanstack/react-router";
import { Map, TrendingUp, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { loteamentos, fmtBRL, type Loteamento } from "@/mocks/urbano";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/urbano/loteamentos")({
  head: () => ({
    meta: [
      { title: "Loteamentos — ImobiOS" },
      { name: "description", content: "Gestão de empreendimentos, quadras, lotes e reservas." },
    ],
  }),
  component: LoteamentosPage,
});

const statusInfo: Record<Loteamento["status"], { label: string; className: string }> = {
  lancamento: { label: "Lançamento", className: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  obras: { label: "Em obras", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  entregue: {
    label: "Entregue",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
};

function LoteamentosPage() {
  const total = loteamentos.reduce((a, l) => a + l.totalLotes, 0);
  const vendidos = loteamentos.reduce((a, l) => a + l.vendidos, 0);
  const vgv = loteamentos.reduce((a, l) => a + l.vgv, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Carteira Urbana"
        title="Loteamentos"
        description="Empreendimentos com quadras, lotes, reservas e espelho de vendas."
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo empreendimento
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Empreendimentos" valor={loteamentos.length} />
        <Kpi label="Lotes totais" valor={total} />
        <Kpi
          label="Lotes vendidos"
          valor={`${vendidos} (${((vendidos / total) * 100).toFixed(0)}%)`}
        />
        <Kpi label="VGV total" valor={fmtBRL(vgv)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loteamentos.map((l) => {
          const vendPct = (l.vendidos / l.totalLotes) * 100;
          const resPct = (l.reservados / l.totalLotes) * 100;
          return (
            <article key={l.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={l.cover}
                  alt={l.nome}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <Badge className={cn("border-none", statusInfo[l.status].className)}>
                    {statusInfo[l.status].label}
                  </Badge>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white">{l.nome}</h3>
                  <p className="text-sm text-white/80">
                    {l.cidade} · Entrega {l.entregaPrevista}
                  </p>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Cell label="Disponíveis" valor={l.disponiveis} tone="emerald" />
                  <Cell label="Reservados" valor={l.reservados} tone="amber" />
                  <Cell label="Vendidos" valor={l.vendidos} tone="blue" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Comercialização</span>
                    <span>{(vendPct + resPct).toFixed(0)}% negociado</span>
                  </div>
                  <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-muted">
                    <div className="bg-blue-500" style={{ width: `${vendPct}%` }} />
                    <div className="bg-amber-500" style={{ width: `${resPct}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">VGV</p>
                  <p className="flex items-center gap-1 font-display text-lg font-semibold">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {fmtBRL(l.vgv)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Map className="mr-2 h-4 w-4" />
                    Espelho
                  </Button>
                  <Button size="sm" className="flex-1">
                    Ver reservas
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Kpi({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{valor}</p>
    </div>
  );
}

function Cell({
  label,
  valor,
  tone,
}: {
  label: string;
  valor: number;
  tone: "emerald" | "amber" | "blue";
}) {
  const cls = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    blue: "text-blue-600 dark:text-blue-400",
  }[tone];
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className={cn("font-display text-xl font-semibold", cls)}>{valor}</p>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
