import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { kanbanColunas, leads } from "@/mocks/app";
import type { LeadStatus } from "@/mocks/app";

export const Route = createFileRoute("/app/kanban")({
  head: () => ({
    meta: [
      { title: "Kanban — Terra & Lar | ImobiOS" },
      { name: "description", content: "Pipeline visual de leads e negócios." },
    ],
  }),
  component: KanbanPage,
});

function KanbanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Kanban"
        description="Pipeline visual dos leads em andamento."
        actions={
          <Button size="sm">
            <Plus className="mr-1.5 size-4" />
            Novo card
          </Button>
        }
      />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanColunas.map((col) => {
          const cards = leads.filter((l) => l.status === (col.id as LeadStatus));
          const total = cards.reduce((a, l) => a + l.valor, 0);
          return (
            <div
              key={col.id}
              className="flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border p-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: col.cor }} />
                  <p className="font-medium">{col.titulo}</p>
                  <span className="rounded-full bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
                    {cards.length}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="size-7">
                  <Plus className="size-3.5" />
                </Button>
              </div>
              <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
                R$ {(total / 1000).toFixed(0)}k em pipeline
              </div>
              <div className="flex-1 space-y-2 p-2">
                {cards.map((c) => (
                  <div
                    key={c.id}
                    className="cursor-grab rounded-xl border border-border bg-background p-3 shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    <p className="font-medium text-sm">{c.nome}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.interesse}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-semibold tabular-nums text-primary">
                        R$ {(c.valor / 1000).toFixed(0)}k
                      </span>
                      <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
                        {c.responsavel.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    Nenhum card
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
