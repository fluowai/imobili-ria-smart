import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plug, Search, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { integracoes, type IntegracaoCategoria } from "@/mocks/sistema";

export const Route = createFileRoute("/app/integracoes")({
  head: () => ({
    meta: [
      { title: "Integrações — Terra & Lar | ImobiOS" },
      { name: "description", content: "Marketplace de integrações do ImobiOS." },
    ],
  }),
  component: IntegracoesPage,
});

const categorias: { id: "todas" | IntegracaoCategoria; label: string }[] = [
  { id: "todas",         label: "Todas" },
  { id: "comunicacao",   label: "Comunicação" },
  { id: "marketing",     label: "Marketing" },
  { id: "crm",           label: "CRM" },
  { id: "financeiro",    label: "Financeiro" },
  { id: "documentos",    label: "Documentos" },
  { id: "produtividade", label: "Produtividade" },
];

function IntegracoesPage() {
  const [cat, setCat] = useState<(typeof categorias)[number]["id"]>("todas");
  const [q, setQ] = useState("");

  const lista = useMemo(
    () =>
      integracoes.filter(
        (i) =>
          (cat === "todas" || i.categoria === cat) &&
          (q === "" || i.nome.toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, q],
  );

  const conectadas = integracoes.filter((i) => i.conectado).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sistema"
        title="Integrações"
        description={`Marketplace de integrações — ${conectadas} de ${integracoes.length} ativas.`}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                cat === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar integração..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lista.map((i) => (
          <div key={i.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-muted text-2xl">{i.logo}</span>
                <div>
                  <p className="font-semibold text-foreground">{i.nome}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{i.categoria}</p>
                </div>
              </div>
              {i.conectado ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-success)]/15 px-2 py-1 text-xs font-medium text-[color:var(--color-success)]">
                  <CheckCircle2 className="size-3.5" /> Ativa
                </span>
              ) : null}
            </div>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{i.descricao}</p>
            <button
              className={`mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                i.conectado
                  ? "border border-border text-foreground hover:border-primary/50"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              <Plug className="size-4" />
              {i.conectado ? "Gerenciar" : "Conectar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
