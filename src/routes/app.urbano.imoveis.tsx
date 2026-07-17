import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Search, Plus, Eye, Star, MapPin, BedDouble, Bath, Car, Ruler, Filter, Grid3x3, List } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { imoveisUrbanos, fmtBRL, type ImovelStatus, type ImovelTipo, type ImovelFinalidade } from "@/mocks/urbano";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NovoImovelDialog } from "@/components/app/novo-imovel-dialog";

export const Route = createFileRoute("/app/urbano/imoveis")({
  head: () => ({
    meta: [
      { title: "Imóveis Urbanos — ImobiOS" },
      { name: "description", content: "Catálogo completo de imóveis urbanos com galeria, ficha técnica e publicação em portais." },
    ],
  }),
  component: ImoveisUrbanosPage,
});

const statusMap: Record<ImovelStatus, { label: string; className: string }> = {
  disponivel: { label: "Disponível", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  reservado:  { label: "Reservado",  className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  vendido:    { label: "Vendido",    className: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  alugado:    { label: "Alugado",    className: "bg-purple-500/15 text-purple-700 dark:text-purple-300" },
  pausado:    { label: "Pausado",    className: "bg-muted text-muted-foreground" },
};

const tipos: { value: ImovelTipo | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "cobertura", label: "Cobertura" },
  { value: "sala", label: "Sala" },
  { value: "terreno", label: "Terreno" },
  { value: "galpao", label: "Galpão" },
];

const finalidades: { value: ImovelFinalidade | "todos"; label: string }[] = [
  { value: "todos", label: "Venda + Locação" },
  { value: "venda", label: "Venda" },
  { value: "locacao", label: "Locação" },
];

function ImoveisUrbanosPage() {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<ImovelTipo | "todos">("todos");
  const [finalidade, setFinalidade] = useState<ImovelFinalidade | "todos">("todos");
  const [statusSel, setStatusSel] = useState<ImovelStatus | "todos">("todos");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtrados = useMemo(() => {
    return imoveisUrbanos.filter((i) => {
      if (tipo !== "todos" && i.tipo !== tipo) return false;
      if (finalidade !== "todos" && i.finalidade !== finalidade && i.finalidade !== "ambos") return false;
      if (statusSel !== "todos" && i.status !== statusSel) return false;
      if (busca && !`${i.titulo} ${i.codigo} ${i.bairro} ${i.cidade}`.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
  }, [busca, tipo, finalidade, statusSel]);

  const totais = useMemo(() => {
    const total = imoveisUrbanos.length;
    const disponiveis = imoveisUrbanos.filter((i) => i.status === "disponivel").length;
    const vgv = imoveisUrbanos.reduce((acc, i) => acc + i.valorVenda, 0);
    const publicados = imoveisUrbanos.filter((i) => i.publicado).length;
    return { total, disponiveis, vgv, publicados };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Carteira Urbana"
        title="Imóveis Urbanos"
        description="Catálogo completo com galeria, ficha, publicação em portais e histórico."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" />Filtros avançados</Button>
            <NovoImovelDialog tipo="urbano" />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Imóveis ativos", valor: totais.total },
          { label: "Disponíveis", valor: totais.disponiveis },
          { label: "Publicados", valor: totais.publicados },
          { label: "VGV catálogo", valor: fmtBRL(totais.vgv) },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{k.valor}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por código, bairro, cidade..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={tipo} onChange={(e) => setTipo(e.target.value as ImovelTipo | "todos")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            {tipos.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={finalidade} onChange={(e) => setFinalidade(e.target.value as ImovelFinalidade | "todos")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            {finalidades.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={statusSel} onChange={(e) => setStatusSel(e.target.value as ImovelStatus | "todos")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="todos">Todos os status</option>
            {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="flex overflow-hidden rounded-md border border-input">
            <button onClick={() => setView("grid")} className={cn("px-2.5 py-1.5", view === "grid" ? "bg-primary text-primary-foreground" : "bg-background")} aria-label="Grade">
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button onClick={() => setView("list")} className={cn("px-2.5 py-1.5", view === "list" ? "bg-primary text-primary-foreground" : "bg-background")} aria-label="Lista">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium text-foreground">{filtrados.length}</span> de {imoveisUrbanos.length} imóveis
      </p>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtrados.map((i) => (
            <article key={i.id} className="group overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={i.cover} alt={i.titulo} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute left-2 top-2 flex gap-1">
                  <Badge className={cn("border-none", statusMap[i.status].className)}>{statusMap[i.status].label}</Badge>
                  {i.destaque && <Badge className="border-none bg-primary/90 text-primary-foreground"><Star className="mr-1 h-3 w-3" />Destaque</Badge>}
                </div>
                <div className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                  {i.codigo}
                </div>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 font-medium">{i.titulo}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />{i.bairro} · {i.cidade}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  {i.dormitorios > 0 && <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{i.dormitorios}</span>}
                  {i.suites > 0 && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{i.suites}</span>}
                  {i.vagas > 0 && <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" />{i.vagas}</span>}
                  <span className="flex items-center gap-1"><Ruler className="h-3.5 w-3.5" />{i.areaUtil}m²</span>
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  {i.valorVenda > 0 && (
                    <p className="font-display text-lg font-semibold">{fmtBRL(i.valorVenda)}</p>
                  )}
                  {i.valorLocacao > 0 && (
                    <p className="text-xs text-muted-foreground">Aluguel: {fmtBRL(i.valorLocacao)}/mês</p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{i.visualizacoes}</span>
                  <span>{i.captadoPor}</span>
                </div>
              </div>
            </article>
          ))}
          {filtrados.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Nenhum imóvel encontrado com estes filtros.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Imóvel</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Bairro</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Venda</th>
                <th className="px-4 py-3 text-right">Locação</th>
                <th className="px-4 py-3">Captador</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((i) => (
                <tr key={i.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{i.codigo}</td>
                  <td className="px-4 py-3">{i.titulo}</td>
                  <td className="px-4 py-3 capitalize">{i.tipo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.bairro}</td>
                  <td className="px-4 py-3"><Badge className={cn("border-none", statusMap[i.status].className)}>{statusMap[i.status].label}</Badge></td>
                  <td className="px-4 py-3 text-right font-medium">{i.valorVenda > 0 ? fmtBRL(i.valorVenda) : "—"}</td>
                  <td className="px-4 py-3 text-right">{i.valorLocacao > 0 ? fmtBRL(i.valorLocacao) : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.captadoPor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
