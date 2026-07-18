import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, DollarSign, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { auditLog, distribuicaoPlano, imobiliarias, mrrSerie } from "@/mocks/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Super Admin | ImobiOS" },
      {
        name: "description",
        content: "Visão geral da plataforma: MRR, imobiliárias ativas, uptime e atividade recente.",
      },
    ],
  }),
  component: DashboardPage,
});

const ativas = imobiliarias.filter((i) => i.status === "ativa").length;
const trials = imobiliarias.filter((i) => i.status === "trial").length;
const mrrAtual = imobiliarias.reduce((acc, i) => acc + i.mrr, 0);
const usuariosTotal = imobiliarias.reduce((acc, i) => acc + i.usuarios, 0);

function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Visão geral"
        title="Dashboard da plataforma"
        description="Panorama executivo do ImobiOS — receita, adoção e saúde operacional."
        actions={
          <>
            <Button variant="outline" size="sm">
              Exportar
            </Button>
            <Button size="sm">Novo cliente</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="MRR"
          value={`R$ ${(mrrAtual / 1000).toFixed(1)}k`}
          delta="+12,4%"
          trend="up"
          icon={DollarSign}
          hint="vs. mês anterior"
        />
        <StatCard
          label="Imobiliárias ativas"
          value={String(ativas)}
          delta="+3"
          trend="up"
          icon={Building2}
          hint={`${trials} em trial`}
        />
        <StatCard
          label="Usuários totais"
          value={String(usuariosTotal)}
          delta="+48"
          trend="up"
          icon={Users}
          hint="últimos 30 dias"
        />
        <StatCard
          label="Uptime 30d"
          value="99,982%"
          delta="0,004%"
          trend="up"
          icon={TrendingUp}
          hint="SLA 99,9%"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Receita recorrente (MRR)</h3>
              <p className="text-xs text-muted-foreground">Últimos 7 meses</p>
            </div>
            <Badge variant="secondary">+58% YTD</Badge>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrSerie}>
                <defs>
                  <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#mrr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Distribuição por plano</h3>
          <p className="text-xs text-muted-foreground">% das imobiliárias</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoPlano}
                  dataKey="valor"
                  nameKey="plano"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {distribuicaoPlano.map((entry, i) => (
                    <Cell key={i} fill={entry.cor} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Novos clientes por mês</h3>
              <p className="text-xs text-muted-foreground">Aquisição</p>
            </div>
          </div>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mrrSerie}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
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

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Atividade recente</h3>
          <p className="text-xs text-muted-foreground">Últimos eventos do audit log</p>
          <ul className="mt-4 space-y-3">
            {auditLog.slice(0, 6).map((row) => (
              <li key={row.id} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{row.acao}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.ator} · {row.alvo}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{row.quando}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
