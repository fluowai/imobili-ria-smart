import { createFileRoute } from "@tanstack/react-router";
import { Building, Users, AlertCircle, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { condominios, fmtBRLFull } from "@/mocks/urbano";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/urbano/condominios")({
  head: () => ({
    meta: [
      { title: "Condomínios — ImobiOS" },
      { name: "description", content: "Administração de condomínios: unidades, síndico, taxas e inadimplência." },
    ],
  }),
  component: CondominiosPage,
});

function CondominiosPage() {
  const admin = condominios.filter((c) => c.administrado).length;
  const unidades = condominios.reduce((a, c) => a + c.unidades, 0);
  const inadMedia = condominios.reduce((a, c) => a + c.inadimplencia, 0) / condominios.length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Carteira Urbana"
        title="Condomínios"
        description="Cadastro e administração dos condomínios da carteira, com taxas e inadimplência."
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Novo condomínio</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Condomínios" valor={condominios.length} />
        <Kpi label="Sob administração" valor={admin} />
        <Kpi label="Unidades totais" valor={unidades} />
        <Kpi label="Inadimplência média" valor={`${inadMedia.toFixed(1)}%`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {condominios.map((c) => (
          <article key={c.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
            <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
              <img src={c.cover} alt={c.nome} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-medium">{c.nome}</h3>
                  <p className="truncate text-xs text-muted-foreground">{c.endereco}</p>
                </div>
                {c.administrado ? (
                  <Badge className="border-none bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">Administrado</Badge>
                ) : (
                  <Badge variant="outline">Externo</Badge>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5 text-muted-foreground" /><span>{c.unidades} unid.</span></div>
                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span className="truncate">{c.sindico}</span></div>
                <div className="flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5 text-muted-foreground" /><span>{c.inadimplencia}% inad.</span></div>
              </div>
              <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Taxa média</p>
                  <p className="font-display text-lg font-semibold">{fmtBRLFull(c.taxaMedia)}</p>
                </div>
                <Button size="sm" variant="outline">Abrir</Button>
              </div>
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
