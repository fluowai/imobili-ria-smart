import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Plus, Users, MousePointerClick } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { quizzes } from "@/mocks/crescimento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz de qualificação — ImobiOS" },
      {
        name: "description",
        content: "Quizzes interativos que capturam perfis e geram leads qualificados.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const respostas = quizzes.reduce((a, q) => a + q.respostas, 0);
  const leads = quizzes.reduce((a, q) => a + q.leadsGerados, 0);
  const conv = respostas > 0 ? ((leads / respostas) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Quiz de qualificação"
        description="Quizzes interativos que capturam perfil, geram lead qualificado e sugerem imóveis."
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo quiz
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Quizzes ativos" valor={quizzes.filter((q) => q.ativo).length} />
        <Kpi
          label="Respostas totais"
          valor={respostas.toLocaleString("pt-BR")}
          icon={MousePointerClick}
        />
        <Kpi label="Leads gerados" valor={leads.toLocaleString("pt-BR")} icon={Users} />
        <Kpi label="Conversão média" valor={`${conv}%`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((q) => {
          const pct = q.respostas > 0 ? (q.leadsGerados / q.respostas) * 100 : 0;
          return (
            <article key={q.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{q.nome}</h3>
                    <p className="text-xs text-muted-foreground">
                      {q.publico} · {q.perguntas} perguntas
                    </p>
                  </div>
                </div>
                {q.ativo ? (
                  <Badge className="border-none bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline">Pausado</Badge>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Cell label="Respostas" valor={q.respostas.toLocaleString("pt-BR")} />
                <Cell label="Leads" valor={q.leadsGerados} destaque />
                <Cell label="Conversão" valor={`${pct.toFixed(0)}%`} />
              </div>

              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Editar
                </Button>
                <Button size="sm" className="flex-1">
                  Ver respostas
                </Button>
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
  icon: Icon,
}: {
  label: string;
  valor: string | number;
  icon?: typeof Users;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{valor}</p>
    </div>
  );
}

function Cell({
  label,
  valor,
  destaque,
}: {
  label: string;
  valor: string | number;
  destaque?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-2",
        destaque ? "border-primary/40 bg-primary/5" : "border-border bg-muted/30",
      )}
    >
      <p className={cn("font-display text-base font-semibold", destaque && "text-primary")}>
        {valor}
      </p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
