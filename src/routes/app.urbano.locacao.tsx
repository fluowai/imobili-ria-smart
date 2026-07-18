import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { KeyRound, AlertTriangle, CheckCircle2, Clock, FileText, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { contratosLocacao, fmtBRLFull, type ContratoLocacao } from "@/mocks/urbano";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/urbano/locacao")({
  head: () => ({
    meta: [
      { title: "Gestão de Locação — ImobiOS" },
      {
        name: "description",
        content: "Contratos de locação, reajustes, cobrança e repasses ao proprietário.",
      },
    ],
  }),
  component: LocacaoPage,
});

const statusInfo: Record<
  ContratoLocacao["status"],
  { label: string; icon: typeof Clock; className: string }
> = {
  ativo: {
    label: "Ativo",
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  atrasado: {
    label: "Atrasado",
    icon: AlertTriangle,
    className: "bg-red-500/15 text-red-700 dark:text-red-300",
  },
  renovacao: {
    label: "Renovação",
    icon: Clock,
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  encerrado: { label: "Encerrado", icon: FileText, className: "bg-muted text-muted-foreground" },
};

function LocacaoPage() {
  const [filtro, setFiltro] = useState<ContratoLocacao["status"] | "todos">("todos");

  const filtrados = useMemo(
    () => contratosLocacao.filter((c) => filtro === "todos" || c.status === filtro),
    [filtro],
  );

  const kpis = useMemo(() => {
    const ativos = contratosLocacao.filter((c) => c.status === "ativo").length;
    const atrasados = contratosLocacao.filter((c) => c.status === "atrasado").length;
    const receitaMensal = contratosLocacao
      .filter((c) => c.status === "ativo" || c.status === "atrasado")
      .reduce((acc, c) => acc + c.aluguel, 0);
    const renovacao = contratosLocacao.filter((c) => c.status === "renovacao").length;
    return { ativos, atrasados, receitaMensal, renovacao };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Carteira Urbana"
        title="Gestão de Locação"
        description="Contratos ativos, reajustes automáticos, cobrança e repasse ao proprietário."
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo contrato
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Contratos ativos" valor={kpis.ativos} tone="emerald" />
        <Kpi label="Em atraso" valor={kpis.atrasados} tone="red" />
        <Kpi label="Renovação em curso" valor={kpis.renovacao} tone="amber" />
        <Kpi label="Receita mensal" valor={fmtBRLFull(kpis.receitaMensal)} tone="default" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["todos", "ativo", "atrasado", "renovacao", "encerrado"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition",
              filtro === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted",
            )}
          >
            {f === "todos" ? "Todos" : statusInfo[f].label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Contrato</th>
              <th className="px-4 py-3">Imóvel</th>
              <th className="px-4 py-3">Locatário</th>
              <th className="px-4 py-3">Proprietário</th>
              <th className="px-4 py-3">Vigência</th>
              <th className="px-4 py-3 text-right">Aluguel</th>
              <th className="px-4 py-3">Reajuste</th>
              <th className="px-4 py-3">Próx. venc.</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => {
              const Icon = statusInfo[c.status].icon;
              return (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3">{c.imovelTitulo}</td>
                  <td className="px-4 py-3">{c.locatario}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.proprietario}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {c.inicio} → {c.fim}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{fmtBRLFull(c.aluguel)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.reajuste}</td>
                  <td className="px-4 py-3 text-xs">{c.proximoVencimento}</td>
                  <td className="px-4 py-3">
                    <Badge className={cn("gap-1 border-none", statusInfo[c.status].className)}>
                      <Icon className="h-3 w-3" />
                      {statusInfo[c.status].label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-medium">Fluxo de repasses do mês</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pagamentos aos proprietários programados para os próximos 7 dias.
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { p: "Cláudia Souza", v: 5040, quando: "05/ago" },
              { p: "Roberto Lima", v: 3610, quando: "05/ago" },
              { p: "Aluguéis SA", v: 1520, quando: "10/ago" },
              { p: "Imóveis Águia", v: 22800, quando: "01/ago" },
            ].map((r) => (
              <li
                key={r.p}
                className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
              >
                <span>{r.p}</span>
                <span className="text-right">
                  <span className="font-medium">{fmtBRLFull(r.v)}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{r.quando}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-medium">Ações rápidas</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Automatize tarefas comuns da gestão locatícia.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Button variant="outline" className="justify-start">
              <KeyRound className="mr-2 h-4 w-4" />
              Vistoria de saída
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Gerar boleto
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Calcular reajuste
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Notificar atraso
            </Button>
          </div>
        </div>
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
  valor: string | number;
  tone: "emerald" | "red" | "amber" | "default";
}) {
  const toneCls = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    red: "text-red-600 dark:text-red-400",
    amber: "text-amber-600 dark:text-amber-400",
    default: "text-foreground",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-2xl font-semibold", toneCls)}>{valor}</p>
    </div>
  );
}
