import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { Sparkles, Loader2, Download, Image as ImageIcon, Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { getActiveImobiliariaId } from "@/lib/tenant";
import { gerarCopyFn, type CopyGerada } from "@/lib/criativos.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/app/criativos")({
  head: () => ({
    meta: [
      { title: "Criativos IA — ImobiOS" },
      { name: "description", content: "Gere criativos reais para Instagram com IA." },
    ],
  }),
  component: CriativosPage,
});

type Imovel = {
  id: string;
  titulo: string;
  bairro: string | null;
  cidade: string | null;
  quartos: number | null;
  suites: number | null;
  vagas: number | null;
  area_util: number | null;
  area_ha: number | null;
  valor_venda: number | null;
  valor_locacao: number | null;
  tipo: string | null;
  finalidade: string | null;
  descricao: string | null;
  fotos: string[] | null;
};

const fmtBRL = (v?: number | null) =>
  v
    ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
    : "";

function CriativosPage() {
  const [imovelId, setImovelId] = useState("");
  const [tom, setTom] = useState("profissional-persuasivo");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string>("");
  const [variacoes, setVariacoes] = useState<CopyGerada[]>([]);
  const [ativa, setAtiva] = useState(0);
  const [copy, setCopy] = useState("");
  const [headline, setHeadline] = useState("");
  const [cta, setCta] = useState("Fale conosco");
  const [cor, setCor] = useState("#16a34a");
  const previewRef = useRef<HTMLDivElement>(null);

  const { data: imoveis } = useQuery({
    queryKey: ["criativos-imoveis"],
    queryFn: async () => {
      const imob = await getActiveImobiliariaId();
      const { data, error } = await supabase
        .from("imoveis")
        .select(
          "id, titulo, bairro, cidade, quartos, suites, vagas, area_util, area_ha, valor_venda, valor_locacao, tipo, finalidade, descricao, fotos",
        )
        .eq("imobiliaria_id", imob)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Imovel[];
    },
  });

  const imovel = imoveis?.find((i) => i.id === imovelId);

  // Preenche foto do imóvel ao selecionar
  const selecionarImovel = (id: string) => {
    setImovelId(id);
    const im = imoveis?.find((i) => i.id === id);
    const foto = im?.fotos?.[0];
    if (foto) setFotoUrl(foto);
    setVariacoes([]);
  };

  const readFile = (f: File) =>
    new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(f);
    });

  const gerarMut = useMutation({
    mutationFn: async () => {
      if (!imovel) throw new Error("Selecione um imóvel");
      const r = await gerarCopyFn({
        data: {
          imovel: {
            titulo: imovel.titulo,
            bairro: imovel.bairro,
            cidade: imovel.cidade,
            quartos: imovel.quartos,
            suites: imovel.suites,
            vagas: imovel.vagas,
            area_util: imovel.area_util,
            area_ha: imovel.area_ha,
            valor_venda: imovel.valor_venda,
            valor_locacao: imovel.valor_locacao,
            tipo: imovel.tipo,
            finalidade: imovel.finalidade,
            descricao: imovel.descricao,
          },
          tom,
        },
      });
      return r.variacoes;
    },
    onSuccess: (v) => {
      setVariacoes(v);
      if (v[0]) {
        setAtiva(0);
        setHeadline(v[0].headline);
        setCopy(v[0].copy);
        setCta(v[0].cta);
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const usarVariacao = (i: number) => {
    setAtiva(i);
    const v = variacoes[i];
    if (v) {
      setHeadline(v.headline);
      setCopy(v.copy);
      setCta(v.cta);
    }
  };

  const baixarPNG = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.download = `criativo-${Date.now()}.png`;
      a.href = dataUrl;
      a.click();

      // Salva histórico
      if (imovel) {
        const imob = await getActiveImobiliariaId();
        await supabase.from("criativos").insert({
          imobiliaria_id: imob,
          imovel_id: imovel.id,
          formato: "feed",
          copy,
          cta,
          logo_url: logoUrl || null,
          imagem_url: dataUrl.slice(0, 3000), // truncado só como referência
        });
      }
      toast.success("Criativo baixado");
    } catch (e) {
      toast.error("Falha ao gerar imagem: " + (e as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Crescimento"
        title="Criativos IA"
        description="Gere posts reais 1080x1080 para Instagram com copy da IA."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_540px]">
        {/* Painel esquerdo — configuração */}
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-medium">1. Imóvel</h3>
            <select
              value={imovelId}
              onChange={(e) => selecionarImovel(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">— selecionar —</option>
              {imoveis?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.titulo} {i.bairro ? `· ${i.bairro}` : ""}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-medium">2. Marca</h3>
            <div>
              <Label>Logo (upload)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setLogoUrl(await readFile(f));
                }}
              />
              {logoUrl && <img src={logoUrl} alt="logo" className="mt-2 h-10 object-contain" />}
            </div>
            <div>
              <Label>Foto do imóvel (URL ou upload)</Label>
              <Input
                placeholder="https://..."
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
              />
              <Input
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setFotoUrl(await readFile(f));
                }}
              />
            </div>
            <div>
              <Label>Cor da marca</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="h-10 w-16 rounded border"
                />
                <Input value={cor} onChange={(e) => setCor(e.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">3. Copy (IA)</h3>
              <Button
                size="sm"
                onClick={() => gerarMut.mutate()}
                disabled={!imovel || gerarMut.isPending}
              >
                {gerarMut.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Gerar com IA
              </Button>
            </div>
            <div>
              <Label>Tom</Label>
              <select
                value={tom}
                onChange={(e) => setTom(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="profissional-persuasivo">Profissional persuasivo</option>
                <option value="lifestyle-aspiracional">Lifestyle aspiracional</option>
                <option value="urgencia-oportunidade">Urgência / oportunidade</option>
                <option value="investimento-numeros">Investimento (foco em números)</option>
              </select>
            </div>
            {variacoes.length > 0 && (
              <div className="flex gap-2">
                {variacoes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => usarVariacao(i)}
                    className={`h-8 px-3 text-xs rounded-md border ${i === ativa ? "bg-primary text-primary-foreground" : "bg-background"}`}
                  >
                    Variação {i + 1}
                  </button>
                ))}
              </div>
            )}
            <div>
              <Label>Headline</Label>
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div>
              <Label>Copy</Label>
              <Textarea rows={4} value={copy} onChange={(e) => setCopy(e.target.value)} />
            </div>
            <div>
              <Label>CTA</Label>
              <Input value={cta} onChange={(e) => setCta(e.target.value)} />
            </div>
          </section>

          <Button size="lg" onClick={baixarPNG} disabled={!imovel || !fotoUrl}>
            <Download className="mr-2 h-5 w-5" /> Baixar PNG 1080x1080
          </Button>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
            Preview (feed)
          </p>
          <div
            ref={previewRef}
            style={{ width: 540, height: 540, background: "#111" }}
            className="relative overflow-hidden rounded-xl shadow-2xl mx-auto"
          >
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt=""
                crossOrigin="anonymous"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-white/60">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-10 w-10" />
                  <p className="mt-2 text-xs">Adicione foto do imóvel</p>
                </div>
              </div>
            )}
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            {/* Logo */}
            {logoUrl && (
              <img
                src={logoUrl}
                alt="logo"
                className="absolute left-4 top-4 h-10 rounded bg-white/90 p-1 object-contain"
              />
            )}
            {/* Badge cor */}
            <div
              className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: cor }}
            >
              {imovel?.finalidade === "locacao" ? "PARA ALUGAR" : "À VENDA"}
            </div>
            {/* Conteúdo bottom */}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              {headline && (
                <p className="font-display text-2xl font-bold leading-tight">{headline}</p>
              )}
              {imovel && (
                <p className="mt-1 text-sm opacity-90">
                  {imovel.bairro}
                  {imovel.cidade ? ` · ${imovel.cidade}` : ""}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-xs opacity-90">
                {imovel?.quartos ? <span>🛏 {imovel.quartos} quartos</span> : null}
                {imovel?.vagas ? <span>🚗 {imovel.vagas} vagas</span> : null}
                {imovel?.area_util ? <span>📐 {imovel.area_util}m²</span> : null}
                {imovel?.area_ha ? <span>🌾 {imovel.area_ha}ha</span> : null}
              </div>
              {imovel?.valor_venda ? (
                <p className="mt-3 font-display text-3xl font-bold" style={{ color: cor }}>
                  {fmtBRL(imovel.valor_venda)}
                </p>
              ) : imovel?.valor_locacao ? (
                <p className="mt-3 font-display text-2xl font-bold" style={{ color: cor }}>
                  {fmtBRL(imovel.valor_locacao)}/mês
                </p>
              ) : null}
              {cta && (
                <div
                  className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold"
                  style={{ background: cor, color: "#fff" }}
                >
                  {cta} →
                </div>
              )}
            </div>
          </div>
          {variacoes[ativa]?.hashtags?.length ? (
            <div className="mt-3 text-xs text-muted-foreground max-w-[540px] mx-auto">
              <p className="font-medium mb-1">Hashtags sugeridas:</p>
              <p className="break-words">{variacoes[ativa].hashtags.join(" ")}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
