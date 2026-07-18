import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Calendar, Download, Play, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { relatoriosDisponiveis } from "@/mocks/crescimento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — ImobiOS" },
      {
        name: "description",
        content: "Biblioteca de relatórios agendados e sob demanda para toda a operação.",
      },
    ],
  }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const categorias = Array.from(new Set(relatoriosDisponiveis.map((r) => r.categoria)));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Relatórios"
        description="Biblioteca de relatórios agendados e sob demanda para toda a operação."
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo relatório
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Relatórios" valor={relatoriosDisponiveis.length} />
        <Kpi label="Agendados" valor={relatoriosDisponiveis.filter((r) => r.scheduled).length} />
        <Kpi label="Categorias" valor={categorias.length} />
        <Kpi label="Enviados · mês" valor="128" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatoriosDisponiveis.map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-medium">{r.nome}</h3>
                <Badge variant="outline" className="mt-0.5 text-[10px]">
                  {r.categoria}
                </Badge>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Última execução: <span className="text-foreground">{r.ultimo}</span>
              </p>
              <p className="flex items-center gap-1">
                {r.scheduled ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Agendado (diário 07h)</span>
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    <span>Sob demanda</span>
                  </>
                )}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Play className="mr-1 h-3.5 w-3.5" />
                Executar
              </Button>
              <Button size="sm" variant="ghost" className="w-9 p-0">
                <Download className="h-4 w-4" />
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
