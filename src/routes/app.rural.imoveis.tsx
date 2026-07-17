import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sprout, Search, Plus, MapPin, Droplet, Trees, TrendingUp, FileText, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { fmtBRL, fmtHa, type RuralStatus, type RuralUso } from "@/mocks/rural";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NovoImovelDialog } from "@/components/app/novo-imovel-dialog";
import { listImoveis } from "@/lib/imoveis.functions";

export const Route = createFileRoute("/app/rural/imoveis")({
  head: () => ({
    meta: [
      { title: "Imóveis Rurais — ImobiOS" },
      { name: "description", content: "Fichas completas de imóveis rurais com CAR, matrícula, benfeitorias e georreferenciamento." },
    ],
  }),
  component: RuralImoveisPage,
});

const statusMap: Record<RuralStatus, { label: string; className: string }> = {
  disponivel: { label: "Disponível", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  reservado:  { label: "Reservado",  className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  vendido:    { label: "Vendido",    className: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  pausado:    { label: "Pausado",    className: "bg-muted text-muted-foreground" },
};

const usoLabels: Record<RuralUso, string> = {
  pecuaria: "Pecuária",
  agricultura: "Agricultura",
  misto: "Misto",
  lazer: "Lazer",
  reflorestamento: "Reflorestamento",
};

const itrMap = {
  regular:  { label: "ITR regular",  className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  pendente: { label: "ITR pendente", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  atrasado: { label: "ITR atrasado", className: "bg-red-500/15 text-red-700 dark:text-red-300" },
} as const;

function RuralImoveisPage() {
  const [busca, setBusca] = useState("");
  const [uso, setUso] = useState<RuralUso | "todos">("todos");
  const [statusSel, setStatusSel] = useState<RuralStatus | "todos">("todos");

  const query = useQuery({
    queryKey: ["imoveis", "rural", busca, uso, statusSel],
    queryFn: () => listImoveis({ data: { tipo: "rural" } }),
  });

  const imoveis = useMemo(() => {
    if (!query.data) return [];
    return query.data.map((i: any) => ({
      ...i,
      cover: i.fotos?.[0] || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      nome: i.titulo,
      municipio: i.cidade || "",
      areaHa: i.area_ha || 0,
      valorTotal: i.valor_venda || 0,
      produtivaHa: i.caracteristicas?.produtiva_ha || 0,
      reservaLegalHa: i.caracteristicas?.reserva_legal_ha || 0,
      aguas: i.caracteristicas?.aguas || "Não informado",
      uso: i.caracteristicas?.uso || "misto",
      itr: i.itr ? "regular" : "pendente",
      car: i.car_numero || "Não informado",
      destaque: false,
      valorHectare: i.area_ha ? (i.valor_venda || 0) / i.area_ha : 0
    }));
  }, [query.data]);

  const filtrados = useMemo(() => {
    return imoveis.filter((i: any) => {
      if (uso !== "todos" && i.uso !== uso) return false;
      if (statusSel !== "todos" && i.status !== statusSel) return false;
      if (busca && !`${i.nome} ${i.codigo} ${i.municipio} ${i.uf}`.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
  }, [busca, uso, statusSel, imoveis]);

  const kpis = useMemo(() => {
    const total = imoveis.reduce((a: number, i: any) => a + (i.areaHa || 0), 0);
    const vgv = imoveis.reduce((a: number, i: any) => a + (i.valorTotal || 0), 0);
    const disp = imoveis.filter((i: any) => i.status === "disponivel").length;
    return { total, vgv, disp };
  }, [imoveis]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Carteira Rural"
        title="Imóveis Rurais"
        description="Fichas completas com CAR, matrícula, benfeitorias, recursos hídricos e georreferenciamento."
        actions={<NovoImovelDialog tipo="rural" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Imóveis" valor={imoveis.length} />
        <Kpi label="Disponíveis" valor={kpis.disp} />
        <Kpi label="Área total" valor={fmtHa(kpis.total)} />
        <Kpi label="VGV carteira" valor={fmtBRL(kpis.vgv)} />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, código ou município..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={uso} onChange={(e) => setUso(e.target.value as RuralUso | "todos")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="todos">Todos os usos</option>
            {Object.entries(usoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={statusSel} onChange={(e) => setStatusSel(e.target.value as RuralStatus | "todos")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="todos">Todos os status</option>
            {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtrados.map((i) => (
          <article key={i.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card sm:flex-row">
            <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:w-56">
              <img src={i.cover} alt={i.nome} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                <Badge className={cn("border-none", statusMap[i.status as RuralStatus]?.className || "")}>{statusMap[i.status as RuralStatus]?.label || i.status}</Badge>
                {i.destaque && <Badge className="border-none bg-primary/90 text-primary-foreground"><Star className="mr-1 h-3 w-3" />Destaque</Badge>}
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-muted-foreground">{i.codigo}</p>
                  <h3 className="truncate font-display text-lg font-semibold">{i.nome}</h3>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{i.municipio} · {i.uf}</p>
                </div>
                <Badge className={cn("border-none text-[10px]", itrMap[i.itr as keyof typeof itrMap]?.className || "")}>{itrMap[i.itr as keyof typeof itrMap]?.label || "ITR pendente"}</Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <Cell label="Área" valor={fmtHa(i.areaHa)} />
                <Cell label="Produtiva" valor={fmtHa(i.produtivaHa)} />
                <Cell label="Uso" valor={usoLabels[i.uso as RuralUso] || "Misto"} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Trees className="h-3 w-3" />Reserva: {fmtHa(i.reservaLegalHa)}</div>
                <div className="flex items-center gap-1"><Droplet className="h-3 w-3" />{i.aguas}</div>
                <div className="col-span-2 truncate"><FileText className="mr-1 inline h-3 w-3" />CAR {i.car}</div>
              </div>

              <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Valor total</p>
                  <p className="font-display text-lg font-semibold">{fmtBRL(i.valorTotal)}</p>
                  <p className="flex items-center gap-1 text-[11px] text-primary">
                    <TrendingUp className="h-3 w-3" />{fmtBRL(i.valorHectare)}/ha
                  </p>
                </div>
                <Button size="sm" variant="outline">Abrir ficha</Button>
              </div>
            </div>
          </article>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
            <Sprout className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Nenhum imóvel rural encontrado.</p>
          </div>
        )}
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

function Cell({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium">{valor}</p>
    </div>
  );
}
