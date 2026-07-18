import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, AlertTriangle, CheckCircle2, Server } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/monitoring")({
  head: () => ({
    meta: [
      { title: "Monitoring — Super Admin | ImobiOS" },
      { name: "description", content: "Saúde e disponibilidade dos serviços da plataforma." },
    ],
  }),
  component: MonitoringPage,
});

const latencia = Array.from({ length: 24 }, (_, i) => ({
  hora: `${i}h`,
  p95: 120 + Math.round(Math.sin(i / 3) * 30 + Math.random() * 20),
  p99: 210 + Math.round(Math.sin(i / 3) * 40 + Math.random() * 30),
}));

const servicos = [
  { nome: "API principal", status: "operacional", latencia: "128ms" },
  { nome: "Workers de importação", status: "operacional", latencia: "—" },
  { nome: "Serviço de IA", status: "operacional", latencia: "412ms" },
  { nome: "Storage", status: "degradado", latencia: "1.2s" },
  { nome: "Envio de emails", status: "operacional", latencia: "—" },
  { nome: "WhatsApp Gateway", status: "operacional", latencia: "220ms" },
];

function MonitoringPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Infra"
        title="Monitoring"
        description="Uptime, latência e alertas em tempo real."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Uptime 30d"
          value="99,982%"
          delta="+0,004%"
          trend="up"
          icon={CheckCircle2}
        />
        <StatCard label="Latência p95" value="128ms" delta="-12ms" trend="up" icon={Activity} />
        <StatCard label="Serviços online" value="5/6" icon={Server} hint="1 degradado" />
        <StatCard label="Alertas ativos" value="2" delta="+1" trend="down" icon={AlertTriangle} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-semibold">Latência da API (últimas 24h)</h3>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latencia}>
              <defs>
                <linearGradient id="p95" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="hora" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="p95"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                fill="url(#p95)"
              />
              <Area
                type="monotone"
                dataKey="p99"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-display text-base font-semibold">Status dos serviços</h3>
        </div>
        <ul className="divide-y divide-border">
          {servicos.map((s) => (
            <li key={s.nome} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span
                  className={
                    s.status === "operacional"
                      ? "size-2 rounded-full bg-[color:var(--color-success)]"
                      : "size-2 rounded-full bg-[color:var(--color-warning)]"
                  }
                />
                <span className="font-medium">{s.nome}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="tabular-nums">{s.latencia}</span>
                <Badge
                  variant={s.status === "operacional" ? "secondary" : "destructive"}
                  className="capitalize"
                >
                  {s.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
