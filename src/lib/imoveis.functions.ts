import { supabase } from "@/integrations/supabase/client";
import { getActiveImobiliariaId } from "./tenant";

type ImovelInput = {
  codigo: string;
  tipo: "urbano" | "rural";
  finalidade?: "venda" | "locacao" | "ambos";
  status?: "disponivel" | "reservado" | "vendido" | "alugado" | "inativo";
  titulo: string;
  descricao?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  valor_venda?: number;
  valor_locacao?: number;
  area_util?: number;
  area_total?: number;
  quartos?: number;
  suites?: number;
  banheiros?: number;
  vagas?: number;
  area_ha?: number;
  car_numero?: string;
  itr?: string;
};

export async function listImoveis({ data }: { data?: { tipo?: "urbano" | "rural"; status?: string; busca?: string } } = {}) {
  const imob = await getActiveImobiliariaId();
  let q = supabase
    .from("imoveis")
    .select("*")
    .eq("imobiliaria_id", imob)
    .order("created_at", { ascending: false })
    .limit(500);
  if (data?.tipo) q = q.eq("tipo", data.tipo);
  if (data?.status) q = q.eq("status", data.status);
  const { data: rows, error } = await q;
  if (error) throw error;
  const busca = data?.busca?.toLowerCase();
  return busca
    ? (rows ?? []).filter((r: any) =>
        `${r.codigo} ${r.titulo} ${r.bairro ?? ""} ${r.cidade ?? ""}`.toLowerCase().includes(busca),
      )
    : rows ?? [];
}

export async function getImovel({ data }: { data: { id: string } }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("id", data.id)
    .eq("imobiliaria_id", imob)
    .maybeSingle();
  if (error) throw error;
  if (!row) throw new Error("Não encontrado");
  return row;
}

export async function createImovel({ data }: { data: ImovelInput }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("imoveis")
    .insert({
      ...data,
      finalidade: data.finalidade ?? "venda",
      status: data.status ?? "disponivel",
      imobiliaria_id: imob,
    })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateImovel({ data }: { data: { id: string; patch: Partial<ImovelInput> } }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("imoveis")
    .update(data.patch)
    .eq("id", data.id)
    .eq("imobiliaria_id", imob)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function deleteImovel({ data }: { data: { id: string } }) {
  const imob = await getActiveImobiliariaId();
  const { error } = await supabase
    .from("imoveis")
    .delete()
    .eq("id", data.id)
    .eq("imobiliaria_id", imob);
  if (error) throw error;
  return { ok: true };
}
