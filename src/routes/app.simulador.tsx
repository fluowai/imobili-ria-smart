import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Calculator, FileText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador Financeiro — ImobiOS" },
      {
        name: "description",
        content: "Simulação de financiamento SAC e Price com comparação entre bancos.",
      },
    ],
  }),
  component: SimuladorPage,
});

type Sistema = "sac" | "price";

const bancos = [
  { nome: "Caixa · SBPE", taxaAno: 10.49 },
  { nome: "Banco do Brasil", taxaAno: 10.79 },
  { nome: "Itaú", taxaAno: 11.29 },
  { nome: "Santander", taxaAno: 11.49 },
  { nome: "Bradesco", taxaAno: 11.09 },
];

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function calcular(
  valor: number,
  entrada: number,
  prazoMeses: number,
  taxaAno: number,
  sistema: Sistema,
) {
  const financiado = Math.max(0, valor - entrada);
  const i = Math.pow(1 + taxaAno / 100, 1 / 12) - 1;
  const n = prazoMeses;
  const parcelas: { n: number; parcela: number; juros: number; amort: number; saldo: number }[] =
    [];

  if (sistema === "price") {
    const p = (financiado * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);
    let saldo = financiado;
    for (let k = 1; k <= n; k++) {
      const juros = saldo * i;
      const amort = p - juros;
      saldo -= amort;
      parcelas.push({ n: k, parcela: p, juros, amort, saldo: Math.max(0, saldo) });
    }
  } else {
    const amort = financiado / n;
    let saldo = financiado;
    for (let k = 1; k <= n; k++) {
      const juros = saldo * i;
      const parcela = amort + juros;
      saldo -= amort;
      parcelas.push({ n: k, parcela, juros, amort, saldo: Math.max(0, saldo) });
    }
  }
  const total = parcelas.reduce((a, x) => a + x.parcela, 0);
  return {
    financiado,
    primeira: parcelas[0]?.parcela ?? 0,
    ultima: parcelas[parcelas.length - 1]?.parcela ?? 0,
    total,
    juros: total - financiado,
    parcelas,
  };
}

function SimuladorPage() {
  const [valor, setValor] = useState(680000);
  const [entrada, setEntrada] = useState(180000);
  const [prazo, setPrazo] = useState(360);
  const [taxa, setTaxa] = useState(10.79);
  const [sistema, setSistema] = useState<Sistema>("price");

  const r = useMemo(
    () => calcular(valor, entrada, prazo, taxa, sistema),
    [valor, entrada, prazo, taxa, sistema],
  );
  const grafico = useMemo(
    () =>
      r.parcelas
        .filter((_, idx) => idx % Math.max(1, Math.floor(prazo / 24)) === 0)
        .map((p) => ({ mes: p.n, parcela: Math.round(p.parcela), saldo: Math.round(p.saldo) })),
    [r.parcelas, prazo],
  );
  const comparacao = useMemo(
    () => bancos.map((b) => ({ ...b, ...calcular(valor, entrada, prazo, b.taxaAno, sistema) })),
    [valor, entrada, prazo, sistema],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Gestão"
        title="Simulador Financeiro"
        description="Simule financiamento imobiliário nos sistemas SAC e Price e compare bancos."
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Proposta PDF
            </Button>
            <Button size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Enviar ao cliente
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            <h2 className="font-medium">Parâmetros</h2>
          </div>
          <div className="mt-4 space-y-4 text-sm">
            <Field label="Valor do imóvel" value={valor} onChange={setValor} />
            <Field label="Entrada" value={entrada} onChange={setEntrada} />
            <div>
              <label className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Prazo (meses)</span>
                <span className="text-foreground">
                  {prazo} · {(prazo / 12).toFixed(0)} anos
                </span>
              </label>
              <input
                type="range"
                min={60}
                max={420}
                step={12}
                value={prazo}
                onChange={(e) => setPrazo(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>
            <div>
              <label className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Taxa a.a.</span>
                <span className="text-foreground">{taxa.toFixed(2)}%</span>
              </label>
              <input
                type="range"
                min={7}
                max={16}
                step={0.1}
                value={taxa}
                onChange={(e) => setTaxa(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>
            <div className="flex gap-1 rounded-md border border-input p-0.5">
              {(["price", "sac"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSistema(s)}
                  className={cn(
                    "flex-1 rounded px-3 py-1.5 text-xs font-medium uppercase",
                    sistema === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Result
              label={sistema === "price" ? "Parcela mensal" : "Primeira parcela"}
              valor={fmt(r.primeira)}
              destaque
            />
            {sistema === "sac" && <Result label="Última parcela" valor={fmt(r.ultima)} />}
            <Result label="Total pago" valor={fmt(r.total)} />
            <Result label="Total de juros" valor={fmt(r.juros)} tone="red" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-medium">Evolução do financiamento</h2>
            <p className="text-xs text-muted-foreground">
              Parcela e saldo devedor ao longo dos meses.
            </p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={grafico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v: number) => fmt(v)}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saldo"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={false}
                    name="Saldo devedor"
                  />
                  <Line
                    type="monotone"
                    dataKey="parcela"
                    stroke="hsl(0 70% 55%)"
                    strokeWidth={2}
                    dot={false}
                    name="Parcela"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="font-medium">Comparação entre bancos</h2>
              <p className="text-xs text-muted-foreground">
                Mesmos parâmetros, taxas praticadas por instituição.
              </p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Banco</th>
                  <th className="px-4 py-2 text-right">Taxa a.a.</th>
                  <th className="px-4 py-2 text-right">
                    {sistema === "price" ? "Parcela" : "1ª parcela"}
                  </th>
                  <th className="px-4 py-2 text-right">Total pago</th>
                  <th className="px-4 py-2 text-right">Juros</th>
                </tr>
              </thead>
              <tbody>
                {comparacao.map((c) => (
                  <tr key={c.nome} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">{c.nome}</td>
                    <td className="px-4 py-2 text-right">{c.taxaAno.toFixed(2)}%</td>
                    <td className="px-4 py-2 text-right">{fmt(c.primeira)}</td>
                    <td className="px-4 py-2 text-right">{fmt(c.total)}</td>
                    <td className="px-4 py-2 text-right text-red-600 dark:text-red-400">
                      {fmt(c.juros)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="mt-1"
      />
      <p className="mt-1 text-[11px] text-muted-foreground">{fmt(value)}</p>
    </div>
  );
}

function Result({
  label,
  valor,
  destaque,
  tone,
}: {
  label: string;
  valor: string;
  destaque?: boolean;
  tone?: "red";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        destaque ? "border-primary/40 bg-primary/5" : "border-border bg-muted/30",
      )}
    >
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-display text-base font-semibold",
          destaque && "text-primary",
          tone === "red" && "text-red-600 dark:text-red-400",
        )}
      >
        {valor}
      </p>
    </div>
  );
}
