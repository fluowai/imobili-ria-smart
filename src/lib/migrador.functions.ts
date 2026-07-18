import { createServerFn } from "@tanstack/react-start";
import { groqJSON } from "./ai.server";

/** Baixa HTML de uma URL (server-side, sem CORS). */
async function fetchHTML(url: string, timeoutMs = 20_000): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ImobiOSBot/1.0; +https://imobios.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

/** Reduz HTML para o essencial antes de mandar pra IA. */
function stripHTML(html: string, max = 12_000): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Extrai links do HTML que parecem ser fichas de imóvel. */
function extrairUrlsImoveis(html: string, base: string): string[] {
  const baseUrl = new URL(base);
  const urls = new Set<string>();
  const re = /href=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const abs = new URL(m[1], baseUrl).toString();
      // Heurística: URL que aponte pra ficha de imóvel
      if (
        /(imovel|imoveis|imovel-|property|properties|ref-|codigo|apartamento|casa|terreno|fazenda|sitio|chacara)/i.test(
          abs,
        ) &&
        abs.startsWith(baseUrl.origin)
      ) {
        urls.add(abs.split("#")[0]);
      }
    } catch {
      /* ignore */
    }
  }
  return Array.from(urls);
}

export type ImovelExtraido = {
  codigo?: string;
  titulo: string;
  descricao?: string;
  tipo?: "urbano" | "rural";
  finalidade?: "venda" | "locacao" | "ambos";
  valor_venda?: number;
  valor_locacao?: number;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  area_util?: number;
  area_total?: number;
  area_ha?: number;
  quartos?: number;
  suites?: number;
  banheiros?: number;
  vagas?: number;
  fotos?: string[];
};

/** Descobre URLs de imóveis a partir da home do site. */
export const descobrirImoveisFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const v = d as { url?: string };
    if (!v?.url) throw new Error("URL obrigatória");
    return { url: v.url };
  })
  .handler(async ({ data }) => {
    const html = await fetchHTML(data.url);
    let urls = extrairUrlsImoveis(html, data.url);

    // Se pouca coisa, tenta seguir a página "imoveis"
    if (urls.length < 3) {
      const base = new URL(data.url);
      const tentativas = [
        `${base.origin}/imoveis`,
        `${base.origin}/imoveis/venda`,
        `${base.origin}/imoveis/locacao`,
        `${base.origin}/busca`,
      ];
      for (const t of tentativas) {
        try {
          const h2 = await fetchHTML(t);
          urls = urls.concat(extrairUrlsImoveis(h2, t));
        } catch {
          /* ignore */
        }
      }
    }

    // deduplica
    const uniq = Array.from(new Set(urls));
    return { urls: uniq.slice(0, 200) };
  });

/** Extrai UM imóvel de uma URL usando Groq. */
export const extrairImovelFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const v = d as { url?: string };
    if (!v?.url) throw new Error("URL obrigatória");
    return { url: v.url };
  })
  .handler(async ({ data }) => {
    const html = await fetchHTML(data.url);
    const texto = stripHTML(html);

    const system =
      "Você extrai dados estruturados de fichas de imóveis. Retorne um único objeto JSON. Se um campo não existir, omita-o. Valores em número puro (sem R$, sem pontos).";
    const user = `URL: ${data.url}\n\nConteúdo da página:\n${texto}\n\nExtraia no formato:
{
  "titulo": string,
  "codigo": string?,
  "descricao": string?,
  "tipo": "urbano"|"rural"?,
  "finalidade": "venda"|"locacao"|"ambos"?,
  "valor_venda": number?,
  "valor_locacao": number?,
  "endereco": string?,
  "bairro": string?,
  "cidade": string?,
  "uf": string?,
  "area_util": number?,
  "area_total": number?,
  "area_ha": number?,
  "quartos": number?,
  "suites": number?,
  "banheiros": number?,
  "vagas": number?,
  "fotos": string[]?
}`;

    const out = await groqJSON<ImovelExtraido>({ system, user });
    if (!out.titulo) throw new Error("IA não conseguiu extrair título da página");
    return out;
  });
