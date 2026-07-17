import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Calculator, TrendingUp, Sparkles, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { valuationHistorico, comparaveis, fmtBRLFull, fmtHa } from "@/mocks/rural";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/rural/valuation")({
  head: () => ({
    meta: [
      { title: "Valuation CAR — ImobiOS" },
      { name: "description", content: "Avaliação de imóveis rurais por comparáveis, com ajuste de aptidão e valor por hectare." },
    ],
  }),
  component: ValuationPage,
});

function ValuationPage() {
  const [areaHa, setAreaHa] = useState(1200);
  const [aptidao, setAptidao] = useState(85); // 0-100
  const [regiao, setRegiao] = useState("Sorriso / MT");

  const media = useMemo(() => comparaveis.reduce((a, c) => a + c.valorHa, 0) / comparaveis.length, []);
  const valorHaAjustado = useMemo(() => Math.round(media * (0.7 + (aptidao / 100) * 0.5)), [media, aptidao]);
  const valorTotal = valorHaAjustado * areaHa;
  const min = Math.round(valorTotal * 0.92);
  const max = Math.round(valorTotal * 1.08);
  const crescimentoAnual = useMemo(() => {
    const first = valuationHistorico[0].valorHa;
    const last = valuationHistorico[valuationHistorico.length - 1].valorHa;
    const anos = valuationHistorico.length - 1;
    return ((Math.pow(last / first, 1 / anos) - 1) * 100).toFixed(1);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Carteira Rural"
        title="Valuation CAR"
        description="Estimativa de valor de imóveis rurais por comparáveis + ajuste de aptidão agrícola."
        actions={
          <>
            <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" />Laudo PDF</Button>
            <Button size="sm"><Sparkles className="mr-2 h-4 w-4" />Rodar IA</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            <h2 className="font-medium">Parâmetros</h2>
          </div>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Região comparável</label>
              <Input value={regiao} onChange={(e) => setRegiao(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Área (ha)</label>
              <Input type="number" min={1} value={areaHa} onChange={(e) => setAreaHa(Math.max(1, Number(e.target.value) || 0))} className="mt-1" />
            </div>
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Aptidão agrícola</span>
                <span className="text-foreground">{aptidao}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={aptidao}
                onChange={(e) => setAptidao(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Considera relevo, solo, hidrografia, acesso e infraestrutura.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Valor por hectare</p>
              <p className="font-display text-2xl font-semibold">{fmtBRLFull(valorHaAjustado)}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Valor estimado ({fmtHa(areaHa)})</p>
              <p className="font-display text-3xl font-semibold text-primary">{fmtBRLFull(valorTotal)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Faixa: {fmtBRLFull(min)} — {fmtBRLFull(max)}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Evolução do R$/ha na região</h2>
              <span className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="h-3 w-3" />{crescimentoAnual}% a.a.
              </span>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={valuationHistorico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="ano" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v: number) => fmtBRLFull(v)}
                    contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }}
                  />
                  <ReferenceLine y={valorHaAjustado} stroke="var(--color-primary)" strokeDasharray="4 4" label={{ value: "Estimativa", fill: "var(--color-primary)", fontSize: 11, position: "insideTopRight" }} />
                  <Line type="monotone" dataKey="valorHa" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="font-medium">Comparáveis recentes</h2>
              <p className="text-xs text-muted-foreground">Transações usadas como referência para o R$/ha.</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Fazenda</th>
                  <th className="px-4 py-2">Município</th>
                  <th className="px-4 py-2 text-right">Área</th>
                  <th className="px-4 py-2 text-right">R$/ha</th>
                  <th className="px-4 py-2">Distância</th>
                  <th className="px-4 py-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {comparaveis.map((c) => (
                  <tr key={c.fazenda} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">{c.fazenda}</td>
                    <td className="px-4 py-2 text-muted-foreground">{c.municipio}</td>
                    <td className="px-4 py-2 text-right">{fmtHa(c.areaHa)}</td>
                    <td className="px-4 py-2 text-right font-medium">{fmtBRLFull(c.valorHa)}</td>
                    <td className="px-4 py-2 text-muted-foreground">{c.distancia}</td>
                    <td className="px-4 py-2 text-muted-foreground">{c.data}</td>
                  </tr>
                ))}
                <tr className="border-t border-border bg-muted/30 font-medium">
                  <td className="px-4 py-2" colSpan={3}>Média dos comparáveis</td>
                  <td className="px-4 py-2 text-right">{fmtBRLFull(Math.round(media))}</td>
                  <td className="px-4 py-2" colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
