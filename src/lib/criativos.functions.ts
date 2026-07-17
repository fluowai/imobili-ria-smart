import { createServerFn } from "@tanstack/react-start";
import { groqJSON } from "./ai.server";

export type CopyGerada = {
  headline: string;
  copy: string;
  cta: string;
  hashtags: string[];
};

type ImovelParaCopy = {
  titulo: string;
  bairro?: string | null;
  cidade?: string | null;
  quartos?: number | null;
  suites?: number | null;
  vagas?: number | null;
  area_util?: number | null;
  area_ha?: number | null;
  valor_venda?: number | null;
  valor_locacao?: number | null;
  tipo?: string | null;
  finalidade?: string | null;
  descricao?: string | null;
};

export const gerarCopyFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const v = d as { imovel?: ImovelParaCopy; tom?: string };
    if (!v?.imovel?.titulo) throw new Error("imovel.titulo obrigatório");
    return {
      imovel: v.imovel,
      tom: v.tom ?? "profissional-persuasivo",
    };
  })
  .handler(async ({ data }) => {
    const system = `Você é um copywriter de anúncios imobiliários para Instagram. Escreve em PT-BR, direto, com emojis moderados. Sem invenções: use apenas os dados fornecidos.`;
    const user = `Imóvel:
${JSON.stringify(data.imovel, null, 2)}

Tom: ${data.tom}

Gere 3 opções de copy para post de Instagram (feed 1080x1080).
Retorne JSON:
{"variacoes":[{"headline":"até 40 chars","copy":"até 280 chars","cta":"até 25 chars","hashtags":["#tag1","#tag2","..."]}, ...]}
Máx 8 hashtags. Sem preço se não fornecido.`;

    const out = await groqJSON<{ variacoes: CopyGerada[] }>({ system, user });
    return { variacoes: (out.variacoes ?? []).slice(0, 3) };
  });
