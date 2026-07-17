// Camada de acesso Supabase (client-side, RLS por imobiliaria_id).
// Assinatura mantida para compatibilidade: fn({ data: {...} }).

import { supabase } from "@/integrations/supabase/client";
import { getActiveImobiliariaId } from "./tenant";

type ClienteInput = {
  tipo?: "pf" | "pj";
  nome: string;
  documento?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  tags?: string[];
};

export async function listClientes({ data }: { data?: { busca?: string } } = {}) {
  const imob = await getActiveImobiliariaId();
  const { data: rows, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("imobiliaria_id", imob)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  const q = data?.busca?.toLowerCase();
  return q
    ? (rows ?? []).filter((r: any) =>
        `${r.nome} ${r.email ?? ""} ${r.telefone ?? ""} ${r.documento ?? ""}`.toLowerCase().includes(q),
      )
    : rows ?? [];
}

export async function getCliente({ data }: { data: { id: string } }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("imobiliaria_id", imob)
    .eq("id", data.id)
    .maybeSingle();
  if (error) throw error;
  if (!row) throw new Error("Não encontrado");
  return row;
}

export async function createCliente({ data }: { data: ClienteInput }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("clientes")
    .insert({ ...data, tags: data.tags ?? [], imobiliaria_id: imob })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateCliente({ data }: { data: { id: string; patch: Partial<ClienteInput> } }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("clientes")
    .update(data.patch)
    .eq("id", data.id)
    .eq("imobiliaria_id", imob)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function deleteCliente({ data }: { data: { id: string } }) {
  const imob = await getActiveImobiliariaId();
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", data.id)
    .eq("imobiliaria_id", imob);
  if (error) throw error;
  return { ok: true };
}
