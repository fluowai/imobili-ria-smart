import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Globe, ExternalLink, Eye, MousePointerClick, TrendingUp, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { paginasSite, traficoDiario, type PaginaSite } from "@/mocks/crescimento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/site")({
  head: () => ({
    meta: [
      { title: "Meu Site — ImobiOS" },
      { name: "description", content: "Portal de imóveis: páginas, tráfego, leads e SEO." },
    ],
  }),
  component: SitePage,
});

const statusMap: Record<PaginaSite["status"], { label: string; className: string }> = {
  publicada: {
    label: "Publicada",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  revisao: { label: "Revisão", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
};

function SitePage() {
  const visitas = traficoDiario.reduce((a, d) => a + d.visitas, 0);
  const leads = traficoDiario.reduce((a, d) => a + d.leads, 0);
  const conv = ((leads / visitas) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Meu Site"
        description="Portal público de imóveis: páginas, SEO, tráfego e leads gerados."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir site
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova página
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Visitas · 7d" valor={visitas.toLocaleString("pt-BR")} icon={Eye} />
        <Kpi label="Leads · 7d" valor={leads} icon={MousePointerClick} />
        <Kpi label="Conversão" valor={`${conv}%`} icon={TrendingUp} />
        <Kpi
          label="Páginas publicadas"
          valor={paginasSite.filter((p) => p.status === "publicada").length}
          icon={Globe}
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-medium">Tráfego dos últimos 7 dias</h2>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={traficoDiario}>
              <defs>
                <linearGradient id="vis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="dia" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="visitas"
                stroke="var(--color-primary)"
                fill="url(#vis)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="font-medium">Páginas do site</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Página</th>
              <th className="px-4 py-2">URL</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Visualizações</th>
              <th className="px-4 py-2 text-right">Cliques</th>
              <th className="px-4 py-2">Atualizado</th>
            </tr>
          </thead>
          <tbody>
            {paginasSite.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-2 font-medium">{p.titulo}</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{p.slug}</td>
                <td className="px-4 py-2 capitalize text-muted-foreground">{p.tipo}</td>
                <td className="px-4 py-2">
                  <Badge className={cn("border-none", statusMap[p.status].className)}>
                    {statusMap[p.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-right">{p.visualizacoes.toLocaleString("pt-BR")}</td>
                <td className="px-4 py-2 text-right">{p.cliques.toLocaleString("pt-BR")}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{p.atualizado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({
  label,
  valor,
  icon: Icon,
}: {
  label: string;
  valor: string | number;
  icon: typeof Eye;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{valor}</p>
    </div>
  );
}
