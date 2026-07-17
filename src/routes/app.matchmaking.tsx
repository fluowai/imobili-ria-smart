import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Sparkles, User, Home, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getActiveImobiliariaId } from "@/lib/tenant";
import { analisarMatchesFn, type MatchResultado } from "@/lib/matchmaking.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/app/matchmaking")({
  head: () => ({
    meta: [
      { title: "Matchmaking IA — ImobiOS" },
      { name: "description", content: "IA cruza perfis de clientes com imóveis da carteira." },
    ],
  }),
  component: MatchmakingPage,
});

type Lead = {
  id: string;
  nome: string;
  interesse: string | null;
  observacoes: string | null;
  status: string | null;
  origem: string | null;
};

type Imovel = {
  id: string;
  titulo: string;
  tipo: string | null;
  finalidade: string | null;
  bairro: string | null;
  cidade: string | null;
  valor_venda: number | null;
  valor_locacao: number | null;
  quartos: number | null;
  area_util: number | null;
  area_ha: number | null;
  descricao: string | null;
};

function MatchmakingPage() {
  const [leadSel, setLeadSel] = useState<string>("");
  const [resultados, setResultados] = useState<MatchResultado[]>([]);

  const { data: leads } = useQuery({
    queryKey: ["matchmaking-leads"],
    queryFn: async () => {
      const imob = await getActiveImobiliariaId();
      const { data, error } = await supabase
        .from("leads")
        .select("id, nome, interesse, observacoes, status, origem")
        .eq("imobiliaria_id", imob)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const { data: imoveis } = useQuery({
    queryKey: ["matchmaking-imoveis"],
    queryFn: async () => {
      const imob = await getActiveImobiliariaId();
      const { data, error } = await supabase
        .from("imoveis")
        .select("id, titulo, tipo, finalidade, bairro, cidade, valor_venda, valor_locacao, quartos, area_util, area_ha, descricao")
        .eq("imobiliaria_id", imob)
        .eq("status", "disponivel")
        .limit(40);
      if (error) throw error;
      return (data ?? []) as Imovel[];
    },
  });

  const leadAtivo = useMemo(() => leads?.find((l) => l.id === leadSel), [leads, leadSel]);
  const imMap = useMemo(() => Object.fromEntries((imoveis ?? []).map((i) => [i.id, i])), [imoveis]);

  const mut = useMutation({
    mutationFn: async () => {
      if (!leadAtivo) throw new Error("Selecione um cliente");
      if (!imoveis || imoveis.length === 0) throw new Error("Sem imóveis disponíveis na carteira");
      const r = await analisarMatchesFn({
        data: {
          lead: {
            nome: leadAtivo.nome,
            interesse: leadAtivo.interesse,
            observacoes: leadAtivo.observacoes,
            status: leadAtivo.status,
            origem: leadAtivo.origem,
          },
          imoveis,
        },
      });
      return r.matches;
    },
    onSuccess: (m) => {
      setResultados(m);
      if (m.length === 0) toast.warning("Nenhum imóvel com aderência suficiente.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Matchmaking IA"
        description="Selecione um cliente. A IA analisa o perfil e sugere os melhores imóveis da carteira."
        actions={
          <Button size="sm" onClick={() => mut.mutate()} disabled={!leadSel || mut.isPending}>
            {mut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Rodar matching
          </Button>
        }
      />

      <section className="rounded-xl border border-border bg-card p-5">
        <label className="text-sm font-medium">Cliente / Lead</label>
        <select
          value={leadSel}
          onChange={(e) => { setLeadSel(e.target.value); setResultados([]); }}
          className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">— selecionar —</option>
          {leads?.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nome} {l.interesse ? `— ${l.interesse.slice(0, 60)}` : ""}
            </option>
          ))}
        </select>
        {leadAtivo && (
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            {leadAtivo.interesse && <p><b>Interesse:</b> {leadAtivo.interesse}</p>}
            {leadAtivo.observacoes && <p><b>Notas:</b> {leadAtivo.observacoes}</p>}
          </div>
        )}
        {imoveis && (
          <p className="mt-3 text-xs text-muted-foreground">
            <Badge variant="outline">{imoveis.length}</Badge> imóveis disponíveis na carteira serão analisados.
          </p>
        )}
      </section>

      {resultados.length === 0 && !mut.isPending && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          <Sparkles className="mx-auto h-8 w-8 mb-2" />
          Selecione um cliente e clique em "Rodar matching" para a IA analisar.
        </div>
      )}

      <div className="grid gap-3">
        {resultados.map((m) => {
          const im = imMap[m.imovel_id];
          if (!im) return null;
          const tone = m.score >= 85 ? "emerald" : m.score >= 70 ? "amber" : "muted";
          const cls = { emerald: "text-emerald-600", amber: "text-amber-600", muted: "text-muted-foreground" }[tone];
          const ring = { emerald: "stroke-emerald-500", amber: "stroke-amber-500", muted: "stroke-muted-foreground" }[tone];
          const c = 2 * Math.PI * 22;
          const off = c - (m.score / 100) * c;
          return (
            <article key={m.imovel_id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                  <svg width="56" height="56" className="-rotate-90">
                    <circle cx="28" cy="28" r="22" strokeWidth="4" className="stroke-muted" fill="none" />
                    <circle cx="28" cy="28" r="22" strokeWidth="4" className={cn("transition-all", ring)} fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
                  </svg>
                  <span className={cn("absolute font-display text-sm font-bold", cls)}>{m.score}</span>
                </div>
                <div className="grid flex-1 gap-3 md:grid-cols-[1fr_auto_1fr]">
                  <div>
                    <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground"><User className="h-3 w-3" />Cliente</p>
                    <p className="mt-0.5 font-medium">{leadAtivo?.nome}</p>
                  </div>
                  <ArrowRight className="hidden h-5 w-5 self-center text-muted-foreground md:block" />
                  <div>
                    <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground"><Home className="h-3 w-3" />Imóvel sugerido</p>
                    <p className="mt-0.5 font-medium">{im.titulo}</p>
                    <p className="text-xs text-muted-foreground">{im.bairro}{im.cidade ? ` · ${im.cidade}` : ""}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.razoes.map((r, i) => <Badge key={i} variant="outline" className="text-[10px]">{r}</Badge>)}
                    </div>
                    {m.alerta && (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-amber-600">
                        <AlertCircle className="h-3 w-3" />{m.alerta}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
