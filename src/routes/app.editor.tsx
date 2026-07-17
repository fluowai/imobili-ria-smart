import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutTemplate, MousePointer2, Type, Image as ImageIcon, Columns2, Undo2, Save, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/editor")({
  head: () => ({
    meta: [
      { title: "Editor Visual — ImobiOS" },
      { name: "description", content: "Editor drag-and-drop para páginas do site e landing pages." },
    ],
  }),
  component: EditorPage,
});

type Bloco = { id: string; tipo: "hero" | "grid" | "cta" | "texto" | "galeria"; label: string };

const inicial: Bloco[] = [
  { id: "b1", tipo: "hero",    label: "Hero · Busca de imóveis" },
  { id: "b2", tipo: "grid",    label: "Grid · Imóveis em destaque" },
  { id: "b3", tipo: "texto",   label: "Texto · Quem somos" },
  { id: "b4", tipo: "galeria", label: "Galeria · Empreendimentos" },
  { id: "b5", tipo: "cta",     label: "CTA · Fale com um consultor" },
];

const blocosDisponiveis: { tipo: Bloco["tipo"]; label: string; icon: typeof Type }[] = [
  { tipo: "hero",    label: "Hero",    icon: LayoutTemplate },
  { tipo: "grid",    label: "Grid",    icon: Columns2 },
  { tipo: "galeria", label: "Galeria", icon: ImageIcon },
  { tipo: "texto",   label: "Texto",   icon: Type },
  { tipo: "cta",     label: "CTA",     icon: MousePointer2 },
];

function EditorPage() {
  const [blocos, setBlocos] = useState<Bloco[]>(inicial);
  const [sel, setSel] = useState<string | null>("b1");

  function addBloco(tipo: Bloco["tipo"]) {
    const novo: Bloco = { id: `b${Date.now()}`, tipo, label: `Novo bloco · ${tipo}` };
    setBlocos((b) => [...b, novo]);
    setSel(novo.id);
  }

  function mover(id: string, dir: -1 | 1) {
    setBlocos((b) => {
      const i = b.findIndex((x) => x.id === id);
      const j = i + dir;
      if (j < 0 || j >= b.length) return b;
      const copy = [...b];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Editor Visual"
        description="Monte páginas do site ou landing pages com blocos prontos, arrastando e soltando."
        actions={
          <>
            <Button variant="outline" size="sm"><Undo2 className="mr-2 h-4 w-4" />Desfazer</Button>
            <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />Pré-visualizar</Button>
            <Button size="sm"><Save className="mr-2 h-4 w-4" />Publicar</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_260px]">
        <aside className="rounded-xl border border-border bg-card p-4 h-fit">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blocos</p>
          <div className="mt-3 grid gap-2">
            {blocosDisponiveis.map((b) => {
              const Icon = b.icon;
              return (
                <button key={b.tipo} onClick={() => addBloco(b.tipo)} className="flex items-center gap-2 rounded-lg border border-border bg-background p-2 text-sm hover:border-primary hover:bg-muted">
                  <Icon className="h-4 w-4 text-primary" />
                  {b.label}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">Clique num bloco para adicionar ao canvas.</p>
        </aside>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Canvas · Landing Cuiabá</p>
            <div className="flex gap-1">
              <button className="rounded-md border border-input bg-background px-2 py-0.5 text-[10px]">Desktop</button>
              <button className="rounded-md border border-input bg-muted px-2 py-0.5 text-[10px]">Mobile</button>
            </div>
          </div>
          <div className="space-y-2">
            {blocos.map((b) => (
              <div
                key={b.id}
                onClick={() => setSel(b.id)}
                className={cn(
                  "group flex cursor-pointer items-center justify-between rounded-lg border p-4 transition",
                  sel === b.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono uppercase">{b.tipo}</span>
                  <span className="text-sm font-medium">{b.label}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); mover(b.id, -1); }} className="rounded border border-border bg-background px-2 text-xs">↑</button>
                  <button onClick={(e) => { e.stopPropagation(); mover(b.id, 1); }}  className="rounded border border-border bg-background px-2 text-xs">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-card p-4 h-fit">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Propriedades</p>
          {sel ? (
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <label className="text-xs text-muted-foreground">Título</label>
                <input defaultValue="Encontre seu novo lar" className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cor de fundo</label>
                <div className="mt-2 flex gap-1.5">
                  {["#ffffff", "#f0fdfa", "#0f172a", "#0d9488"].map((c) => (
                    <button key={c} className="h-6 w-6 rounded-full border border-border" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Alinhamento</label>
                <div className="mt-2 flex gap-1 rounded-md border border-input p-0.5 text-[11px]">
                  {["Esq.", "Centro", "Dir."].map((a, i) => (
                    <button key={a} className={cn("flex-1 rounded px-2 py-1", i === 1 && "bg-primary text-primary-foreground")}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">Selecione um bloco para editar.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
