import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, Plus, Loader2, CheckCircle2, XCircle, Play } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { descobrirImoveisFn, extrairImovelFn, type ImovelExtraido } from "@/lib/migrador.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/importador-ia")({
  head: () => ({
    meta: [
      { title: "Importador IA — Super Admin | ImobiOS" },
      { name: "description", content: "Migre imóveis de qualquer site com IA." },
    ],
  }),
  component: ImportadorPage,
});

type Imob = { id: string; nome: string; tipo: string };

function ImportadorPage() {
  const qc = useQueryClient();
  const [imobId, setImobId] = useState<string>("");
  const [url, setUrl] = useState("");
  const [criandoNova, setCriandoNova] = useState(false);
  const [novaImob, setNovaImob] = useState({ nome: "", tipo: "urbana" as "urbana" | "rural" });

  // etapas
  const [urls, setUrls] = useState<string[]>([]);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState({ ok: 0, err: 0, done: 0, total: 0 });
  const [log, setLog] = useState<{ url: string; status: "ok" | "err"; msg?: string; titulo?: string }[]>([]);

  const { data: imobs, refetch: refetchImobs } = useQuery({
    queryKey: ["admin-imobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("imobiliarias").select("id, nome, tipo").order("nome");
      if (error) throw error;
      return (data ?? []) as Imob[];
    },
  });

  const criarImobMut = useMutation({
    mutationFn: async () => {
      if (!novaImob.nome.trim()) throw new Error("Informe o nome");
      const slug = novaImob.nome.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Date.now().toString(36);
      const { data, error } = await supabase
        .from("imobiliarias")
        .insert({ nome: novaImob.nome, slug, tipo: novaImob.tipo })
        .select("id, nome, tipo")
        .single();
      if (error) throw error;
      return data as Imob;
    },
    onSuccess: (imob) => {
      toast.success("Imobiliária criada");
      setCriandoNova(false);
      setNovaImob({ nome: "", tipo: "urbana" });
      setImobId(imob.id);
      refetchImobs();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const descobrirMut = useMutation({
    mutationFn: async () => {
      if (!url) throw new Error("Informe a URL");
      const r = await descobrirImoveisFn({ data: { url } });
      return r.urls;
    },
    onSuccess: (list) => {
      setUrls(list);
      setLog([]);
      setProgresso({ ok: 0, err: 0, done: 0, total: list.length });
      if (list.length === 0) toast.warning("Nenhuma URL de imóvel encontrada nessa página.");
      else toast.success(`${list.length} URLs de imóveis encontradas`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function importarLote() {
    if (!imobId) return toast.error("Selecione a imobiliária destino");
    if (urls.length === 0) return toast.error("Descubra as URLs primeiro");
    setProcessando(true);
    setLog([]);
    setProgresso({ ok: 0, err: 0, done: 0, total: urls.length });

    // Processa 3 em paralelo
    const CHUNK = 3;
    for (let i = 0; i < urls.length; i += CHUNK) {
      const batch = urls.slice(i, i + CHUNK);
      await Promise.all(
        batch.map(async (u) => {
          try {
            const dado = (await extrairImovelFn({ data: { url: u } })) as ImovelExtraido;
            const codigo = dado.codigo || "IMP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
            const { error } = await supabase.from("imoveis").insert({
              imobiliaria_id: imobId,
              codigo,
              tipo: dado.tipo ?? "urbano",
              finalidade: dado.finalidade ?? "venda",
              titulo: dado.titulo,
              descricao: dado.descricao,
              endereco: dado.endereco,
              bairro: dado.bairro,
              cidade: dado.cidade,
              uf: dado.uf,
              valor_venda: dado.valor_venda,
              valor_locacao: dado.valor_locacao,
              area_util: dado.area_util,
              area_total: dado.area_total,
              area_ha: dado.area_ha,
              quartos: dado.quartos,
              suites: dado.suites,
              banheiros: dado.banheiros,
              vagas: dado.vagas,
              fotos: dado.fotos ?? [],
            });
            if (error) throw error;
            setLog((l) => [...l, { url: u, status: "ok", titulo: dado.titulo }]);
            setProgresso((p) => ({ ...p, ok: p.ok + 1, done: p.done + 1 }));
          } catch (e) {
            setLog((l) => [...l, { url: u, status: "err", msg: (e as Error).message }]);
            setProgresso((p) => ({ ...p, err: p.err + 1, done: p.done + 1 }));
          }
        }),
      );
    }
    setProcessando(false);
    toast.success("Importação concluída");
    qc.invalidateQueries({ queryKey: ["imoveis"] });
  }

  useEffect(() => { document.title = "Importador IA — Super Admin"; }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Ferramentas"
        title="Importador IA"
        description="Cole a URL do site de uma imobiliária. A IA descobre e migra todos os imóveis."
      />

      {/* 1. Imobiliária destino */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-medium mb-3">1. Imobiliária destino</h3>
        {!criandoNova ? (
          <div className="flex gap-2 items-end flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <Label>Selecione</Label>
              <select
                value={imobId}
                onChange={(e) => setImobId(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— escolher —</option>
                {imobs?.map((i) => (
                  <option key={i.id} value={i.id}>{i.nome} ({i.tipo})</option>
                ))}
              </select>
            </div>
            <Button variant="outline" onClick={() => setCriandoNova(true)}>
              <Plus className="mr-2 h-4 w-4" /> Cadastrar nova
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label>Nome</Label>
              <Input value={novaImob.nome} onChange={(e) => setNovaImob({ ...novaImob, nome: e.target.value })} />
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                value={novaImob.tipo}
                onChange={(e) => setNovaImob({ ...novaImob, tipo: e.target.value as "urbana" | "rural" })}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="urbana">Urbana</option>
                <option value="rural">Rural</option>
              </select>
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={() => criarImobMut.mutate()} disabled={criarImobMut.isPending}>
                {criarImobMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar
              </Button>
              <Button variant="ghost" onClick={() => setCriandoNova(false)}>Cancelar</Button>
            </div>
          </div>
        )}
      </section>

      {/* 2. URL de origem */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-medium mb-3">2. Site de origem</h3>
        <div className="flex gap-2 items-end flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <Label>URL da imobiliária</Label>
            <div className="relative mt-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="https://imobiliariaxyz.com.br"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={() => descobrirMut.mutate()} disabled={descobrirMut.isPending || !url}>
            {descobrirMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Descobrir imóveis
          </Button>
        </div>
        {urls.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            <Badge variant="outline">{urls.length}</Badge> URLs identificadas.
          </p>
        )}
      </section>

      {/* 3. Importação */}
      {urls.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">3. Migrar imóveis</h3>
            <Button onClick={importarLote} disabled={processando || !imobId}>
              {processando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              {processando ? "Importando..." : "Iniciar migração"}
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-3 text-sm">
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground text-xs">Total</p>
              <p className="text-xl font-semibold">{progresso.total}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground text-xs">Processados</p>
              <p className="text-xl font-semibold">{progresso.done}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground text-xs">Sucesso</p>
              <p className="text-xl font-semibold text-emerald-600">{progresso.ok}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground text-xs">Erros</p>
              <p className="text-xl font-semibold text-destructive">{progresso.err}</p>
            </div>
          </div>

          {log.length > 0 && (
            <div className="mt-4 max-h-96 overflow-auto rounded-md border">
              {log.map((l, i) => (
                <div key={i} className="flex items-start gap-2 border-b px-3 py-2 text-xs">
                  {l.status === "ok" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{l.titulo ?? l.url}</p>
                    {l.msg && <p className="text-destructive/80">{l.msg}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
