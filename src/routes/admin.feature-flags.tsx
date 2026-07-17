import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { featureFlags } from "@/mocks/admin";

export const Route = createFileRoute("/admin/feature-flags")({
  head: () => ({
    meta: [
      { title: "Feature Flags — Super Admin | ImobiOS" },
      { name: "description", content: "Ativação gradual de funcionalidades por cliente." },
    ],
  }),
  component: FlagsPage,
});

function FlagsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Plataforma"
        title="Feature Flags"
        description="Ative recursos experimentais para grupos específicos de clientes."
        actions={<Button size="sm">Nova flag</Button>}
      />

      <div className="space-y-3">
        {featureFlags.map((f) => (
          <div
            key={f.key}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{f.nome}</p>
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {f.key}
                </code>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{f.descricao}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-40">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Cobertura</span>
                  <span className="tabular-nums">{f.cobertura}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${f.cobertura}%` }} />
                </div>
              </div>
              <Switch defaultChecked={f.ativo} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
