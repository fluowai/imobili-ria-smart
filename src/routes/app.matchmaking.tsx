import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, User, Home, MessageSquare, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { matches } from "@/mocks/crescimento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/matchmaking")({
  head: () => ({
    meta: [
      { title: "Matchmaking 360 — ImobiOS" },
      { name: "description", content: "Casamentos entre clientes e imóveis usando IA multi-critério." },
    ],
  }),
  component: MatchmakingPage,
});

function MatchmakingPage() {
  const [min, setMin] = useState(70);

  const filtrados = useMemo(() => matches.filter((m) => m.score >= min).sort((a, b) => b.score - a.score), [min]);

  const kpis = useMemo(() => {
    const alto = matches.filter((m) => m.score >= 85).length;
    const medio = matches.filter((m) => m.score >= 70 && m.score < 85).length;
    return { alto, medio, media: Math.round(matches.reduce((a, m) => a + m.score, 0) / matches.length) };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Matchmaking 360"
        description="A IA cruza o perfil de cada cliente com toda a carteira e sugere os melhores encontros."
        actions={<Button size="sm"><Sparkles className="mr-2 h-4 w-4" />Rodar matching agora</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Total de matches" valor={matches.length} />
        <Kpi label="Score alto (≥85)" valor={kpis.alto} tone="emerald" />
        <Kpi label="Score médio (70-84)" valor={kpis.medio} tone="amber" />
        <Kpi label="Score médio geral" valor={`${kpis.media}%`} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <label className="flex items-center justify-between text-sm font-medium">
          <span>Filtro por score mínimo</span>
          <span className="text-primary">{min}%</span>
        </label>
        <input type="range" min={0} max={100} value={min} onChange={(e) => setMin(Number(e.target.value))} className="mt-2 w-full accent-primary" />
      </div>

      <div className="grid gap-4">
        {filtrados.map((m) => {
          const tone = m.score >= 85 ? "emerald" : m.score >= 70 ? "amber" : "muted";
          const cls = { emerald: "text-emerald-600 dark:text-emerald-400", amber: "text-amber-600 dark:text-amber-400", muted: "text-muted-foreground" }[tone];
          const ring = { emerald: "stroke-emerald-500", amber: "stroke-amber-500", muted: "stroke-muted-foreground" }[tone];
          const c = 2 * Math.PI * 22;
          const off = c - (m.score / 100) * c;
          return (
            <article key={m.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                  <svg width="56" height="56" className="-rotate-90">
                    <circle cx="28" cy="28" r="22" strokeWidth="4" className="stroke-muted" fill="none" />
                    <circle cx="28" cy="28" r="22" strokeWidth="4" className={cn("transition-all", ring)} fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
                  </svg>
                  <span className={cn("absolute font-display text-sm font-bold", cls)}>{m.score}</span>
                </div>

                <div className="grid flex-1 gap-3 md:grid-cols-[1fr_auto_1fr]">
                  <div>
                    <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground"><User className="h-3 w-3" />Cliente</p>
                    <p className="mt-0.5 font-medium">{m.cliente}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{m.perfil}</p>
                  </div>
                  <ArrowRight className="hidden h-5 w-5 self-center text-muted-foreground md:block" />
                  <div>
                    <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground"><Home className="h-3 w-3" />Imóvel sugerido</p>
                    <p className="mt-0.5 font-medium">{m.imovel}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.motivos.map((mo) => <Badge key={mo} variant="outline" className="text-[10px]">{mo}</Badge>)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-muted-foreground">Último contato: {m.ultimoContato}</span>
                  <span className="text-xs text-muted-foreground">Responsável: <span className="font-medium text-foreground">{m.responsavel}</span></span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><MessageSquare className="mr-1 h-3.5 w-3.5" />Falar</Button>
                    <Button size="sm">Agendar visita</Button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        {filtrados.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">Nenhum match com esse score mínimo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, valor, tone }: { label: string; valor: string | number; tone?: "emerald" | "amber" }) {
  const cls = tone === "emerald" ? "text-emerald-600 dark:text-emerald-400" : tone === "amber" ? "text-amber-600 dark:text-amber-400" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-2xl font-semibold", cls)}>{valor}</p>
    </div>
  );
}
