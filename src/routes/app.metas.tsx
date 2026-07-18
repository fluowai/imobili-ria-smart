import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Target, TrendingUp, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { metas, evolucaoMetas, fmtBRL } from "@/mocks/crescimento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/metas")({
  head: () => ({
    meta: [
      { title: "Metas & OKRs — ImobiOS" },
      {
        name: "description",
        content: "Metas por equipe, categoria e prazo, com evolução semanal.",
      },
    ],
  }),
  component: MetasPage,
});

function MetasPage() {
  const atingidas = metas.filter((m) => m.atingido / m.meta >= 1).length;
  const emRisco = metas.filter((m) => m.atingido / m.meta < 0.7).length;
  const media = Math.round(
    (metas.reduce((a, m) => a + m.atingido / m.meta, 0) / metas.length) * 100,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Metas & OKRs"
        description="Metas por equipe, categoria e prazo, com evolução semanal."
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova meta
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Metas ativas" valor={metas.length} />
        <Kpi label="Atingidas" valor={atingidas} tone="emerald" />
        <Kpi label="Em risco" valor={emRisco} tone="red" />
        <Kpi label="Progresso médio" valor={`${media}%`} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">Evolução consolidada</h2>
            <p className="text-xs text-muted-foreground">
              Planejado vs. realizado ao longo do trimestre
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs text-primary">
            <TrendingUp className="h-3 w-3" />
            +12% vs. semana anterior
          </span>
        </div>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolucaoMetas}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="semana" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="planejado"
                stroke="var(--color-muted-foreground)"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="real"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {metas.map((m) => {
          const pct = Math.min(100, (m.atingido / m.meta) * 100);
          const tone = pct >= 100 ? "emerald" : pct >= 70 ? "amber" : "red";
          const toneCls = { emerald: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500" }[
            tone
          ];
          return (
            <article key={m.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {m.categoria}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-medium">{m.titulo}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.responsavel} · prazo {m.prazo}
                  </p>
                </div>
                <span className="font-display text-2xl font-semibold">{pct.toFixed(0)}%</span>
              </div>

              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full", toneCls)} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {m.unidade === "R$"
                      ? fmtBRL(m.atingido)
                      : `${m.atingido.toLocaleString("pt-BR")} ${m.unidade}`}
                  </span>
                  <span className="font-medium">
                    Meta:{" "}
                    {m.unidade === "R$"
                      ? fmtBRL(m.meta)
                      : `${m.meta.toLocaleString("pt-BR")} ${m.unidade}`}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Kpi({
  label,
  valor,
  tone,
}: {
  label: string;
  valor: string | number;
  tone?: "emerald" | "red";
}) {
  const cls =
    tone === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "red"
        ? "text-red-600 dark:text-red-400"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-2xl font-semibold", cls)}>{valor}</p>
    </div>
  );
}
