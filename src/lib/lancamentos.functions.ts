import { supabase } from "@/integrations/supabase/client";
import { getActiveImobiliariaId } from "./tenant";

type LancamentoInput = {
  tipo: "receita" | "despesa";
  status?: "pendente" | "pago" | "atrasado" | "cancelado";
  categoria?: string;
  descricao: string;
  valor: number;
  vencimento?: string;
  pago_em?: string;
  contrato_id?: string;
};

export async function listLancamentos({
  data,
}: { data?: { status?: string; tipo?: string } } = {}) {
  const imob = await getActiveImobiliariaId();
  let q = supabase
    .from("lancamentos")
    .select("*")
    .eq("imobiliaria_id", imob)
    .order("created_at", { ascending: false })
    .limit(500);
  if (data?.status) q = q.eq("status", data.status);
  if (data?.tipo) q = q.eq("tipo", data.tipo);
  const { data: rows, error } = await q;
  if (error) throw error;
  return rows ?? [];
}

export async function createLancamento({ data }: { data: LancamentoInput }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("lancamentos")
    .insert({ ...data, status: data.status ?? "pendente", imobiliaria_id: imob })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateLancamento({
  data,
}: {
  data: { id: string; patch: Partial<LancamentoInput> };
}) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("lancamentos")
    .update(data.patch)
    .eq("id", data.id)
    .eq("imobiliaria_id", imob)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function deleteLancamento({ data }: { data: { id: string } }) {
  const imob = await getActiveImobiliariaId();
  const { error } = await supabase
    .from("lancamentos")
    .delete()
    .eq("id", data.id)
    .eq("imobiliaria_id", imob);
  if (error) throw error;
  return { ok: true };
}
