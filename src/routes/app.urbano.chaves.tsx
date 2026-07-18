import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { KeyRound, CheckCircle2, AlertTriangle, User, MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { chaves, type Chave } from "@/mocks/urbano";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/urbano/chaves")({
  head: () => ({
    meta: [
      { title: "Controle de Chaves — ImobiOS" },
      {
        name: "description",
        content: "Rastreamento de chaves: quem retirou, quando, cofre, atrasos.",
      },
    ],
  }),
  component: ChavesPage,
});

const statusInfo: Record<
  Chave["status"],
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  disponivel: {
    label: "Disponível",
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  emprestada: {
    label: "Emprestada",
    icon: KeyRound,
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  atrasada: {
    label: "Atrasada",
    icon: AlertTriangle,
    className: "bg-red-500/15 text-red-700 dark:text-red-300",
  },
};

function ChavesPage() {
  const [filtro, setFiltro] = useState<Chave["status"] | "todos">("todos");
  const filtradas = useMemo(
    () => chaves.filter((c) => filtro === "todos" || c.status === filtro),
    [filtro],
  );

  const kpis = useMemo(
    () => ({
      disp: chaves.filter((c) => c.status === "disponivel").length,
      empr: chaves.filter((c) => c.status === "emprestada").length,
      atr: chaves.filter((c) => c.status === "atrasada").length,
      total: chaves.reduce((a, c) => a + c.copias, 0),
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Carteira Urbana"
        title="Controle de Chaves"
        description="Rastreie chaves da carteira: cofre, retirada, prazo de devolução e finalidade."
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Registrar retirada
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Disponíveis" valor={kpis.disp} tone="emerald" />
        <Kpi label="Emprestadas" valor={kpis.empr} tone="blue" />
        <Kpi label="Em atraso" valor={kpis.atr} tone="red" />
        <Kpi label="Cópias totais" valor={kpis.total} tone="default" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["todos", "disponivel", "emprestada", "atrasada"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              filtro === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted",
            )}
          >
            {f === "todos" ? "Todas" : statusInfo[f].label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtradas.map((c) => {
          const Icon = statusInfo[c.status].icon;
          return (
            <article key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      statusInfo[c.status].className,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">{c.imovelCodigo}</p>
                    <h3 className="truncate font-medium">{c.imovelTitulo}</h3>
                  </div>
                </div>
                <Badge className={cn("border-none", statusInfo[c.status].className)}>
                  {statusInfo[c.status].label}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="uppercase tracking-wide text-muted-foreground">Cópias</p>
                  <p className="mt-0.5 font-medium">{c.copias}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 uppercase tracking-wide text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Local
                  </p>
                  <p className="mt-0.5 truncate font-medium">{c.local}</p>
                </div>
                {c.comQuem && (
                  <div className="col-span-2">
                    <p className="flex items-center gap-1 uppercase tracking-wide text-muted-foreground">
                      <User className="h-3 w-3" />
                      Com
                    </p>
                    <p className="mt-0.5 truncate font-medium">
                      {c.comQuem} ·{" "}
                      <span className="font-normal text-muted-foreground">desde {c.desde}</span>
                    </p>
                  </div>
                )}
                {c.finalidade && (
                  <div className="col-span-2">
                    <p className="uppercase tracking-wide text-muted-foreground">Finalidade</p>
                    <p className="mt-0.5">{c.finalidade}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                {c.status === "disponivel" ? (
                  <Button size="sm" className="flex-1">
                    Emprestar
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="flex-1">
                    Devolver
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Histórico
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
  tone,
}: {
  label: string;
  valor: number;
  tone: "emerald" | "blue" | "red" | "default";
}) {
  const cls = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    red: "text-red-600 dark:text-red-400",
    default: "text-foreground",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-2xl font-semibold", cls)}>{valor}</p>
    </div>
  );
}
