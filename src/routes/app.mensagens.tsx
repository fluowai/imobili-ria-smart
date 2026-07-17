import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Paperclip, Search, Send, Smile } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mensagens } from "@/mocks/app";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens — Terra & Lar | ImobiOS" },
      { name: "description", content: "Inbox unificado: WhatsApp, Instagram, portal e email." },
    ],
  }),
  component: MensagensPage,
});

const canalStyle: Record<string, string> = {
  whatsapp: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
  instagram: "bg-[color:var(--color-chart-4)]/15 text-[color:var(--color-chart-4)]",
  portal: "bg-[color:var(--color-chart-2)]/15 text-[color:var(--color-chart-2)]",
  email: "bg-secondary text-muted-foreground",
};

function MensagensPage() {
  const [selecionada, setSelecionada] = useState(mensagens[0]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Mensagens"
        description="Inbox unificado de todos os canais de atendimento."
      />

      <div className="grid h-[calc(100vh-14rem)] overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[340px_1fr]">
        {/* Lista */}
        <div className="flex min-h-0 flex-col border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar conversas..." className="pl-9" />
            </div>
            <Tabs defaultValue="todas" className="mt-3">
              <TabsList className="w-full">
                <TabsTrigger value="todas" className="flex-1">Todas</TabsTrigger>
                <TabsTrigger value="nao-lidas" className="flex-1">Não lidas</TabsTrigger>
                <TabsTrigger value="minhas" className="flex-1">Minhas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {mensagens.map((m) => {
              const active = selecionada.id === m.id;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => setSelecionada(m)}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent",
                      active && "bg-accent",
                    )}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                      {m.avatar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">{m.nome}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">{m.quando}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[10px] uppercase",
                            canalStyle[m.canal],
                          )}
                        >
                          {m.canal}
                        </span>
                        <p className="truncate text-sm text-muted-foreground">{m.previa}</p>
                      </div>
                    </div>
                    {m.naoLidas > 0 && (
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                        {m.naoLidas}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Conversa */}
        <div className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {selecionada.avatar}
              </span>
              <div>
                <p className="font-medium">{selecionada.nome}</p>
                <p className="text-xs text-muted-foreground">via {selecionada.canal}</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Ver ficha do lead</Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-6">
            <MsgBubble mine={false}>Oi, tudo bem? Vi o apartamento no site 👋</MsgBubble>
            <MsgBubble mine>Olá {selecionada.nome.split(" ")[0]}! Tudo ótimo, obrigado. Posso agendar uma visita?</MsgBubble>
            <MsgBubble mine={false}>{selecionada.previa}</MsgBubble>
            <MsgBubble mine>Claro! Que tal amanhã de manhã, 10h?</MsgBubble>
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Paperclip className="size-4" /></Button>
              <Button variant="ghost" size="icon"><Smile className="size-4" /></Button>
              <Input placeholder="Escreva uma mensagem..." className="flex-1" />
              <Button size="icon"><Send className="size-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MsgBubble({ mine, children }: { mine?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-md rounded-2xl px-4 py-2 text-sm",
          mine
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
