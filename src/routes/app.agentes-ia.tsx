import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, MessageSquare, Sparkles, Plus, Settings, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { agentesIA } from "@/mocks/crescimento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/agentes-ia")({
  head: () => ({
    meta: [
      { title: "Agentes IA — ImobiOS" },
      {
        name: "description",
        content: "Agentes de IA que atendem, qualificam, negociam e automatizam a operação.",
      },
    ],
  }),
  component: AgentesPage,
});

function AgentesPage() {
  const [agentes, setAgentes] = useState(agentesIA);
  const ativos = agentes.filter((a) => a.ativo).length;
  const conversas = agentes.reduce((a, x) => a + x.conversas, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Agentes IA"
        description="Agentes autônomos que atendem, qualificam, produzem conteúdo e automatizam tarefas."
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Criar agente
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Agentes ativos" valor={ativos} />
        <Kpi label="Conversas · mês" valor={conversas.toLocaleString("pt-BR")} />
        <Kpi
          label="Média de conversão"
          valor={`${Math.round(agentes.filter((a) => a.conversao > 0).reduce((a, x) => a + x.conversao, 0) / agentes.filter((a) => a.conversao > 0).length)}%`}
        />
        <Kpi label="Modelos em uso" valor={new Set(agentes.map((a) => a.modelo)).size} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agentes.map((a) => (
          <article
            key={a.id}
            className={cn(
              "rounded-xl border p-5 transition",
              a.ativo
                ? "border-border bg-card"
                : "border-dashed border-border bg-muted/30 opacity-70",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow"
                  style={{ background: a.cor }}
                >
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{a.nome}</h3>
                  <p className="text-xs text-muted-foreground">{a.papel}</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setAgentes((list) =>
                    list.map((x) => (x.id === a.id ? { ...x, ativo: !x.ativo } : x)),
                  )
                }
                className={cn(
                  "relative h-5 w-9 rounded-full transition",
                  a.ativo ? "bg-primary" : "bg-muted-foreground/30",
                )}
                aria-label="Alternar"
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition",
                    a.ativo ? "left-4" : "left-0.5",
                  )}
                />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border bg-background p-2">
                <p className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  Conversas
                </p>
                <p className="mt-0.5 font-display text-base font-semibold">
                  {a.conversas.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-2">
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  Conversão
                </p>
                <p className="mt-0.5 font-display text-base font-semibold">
                  {a.conversao > 0 ? `${a.conversao}%` : "—"}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <Badge variant="outline" className="font-mono text-[10px]">
                {a.modelo}
              </Badge>
              <span className="text-muted-foreground">
                Economia: <span className="font-medium text-foreground">{a.economia}</span>
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Testar
              </Button>
              <Button size="sm" variant="ghost" className="w-9 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Kpi({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{valor}</p>
    </div>
  );
}
