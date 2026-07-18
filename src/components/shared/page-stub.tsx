import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "./page-header";

interface PageStubProps {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: LucideIcon;
  bullets?: string[];
  actions?: ReactNode;
}

/**
 * Placeholder rico para rotas ainda não construídas em detalhe.
 * Mostra contexto suficiente para navegar e apresentar a proposta da tela.
 */
export function PageStub({
  title,
  description,
  eyebrow,
  icon: Icon,
  bullets,
  actions,
}: PageStubProps) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} eyebrow={eyebrow} actions={actions} />
      <div className="grid gap-4 md:grid-cols-3">
        {(bullets ?? ["Em construção", "Dados de exemplo", "UI final em breve"]).map((b) => (
          <div
            key={b}
            className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground"
          >
            {Icon ? <Icon className="mb-3 size-5 text-primary" /> : null}
            {b}
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Este módulo está no roadmap. A estrutura de navegação já está pronta — o conteúdo completo
          será entregue nas próximas fases.
        </p>
      </div>
    </div>
  );
}
