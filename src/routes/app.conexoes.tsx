import { createFileRoute } from "@tanstack/react-router";
import { Link2, RefreshCw, Zap, CheckCircle2, AlertCircle, PauseCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { portais, type PortalStatus } from "@/mocks/sistema";

export const Route = createFileRoute("/app/conexoes")({
  head: () => ({
    meta: [
      { title: "Conexões — Terra & Lar | ImobiOS" },
      { name: "description", content: "Conexões com portais imobiliários (ZAP, Viva Real, OLX)." },
    ],
  }),
  component: ConexoesPage,
});

const statusMeta: Record<PortalStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  conectado: { label: "Conectado", className: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",       Icon: CheckCircle2 },
  erro:      { label: "Erro",      className: "bg-[color:var(--color-destructive)]/15 text-[color:var(--color-destructive)]", Icon: AlertCircle },
  pausado:   { label: "Pausado",   className: "bg-muted text-muted-foreground",                                              Icon: PauseCircle },
  pendente:  { label: "Pendente",  className: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",         Icon: Clock },
};

function ConexoesPage() {
  const total = portais.length;
  const conectados = portais.filter((p) => p.status === "conectado").length;
  const imoveis = portais.reduce((s, p) => s + p.imoveisPublicados, 0);
  const leads = portais.reduce((s, p) => s + p.leadsMes, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sistema"
        title="Conexões"
        description="Publicação e sincronização automática com portais imobiliários."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <RefreshCw className="size-4" /> Sincronizar tudo
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Portais" value={`${conectados}/${total}`} icon={Link2} hint="ativos" />
        <StatCard label="Imóveis publicados" value={imoveis.toLocaleString("pt-BR")} icon={Zap} trend="up" delta="+18" />
        <StatCard label="Leads no mês" value={leads.toLocaleString("pt-BR")} trend="up" delta="+12%" />
        <StatCard label="Uptime médio" value="99,4%" hint="últimos 30 dias" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {portais.map((p) => {
          const meta = statusMeta[p.status];
          return (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-muted text-2xl">{p.logo}</span>
                  <div>
                    <p className="font-semibold text-foreground">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">Plano: {p.plano}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>
                  <meta.Icon className="size-3.5" />
                  {meta.label}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Imóveis</p>
                  <p className="font-display text-lg font-semibold">{p.imoveisPublicados}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Leads / mês</p>
                  <p className="font-display text-lg font-semibold">{p.leadsMes}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Última sync: {p.ultimaSync}</span>
                <button className="rounded-lg border border-border px-2.5 py-1 hover:border-primary/50 hover:text-foreground">
                  Configurar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
