import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { lancamentos as lancamentosMock, fluxoMensal, distribuicaoDespesa, fmtBRLFull, type FluxoTipo, type FluxoStatus } from "@/mocks/gestao";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NovoLancamentoDialog } from "@/components/app/novo-lancamento-dialog";
import { listLancamentos } from "@/lib/lancamentos.functions";

export const Route = createFileRoute("/app/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro & ERP — ImobiOS" },
      { name: "description", content: "Contas a pagar, a receber, fluxo de caixa e DRE gerencial." },
    ],
  }),
  component: FinanceiroPage,
});

const statusMap: Record<FluxoStatus, { label: string; className: string }> = {
  pago:     { label: "Pago",     className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  aberto:   { label: "Aberto",   className: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  atrasado: { label: "Atrasado", className: "bg-red-500/15 text-red-700 dark:text-red-300" },
};

function FinanceiroPage() {
  const [tipoFiltro, setTipoFiltro] = useState<FluxoTipo | "todos">("todos");

  const list = useServerFn(listLancamentos);
  const query = useQuery({
    queryKey: ["lancamentos"],
    queryFn: () => list({ data: {} }),
    retry: false,
  });

  type Row = {
    id: string;
    data: string;
    descricao: string;
    categoria: string;
    contraparte: string;
    tipo: FluxoTipo;
    status: FluxoStatus;
    valor: number;
  };

  const dbStatusToUi = (s: string): FluxoStatus =>
    s === "pago" ? "pago" : s === "atrasado" ? "atrasado" : "aberto";

  const rows: Row[] = useMemo(() => {
    if (query.data && query.data.length > 0) {
      return query.data.map((l) => ({
        id: l.id,
        data: (l.vencimento ?? new Date(l.createdAt).toISOString()).slice(0, 10),
        descricao: l.descricao,
        categoria: l.categoria ?? "—",
        contraparte: "—",
        tipo: l.tipo as FluxoTipo,
        status: dbStatusToUi(l.status),
        valor: Number(l.valor),
      }));
    }
    return lancamentosMock.map((l) => ({ ...l }));
  }, [query.data]);

  const kpis = useMemo(() => {
    const receitas = rows.filter((l) => l.tipo === "receita");
    const despesas = rows.filter((l) => l.tipo === "despesa");
    const totReceita = receitas.reduce((a, l) => a + l.valor, 0);
    const totDespesa = despesas.reduce((a, l) => a + l.valor, 0);
    const receber = receitas.filter((l) => l.status !== "pago").reduce((a, l) => a + l.valor, 0);
    const pagar = despesas.filter((l) => l.status !== "pago").reduce((a, l) => a + l.valor, 0);
    return { totReceita, totDespesa, receber, pagar, saldo: totReceita - totDespesa };
  }, [rows]);

  const filtrados = useMemo(
    () => rows.filter((l) => tipoFiltro === "todos" || l.tipo === tipoFiltro),
    [tipoFiltro, rows],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Gestão"
        title="Financeiro & ERP"
        description="Contas a pagar, a receber, fluxo de caixa projetado e DRE gerencial."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" />Período</Button>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Novo lançamento</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Receitas · mês" valor={fmtBRLFull(kpis.totReceita)} icon={ArrowUpRight} tone="emerald" />
        <Kpi label="Despesas · mês" valor={fmtBRLFull(kpis.totDespesa)} icon={ArrowDownRight} tone="red" />
        <Kpi label="Saldo líquido" valor={fmtBRLFull(kpis.saldo)} icon={Wallet} tone="default" />
        <Kpi label="A receber" valor={fmtBRLFull(kpis.receber)} icon={TrendingUp} tone="blue" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Fluxo de caixa · 7 meses</h2>
              <p className="text-xs text-muted-foreground">Valores em milhares de R$</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" />Receitas</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "hsl(0 70% 55%)" }} />Despesas</span>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fluxoMensal}>
                <defs>
                  <linearGradient id="rec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="des" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0 70% 55%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(0 70% 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="receitas" stroke="var(--color-primary)" fill="url(#rec)" strokeWidth={2} />
                <Area type="monotone" dataKey="despesas" stroke="hsl(0 70% 55%)" fill="url(#des)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-medium">Despesas por categoria</h2>
          <p className="text-xs text-muted-foreground">Distribuição do mês corrente</p>
          <div className="mt-2 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribuicaoDespesa} dataKey="valor" nameKey="categoria" innerRadius={38} outerRadius={62} paddingAngle={2}>
                  {distribuicaoDespesa.map((d) => <Cell key={d.categoria} fill={d.cor} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtBRLFull(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs">
            {distribuicaoDespesa.map((d) => (
              <li key={d.categoria} className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.cor }} />{d.categoria}</span>
                <span className="font-medium">{fmtBRLFull(d.valor)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-medium">Lançamentos</h2>
          <div className="flex gap-1 rounded-md border border-input p-0.5">
            {(["todos", "receita", "despesa"] as const).map((t) => (
              <button key={t} onClick={() => setTipoFiltro(t)} className={cn("rounded px-3 py-1 text-xs font-medium capitalize", tipoFiltro === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                {t === "todos" ? "Todos" : `${t}s`}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">Categoria</th>
              <th className="px-4 py-2">Contraparte</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((l) => (
              <tr key={l.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-2 text-xs text-muted-foreground">{l.data}</td>
                <td className="px-4 py-2 font-medium">{l.descricao}</td>
                <td className="px-4 py-2 capitalize text-muted-foreground">{l.categoria}</td>
                <td className="px-4 py-2 text-muted-foreground">{l.contraparte}</td>
                <td className="px-4 py-2"><Badge className={cn("border-none", statusMap[l.status].className)}>{statusMap[l.status].label}</Badge></td>
                <td className={cn("px-4 py-2 text-right font-medium", l.tipo === "receita" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                  {l.tipo === "receita" ? "+" : "−"} {fmtBRLFull(l.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, valor, icon: Icon, tone }: { label: string; valor: string; icon: typeof TrendingUp; tone: "emerald" | "red" | "blue" | "default" }) {
  const cls = { emerald: "text-emerald-600 dark:text-emerald-400", red: "text-red-600 dark:text-red-400", blue: "text-blue-600 dark:text-blue-400", default: "text-foreground" }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className={cn("h-4 w-4", cls)} />
      </div>
      <p className={cn("mt-1 font-display text-xl font-semibold md:text-2xl", cls)}>{valor}</p>
    </div>
  );
}
