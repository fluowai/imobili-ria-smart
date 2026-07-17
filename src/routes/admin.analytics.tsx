import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, MousePointerClick, Timer, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { mrrSerie } from "@/mocks/admin";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Super Admin | ImobiOS" },
      { name: "description", content: "Métricas de uso e adoção da plataforma." },
    ],
  }),
  component: AnalyticsPage,
});

const engajamento = [
  { dia: "Seg", sessoes: 4200, acoes: 18400 },
  { dia: "Ter", sessoes: 4680, acoes: 20100 },
  { dia: "Qua", sessoes: 5100, acoes: 22400 },
  { dia: "Qui", sessoes: 4890, acoes: 21200 },
  { dia: "Sex", sessoes: 5320, acoes: 24800 },
  { dia: "Sáb", sessoes: 2100, acoes: 8900 },
  { dia: "Dom", sessoes: 1800, acoes: 7100 },
];

function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Adoção, retenção e uso dos módulos da plataforma nos últimos 30 dias."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="DAU" value="1.284" delta="+8,2%" trend="up" icon={Users} />
        <StatCard label="Sessões / dia" value="4.630" delta="+3,1%" trend="up" icon={Eye} />
        <StatCard label="Ações / sessão" value="14,8" delta="-0,6" trend="down" icon={MousePointerClick} />
        <StatCard label="Tempo médio" value="18min 42s" delta="+1min" trend="up" icon={Timer} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Engajamento semanal</h3>
          <p className="text-xs text-muted-foreground">Sessões vs. ações realizadas</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engajamento}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="dia" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Line dataKey="sessoes" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
                <Line dataKey="acoes" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Crescimento de clientes</h3>
          <p className="text-xs text-muted-foreground">Aquisição por mês</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mrrSerie}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="clientes" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-semibold">Módulos mais usados</h3>
        <p className="text-xs text-muted-foreground">Ações registradas nos últimos 30 dias</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { m: "CRM Leads", v: 128400, p: 92 },
            { m: "Imóveis Urbanos", v: 96200, p: 78 },
            { m: "Kanban", v: 82100, p: 66 },
            { m: "Financeiro", v: 61800, p: 51 },
            { m: "Contratos", v: 48200, p: 41 },
            { m: "Agentes IA", v: 32900, p: 28 },
          ].map((r) => (
            <div key={r.m} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{r.m}</p>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {r.v.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${r.p}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
