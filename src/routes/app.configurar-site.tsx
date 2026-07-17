import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Palette, Globe, Layout, Search, Save, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/configurar-site")({
  head: () => ({
    meta: [
      { title: "Configurar Site — ImobiOS" },
      { name: "description", content: "Identidade visual, domínio, layout e SEO do portal público." },
    ],
  }),
  component: ConfigurarSitePage,
});

const paletas = [
  { nome: "Verde menta",   cores: ["#0d9488", "#14b8a6", "#5eead4", "#f0fdfa"] },
  { nome: "Azul oceano",   cores: ["#0369a1", "#0ea5e9", "#7dd3fc", "#f0f9ff"] },
  { nome: "Vinho terra",   cores: ["#7f1d1d", "#dc2626", "#fca5a5", "#fef2f2"] },
  { nome: "Ocre pantanal", cores: ["#78350f", "#d97706", "#fcd34d", "#fffbeb"] },
];

const fontes = ["Inter", "Manrope", "Plus Jakarta", "DM Sans", "Space Grotesk"];

const layouts = [
  { nome: "Clássico",  desc: "Hero + grid de imóveis + destaques" },
  { nome: "Editorial", desc: "Blog + storytelling + fotos grandes" },
  { nome: "Investidor", desc: "Filtros avançados + rendimento em destaque" },
  { nome: "Minimal",   desc: "Foco em busca e chamada única" },
];

function ConfigurarSitePage() {
  const [paleta, setPaleta] = useState(0);
  const [fonte, setFonte] = useState(0);
  const [layout, setLayout] = useState(0);
  const [nome, setNome] = useState("Terra & Lar Imóveis");
  const [dominio, setDominio] = useState("terralar.com.br");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Configurar Site"
        description="Identidade visual, domínio, layout base e configurações de SEO do portal público."
        actions={
          <>
            <Button variant="outline" size="sm"><Sparkles className="mr-2 h-4 w-4" />Sugerir com IA</Button>
            <Button size="sm"><Save className="mr-2 h-4 w-4" />Salvar</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><h2 className="font-medium">Identidade</h2></div>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Nome da imobiliária</label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Domínio</label>
              <Input value={dominio} onChange={(e) => setDominio(e.target.value)} className="mt-1" />
              <p className="mt-1 text-[11px] text-muted-foreground">SSL automático · CDN global</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Slogan</label>
              <Input placeholder="Ex.: Onde você quer morar?" className="mt-1" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /><h2 className="font-medium">Paleta de cores</h2></div>
          <div className="mt-4 grid gap-2">
            {paletas.map((p, i) => (
              <button
                key={p.nome}
                onClick={() => setPaleta(i)}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3 text-left transition",
                  paleta === i ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                )}
              >
                <span className="text-sm font-medium">{p.nome}</span>
                <div className="flex gap-1.5">
                  {p.cores.map((c) => <span key={c} className="h-6 w-6 rounded-full border border-border" style={{ background: c }} />)}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2"><Layout className="h-4 w-4 text-primary" /><h2 className="font-medium">Layout</h2></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {layouts.map((l, i) => (
              <button
                key={l.nome}
                onClick={() => setLayout(i)}
                className={cn(
                  "rounded-lg border p-3 text-left transition",
                  layout === i ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                )}
              >
                <p className="text-sm font-medium">{l.nome}</p>
                <p className="mt-1 text-xs text-muted-foreground">{l.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /><h2 className="font-medium">SEO & fonte</h2></div>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Fonte principal</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {fontes.map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setFonte(i)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      fonte === i ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Meta description padrão</label>
              <textarea rows={3} defaultValue="Encontre imóveis para comprar, alugar e investir em Cuiabá e região com atendimento humano e ferramentas inteligentes." className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
