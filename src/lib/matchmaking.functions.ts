import { createServerFn } from "@tanstack/react-start";
import { groqJSON } from "./ai.server";

export type MatchResultado = {
  imovel_id: string;
  score: number; // 0-100
  razoes: string[];
  alerta?: string;
};

type LeadPerfil = {
  nome: string;
  interesse?: string | null;
  observacoes?: string | null;
  status?: string | null;
  origem?: string | null;
  tags?: string[];
};

type ImovelResumo = {
  id: string;
  titulo: string;
  tipo?: string | null;
  finalidade?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  valor_venda?: number | null;
  valor_locacao?: number | null;
  quartos?: number | null;
  area_util?: number | null;
  area_ha?: number | null;
  descricao?: string | null;
};

export const analisarMatchesFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const v = d as { lead?: LeadPerfil; imoveis?: ImovelResumo[] };
    if (!v?.lead) throw new Error("lead obrigatório");
    if (!Array.isArray(v.imoveis)) throw new Error("imoveis obrigatório");
    return { lead: v.lead, imoveis: v.imoveis.slice(0, 40) };
  })
  .handler(async ({ data }) => {
    if (data.imoveis.length === 0) return { matches: [] as MatchResultado[] };

    const system = `Você é um consultor imobiliário sênior. Analisa o perfil de um cliente e pontua imóveis da carteira de 0 a 100 conforme aderência (região, orçamento, dormitórios, tipo, finalidade, uso, estilo de vida). Retorne JSON.`;
    const user = `PERFIL DO CLIENTE:
${JSON.stringify(data.lead, null, 2)}

IMÓVEIS DA CARTEIRA (id + resumo):
${JSON.stringify(data.imoveis, null, 2)}

Devolva um objeto:
{"matches":[{"imovel_id":"...","score":0-100,"razoes":["curta","curta"],"alerta":"opcional (ex: acima do orçamento)"}]}
Ordene por score desc. Só inclua os que fazem sentido (score >= 50). No máximo 10.`;

    const out = await groqJSON<{ matches: MatchResultado[] }>({ system, user });
    return { matches: (out.matches ?? []).filter((m) => m.imovel_id && m.score) };
  });
