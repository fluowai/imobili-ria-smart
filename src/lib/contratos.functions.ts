import { supabase } from "@/integrations/supabase/client";
import { getActiveImobiliariaId } from "./tenant";

type ContratoInput = {
  tipo: "venda" | "locacao" | "captacao" | "administracao";
  status?: "rascunho" | "enviado" | "assinado" | "vigente" | "encerrado" | "cancelado";
  valor?: number;
  inicio?: string;
  fim?: string;
  imovel_id?: string;
  cliente_id?: string;
};

export async function listContratos({ data }: { data?: { status?: string } } = {}) {
  const imob = await getActiveImobiliariaId();
  let q = supabase
    .from("contratos")
    .select("*")
    .eq("imobiliaria_id", imob)
    .order("created_at", { ascending: false })
    .limit(500);
  if (data?.status) q = q.eq("status", data.status);
  const { data: rows, error } = await q;
  if (error) throw error;
  return rows ?? [];
}

export async function createContrato({ data }: { data: ContratoInput }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("contratos")
    .insert({
      ...data,
      status: data.status ?? "rascunho",
      imobiliaria_id: imob,
    })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateContrato({ data }: { data: { id: string; patch: Partial<ContratoInput> } }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("contratos")
    .update(data.patch)
    .eq("id", data.id)
    .eq("imobiliaria_id", imob)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function deleteContrato({ data }: { data: { id: string } }) {
  const imob = await getActiveImobiliariaId();
  const { error } = await supabase
    .from("contratos")
    .delete()
    .eq("id", data.id)
    .eq("imobiliaria_id", imob);
  if (error) throw error;
  return { ok: true };
}
