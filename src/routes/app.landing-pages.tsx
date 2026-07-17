import { createFileRoute } from "@tanstack/react-router";
import { Rocket, Plus, TrendingUp, MousePointer2, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { landings, fmtBRLFull, type Landing } from "@/mocks/crescimento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/landing-pages")({
  head: () => ({
    meta: [
      { title: "Landing Pages — ImobiOS" },
      { name: "description", content: "Landing pages de campanha com métricas de tráfego, leads e CPL." },
    ],
  }),
  component: LandingsPage,
});

const statusMap: Record<Landing["status"], { label: string; className: string }> = {
  publicada: { label: "Publicada", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  rascunho:  { label: "Rascunho",  className: "bg-muted text-muted-foreground" },
  pausada:   { label: "Pausada",   className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
};

function LandingsPage() {
  const totalLeads = landings.reduce((a, l) => a + l.leads, 0);
  const totalInv = landings.reduce((a, l) => a + l.investimento, 0);
  const cplMedio = totalLeads > 0 ? totalInv / totalLeads : 0;
  const conv = landings.filter((l) => l.visualizacoes > 0);
  const convMedia = conv.length > 0 ? conv.reduce((a, l) => a + l.conversao, 0) / conv.length : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Landing Pages"
        description="Páginas de captura para campanhas pagas, com métricas de tráfego, leads e CPL."
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova landing</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Landings ativas" valor={landings.filter((l) => l.status === "publicada").length} />
        <Kpi label="Leads gerados" valor={totalLeads.toLocaleString("pt-BR")} icon={MousePointer2} />
        <Kpi label="Investimento" valor={fmtBRLFull(totalInv)} icon={DollarSign} />
        <Kpi label="Conversão média" valor={`${convMedia.toFixed(1)}%`} icon={TrendingUp} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {landings.map((l) => (
          <article key={l.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary/20 via-primary/5 to-background">
              <Rocket className="h-10 w-10 text-primary/60" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg font-semibold">{l.nome}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{l.campanha}</p>
                </div>
                <Badge className={cn("border-none", statusMap[l.status].className)}>{statusMap[l.status].label}</Badge>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <Cell label="Views" valor={l.visualizacoes.toLocaleString("pt-BR")} />
                <Cell label="Leads" valor={l.leads} />
                <Cell label="Conv." valor={`${l.conversao.toFixed(1)}%`} destaque />
                <Cell label="CPL" valor={l.cpl > 0 ? `R$ ${l.cpl.toFixed(0)}` : "—"} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Investido: {fmtBRLFull(l.investimento)}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm">Relatório</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Kpi({ label, valor, icon: Icon }: { label: string; valor: string | number; icon?: typeof MousePointer2 }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{valor}</p>
    </div>
  );
}

function Cell({ label, valor, destaque }: { label: string; valor: string | number; destaque?: boolean }) {
  return (
    <div className={cn("rounded-lg border p-2", destaque ? "border-primary/40 bg-primary/5" : "border-border bg-muted/30")}>
      <p className={cn("font-display text-base font-semibold", destaque && "text-primary")}>{valor}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
