import { supabase } from "@/integrations/supabase/client";
import { getActiveImobiliariaId } from "./tenant";

type TarefaInput = {
  titulo: string;
  descricao?: string;
  status?: "aberta" | "em_andamento" | "concluida" | "cancelada";
  vencimento?: string;
  lead_id?: string;
  cliente_id?: string;
  imovel_id?: string;
  responsavel_id?: string;
};

export async function listTarefas({ data }: { data?: { status?: string } } = {}) {
  const imob = await getActiveImobiliariaId();
  let q = supabase
    .from("tarefas")
    .select("*")
    .eq("imobiliaria_id", imob)
    .order("created_at", { ascending: false })
    .limit(200);
  if (data?.status) q = q.eq("status", data.status);
  const { data: rows, error } = await q;
  if (error) throw error;
  return rows ?? [];
}

export async function createTarefa({ data }: { data: TarefaInput }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("tarefas")
    .insert({ ...data, status: data.status ?? "aberta", imobiliaria_id: imob })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateTarefa({
  data,
}: {
  data: { id: string; patch: Partial<TarefaInput> };
}) {
  const imob = await getActiveImobiliariaId();
  const patch: Record<string, unknown> = { ...data.patch };
  if (data.patch.status === "concluida") patch.concluida_em = new Date().toISOString();
  const { data: row, error } = await supabase
    .from("tarefas")
    .update(patch)
    .eq("id", data.id)
    .eq("imobiliaria_id", imob)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function deleteTarefa({ data }: { data: { id: string } }) {
  const imob = await getActiveImobiliariaId();
  const { error } = await supabase
    .from("tarefas")
    .delete()
    .eq("id", data.id)
    .eq("imobiliaria_id", imob);
  if (error) throw error;
  return { ok: true };
}
