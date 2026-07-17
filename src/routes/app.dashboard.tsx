import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Building2, Handshake, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { funil, mensagens, vendasSerie } from "@/mocks/app";
import { cn } from "@/lib/utils";
import { listTarefas, updateTarefa } from "@/lib/tarefas.functions";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Terra & Lar | ImobiOS" },
      { name: "description", content: "Painel operacional da imobiliária: leads, tarefas, vendas e agenda." },
    ],
  }),
  component: AppDashboard,
});

type UITarefa = {
  id: string;
  titulo: string;
  responsavel: string;
  vencimento: string;
  prioridade: "alta" | "media" | "baixa";
  status?: string;
};

function formatVencimento(d: unknown): string {
  if (!d) return "sem prazo";
  const date = new Date(d as string);
  if (Number.isNaN(date.getTime())) return "sem prazo";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}


const prioridadeStyle = {
  alta: "bg-destructive/15 text-destructive border-destructive/30",
  media: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/30",
  baixa: "bg-muted text-muted-foreground border-border",
} as const;

function AppDashboard() {
  const maxFunil = Math.max(...funil.map((f) => f.valor));
  const qc = useQueryClient();
  const tarefasQuery = useQuery({
    queryKey: ["tarefas", "abertas"],
    queryFn: () => listTarefas({ data: { status: "aberta" } }),
    retry: false,
  });
  const toggleMutation = useMutation({
    mutationFn: (id: string) => updateTarefa({ data: { id, patch: { status: "concluida" } } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tarefas"] }),
  });

  const tarefas: UITarefa[] = tarefasQuery.data && tarefasQuery.data.length > 0
    ? tarefasQuery.data.slice(0, 6).map((t: any) => ({
        id: t.id,
        titulo: t.titulo,
        responsavel: t.responsavelId ? "Responsável" : "Sem responsável",
        vencimento: formatVencimento(t.vencimento),
        prioridade: "media" as const,
        status: t.status,
      }))
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação"
        title="Bom dia, Carla 👋"
        description="Aqui está o resumo da sua imobiliária hoje."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leads ativos" value="69" delta="+12" trend="up" icon={Users} hint="últimos 30 dias" />
        <StatCard label="Visitas agendadas" value="14" delta="+3" trend="up" icon={Handshake} hint="esta semana" />
        <StatCard label="VGV do mês" value="R$ 9,6M" delta="+16%" trend="up" icon={TrendingUp} hint="vs. mês passado" />
        <StatCard label="Imóveis ativos" value="1.284" icon={Building2} hint="212 exclusivos" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Vendas &amp; VGV</h3>
              <p className="text-xs text-muted-foreground">Últimos 7 meses</p>
            </div>
            <Badge variant="secondary">+128% YTD</Badge>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vendasSerie}>
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
                <Line dataKey="vgv" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line dataKey="fechamentos" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Funil de vendas</h3>
          <p className="text-xs text-muted-foreground">Distribuição atual dos leads</p>
          <ul className="mt-4 space-y-3">
            {funil.map((f) => (
              <li key={f.etapa} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{f.etapa}</span>
                  <span className="tabular-nums text-muted-foreground">{f.valor}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(f.valor / maxFunil) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 xl:col-span-2">
          <h3 className="font-display text-base font-semibold">Fechamentos por mês</h3>
          <p className="text-xs text-muted-foreground">Contratos assinados</p>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendasSerie}>
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
                <Bar dataKey="fechamentos" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Tarefas de hoje</h3>
            <Badge variant="secondary">{tarefas.length}</Badge>
          </div>
          <ul className="mt-4 space-y-3">
            {tarefas.map((t) => (
              <li key={t.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <input
                  type="checkbox"
                  className="mt-1 accent-[color:var(--color-primary)]"
                  checked={t.status === "concluida"}
                  onChange={() => {
                    if (tarefasQuery.data && t.status !== "concluida") toggleMutation.mutate(t.id);
                  }}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{t.titulo}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t.responsavel}</span>
                    <span>·</span>
                    <span>{t.vencimento}</span>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize",
                    prioridadeStyle[t.prioridade],
                  )}
                >
                  {t.prioridade}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold">Mensagens recentes</h3>
            <p className="text-xs text-muted-foreground">Últimas conversas de todos os canais</p>
          </div>
          <Badge variant="secondary">
            {mensagens.reduce((a, m) => a + m.naoLidas, 0)} não lidas
          </Badge>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {mensagens.slice(0, 5).map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {m.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{m.nome}</p>
                  <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {m.canal}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">{m.previa}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{m.quando}</span>
              {m.naoLidas > 0 && (
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {m.naoLidas}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
