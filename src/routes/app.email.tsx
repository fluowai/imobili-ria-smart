import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Archive, Reply, Search, Star, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { emails } from "@/mocks/app";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/email")({
  head: () => ({
    meta: [
      { title: "Email — Terra & Lar | ImobiOS" },
      { name: "description", content: "Caixa de entrada unificada." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [sel, setSel] = useState(emails[0]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Email"
        description="Caixa de entrada unificada da imobiliária."
        actions={<Button size="sm">Escrever</Button>}
      />

      <div className="grid h-[calc(100vh-14rem)] overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[380px_1fr]">
        <div className="flex min-h-0 flex-col border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar emails..." className="pl-9" />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {emails.map((e) => {
              const active = sel.id === e.id;
              return (
                <li key={e.id}>
                  <button
                    onClick={() => setSel(e)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent",
                      active && "bg-accent",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("truncate", e.naoLido ? "font-semibold" : "font-medium")}>
                        {e.remetente}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">{e.quando}</span>
                    </div>
                    <p className={cn("truncate text-sm", e.naoLido && "text-foreground")}>
                      {e.assunto}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{e.previa}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-3">
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold">{sel.assunto}</p>
              <p className="truncate text-xs text-muted-foreground">de {sel.remetente} · {sel.quando}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon"><Star className="size-4" /></Button>
              <Button variant="ghost" size="icon"><Archive className="size-4" /></Button>
              <Button variant="ghost" size="icon"><Trash2 className="size-4" /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed">
            <p>Olá,</p>
            <p className="mt-3">{sel.previa}</p>
            <p className="mt-3">
              Segue em anexo a documentação necessária. Qualquer dúvida, estamos à disposição
              pelos canais habituais.
            </p>
            <p className="mt-3">Atenciosamente,</p>
            <p className="mt-1 font-medium">{sel.remetente}</p>
          </div>

          <div className="border-t border-border p-3">
            <Button size="sm">
              <Reply className="mr-1.5 size-4" />
              Responder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
