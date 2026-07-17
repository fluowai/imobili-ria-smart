import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileSignature, Plus, Search, CheckCircle2, Clock, AlertTriangle, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { contratosDocs, fmtBRLFull, type ContratoStatus, type ContratoTipo } from "@/mocks/gestao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/contratos")({
  head: () => ({
    meta: [
      { title: "Contratos & Jurídico — ImobiOS" },
      { name: "description", content: "Templates de contrato, assinatura digital e controle de vigência." },
    ],
  }),
  component: ContratosPage,
});

const statusMap: Record<ContratoStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  rascunho:   { label: "Rascunho",     className: "bg-muted text-muted-foreground",                                     icon: FileText },
  assinatura: { label: "Em assinatura", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",                icon: Clock },
  ativo:      { label: "Ativo",         className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",          icon: CheckCircle2 },
  vencendo:   { label: "Vencendo",      className: "bg-red-500/15 text-red-700 dark:text-red-300",                       icon: AlertTriangle },
  encerrado:  { label: "Encerrado",     className: "border border-border text-muted-foreground",                          icon: FileText },
};

const tipoLabels: Record<ContratoTipo, string> = {
  venda: "Compra e venda",
  locacao: "Locação",
  captacao: "Captação",
  parceria: "Parceria",
  prestacao: "Prestação",
};

const templates = [
  { nome: "Compra e venda residencial",       usos: 128, atualizado: "há 2 dias" },
  { nome: "Locação residencial 30 meses",     usos: 210, atualizado: "ontem" },
  { nome: "Locação comercial",                 usos: 84,  atualizado: "há 1 semana" },
  { nome: "Captação exclusiva imóvel rural",   usos: 42,  atualizado: "há 3 dias" },
  { nome: "Parceria com portais",              usos: 12,  atualizado: "há 1 mês" },
];

function ContratosPage() {
  const [busca, setBusca] = useState("");
  const [statusSel, setStatusSel] = useState<ContratoStatus | "todos">("todos");

  const filtrados = useMemo(
    () =>
      contratosDocs.filter((c) => {
        if (statusSel !== "todos" && c.status !== statusSel) return false;
        if (busca && !`${c.titulo} ${c.id} ${c.partes.join(" ")}`.toLowerCase().includes(busca.toLowerCase())) return false;
        return true;
      }),
    [busca, statusSel],
  );

  const kpis = useMemo(() => ({
    ativos:   contratosDocs.filter((c) => c.status === "ativo").length,
    assinar:  contratosDocs.filter((c) => c.status === "assinatura").length,
    vencendo: contratosDocs.filter((c) => c.status === "vencendo").length,
    valorAtivo: contratosDocs.filter((c) => c.status === "ativo").reduce((a, c) => a + c.valor, 0),
  }), []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Gestão"
        title="Contratos & Jurídico"
        description="Templates versionados, assinatura eletrônica e alertas de vencimento."
        actions={
          <>
            <Button variant="outline" size="sm">Templates</Button>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Novo contrato</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Ativos" valor={kpis.ativos} />
        <Kpi label="Em assinatura" valor={kpis.assinar} />
        <Kpi label="Vencendo" valor={kpis.vencendo} tone="red" />
        <Kpi label="Valor sob contrato" valor={fmtBRLFull(kpis.valorAtivo)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar contratos por título, ID ou parte..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
            </div>
            <select value={statusSel} onChange={(e) => setStatusSel(e.target.value as ContratoStatus | "todos")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="todos">Todos os status</option>
              {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            {filtrados.map((c) => {
              const Icon = statusMap[c.status].icon;
              const pct = c.totalAssinantes > 0 ? (c.assinadoPor / c.totalAssinantes) * 100 : 0;
              return (
                <article key={c.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-muted-foreground">{c.id} · {tipoLabels[c.tipo]}</p>
                      <h3 className="mt-0.5 truncate font-medium">{c.titulo}</h3>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{c.partes.join(" · ")}</p>
                    </div>
                    <Badge className={cn("gap-1 border-none", statusMap[c.status].className)}>
                      <Icon className="h-3 w-3" />{statusMap[c.status].label}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                    <div><p className="text-muted-foreground">Valor</p><p className="mt-0.5 font-medium">{fmtBRLFull(c.valor)}</p></div>
                    <div><p className="text-muted-foreground">Criado</p><p className="mt-0.5 font-medium">{c.criadoEm}</p></div>
                    <div><p className="text-muted-foreground">Vencimento</p><p className="mt-0.5 font-medium">{c.vencimento ?? "—"}</p></div>
                  </div>

                  {c.totalAssinantes > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Assinaturas</span>
                        <span>{c.assinadoPor}/{c.totalAssinantes}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">Responsável: {c.responsavel}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Abrir</Button>
                      {c.status === "assinatura" && <Button size="sm"><FileSignature className="mr-1 h-3.5 w-3.5" />Cobrar</Button>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 h-fit">
          <h2 className="font-medium">Templates</h2>
          <p className="text-xs text-muted-foreground">Modelos versionados prontos para uso.</p>
          <ul className="mt-4 space-y-3">
            {templates.map((t) => (
              <li key={t.nome} className="rounded-lg border border-border p-3 hover:bg-muted/40 cursor-pointer">
                <p className="text-sm font-medium">{t.nome}</p>
                <p className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{t.usos} usos</span>
                  <span>Atualizado {t.atualizado}</span>
                </p>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-4 w-full"><Plus className="mr-2 h-4 w-4" />Novo template</Button>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, valor, tone }: { label: string; valor: string | number; tone?: "red" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-2xl font-semibold", tone === "red" && "text-red-600 dark:text-red-400")}>{valor}</p>
    </div>
  );
}
