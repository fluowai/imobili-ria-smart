import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeBuoy, MessageSquare, BookOpen, Plus, Search, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { tickets, artigosHelp, type TicketSuporte } from "@/mocks/sistema";

export const Route = createFileRoute("/app/suporte")({
  head: () => ({
    meta: [
      { title: "Suporte — Terra & Lar | ImobiOS" },
      { name: "description", content: "Central de suporte, tickets e base de conhecimento." },
    ],
  }),
  component: SuportePage,
});

const statusMeta: Record<
  TicketSuporte["status"],
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  aberto:      { label: "Aberto",      className: "bg-[color:var(--color-info)]/15 text-[color:var(--color-info)]",   Icon: AlertCircle },
  andamento:   { label: "Em andamento",className: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]", Icon: Loader2 },
  aguardando:  { label: "Aguardando",  className: "bg-muted text-muted-foreground",                                       Icon: Clock },
  resolvido:   { label: "Resolvido",   className: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]", Icon: CheckCircle2 },
};

const prioMeta: Record<TicketSuporte["prioridade"], string> = {
  baixa:   "text-muted-foreground",
  media:   "text-[color:var(--color-info)]",
  alta:    "text-[color:var(--color-warning)]",
  critica: "text-[color:var(--color-destructive)]",
};

function SuportePage() {
  const [q, setQ] = useState("");
  const filtrados = useMemo(
    () => tickets.filter((t) => q === "" || t.assunto.toLowerCase().includes(q.toLowerCase()) || t.id.includes(q)),
    [q],
  );

  const abertos = tickets.filter((t) => t.status !== "resolvido").length;
  const resolvidos = tickets.filter((t) => t.status === "resolvido").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sistema"
        title="Suporte"
        description="Central de ajuda, tickets e base de conhecimento."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="size-4" /> Abrir ticket
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Tickets abertos"  value={abertos.toString()} icon={LifeBuoy} />
        <StatCard label="Resolvidos (mês)" value={resolvidos.toString()} trend="up" delta="+40%" />
        <StatCard label="Tempo médio 1ª resposta" value="42 min" hint="SLA 2 h" />
        <StatCard label="Satisfação (CSAT)" value="4,7 / 5" trend="up" delta="+0,2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Meus tickets</h2>
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Ticket</th>
                  <th className="px-4 py-3">Prioridade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((t) => {
                  const s = statusMeta[t.status];
                  return (
                    <tr key={t.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{t.assunto}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.id} · {t.categoria}
                          {t.responsavel ? ` · ${t.responsavel}` : ""}
                        </p>
                      </td>
                      <td className={`px-4 py-3 text-xs font-medium capitalize ${prioMeta[t.prioridade]}`}>
                        {t.prioridade}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${s.className}`}>
                          <s.Icon className="size-3.5" />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{t.ultimaAtualizacao}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <h3 className="font-display font-semibold">Fale com um humano</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Suporte em português, seg–sex das 8h às 20h.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>💬 WhatsApp: (65) 99999-0001</p>
              <p>📧 suporte@imobios.app</p>
              <p>📞 0800 111 2020</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <h3 className="font-display font-semibold">Base de conhecimento</h3>
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              {artigosHelp.map((a) => (
                <li key={a.titulo} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                  <p className="font-medium text-foreground">{a.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.categoria} · {a.min} min · {a.views.toLocaleString("pt-BR")} views
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
