import { supabase } from "@/integrations/supabase/client";
import { getActiveImobiliariaId } from "./tenant";

type LeadInput = {
  nome: string;
  email?: string;
  telefone?: string;
  origem?: "site" | "whatsapp" | "instagram" | "portal" | "indicacao" | "outros";
  status?: "novo" | "qualificando" | "visita" | "proposta" | "fechado" | "perdido";
  score?: number;
  interesse?: string;
  observacoes?: string;
  cliente_id?: string;
  imovel_id?: string;
  responsavel_id?: string;
};

export async function listLeads({ data }: { data?: { status?: string; busca?: string } } = {}) {
  const imob = await getActiveImobiliariaId();
  let q = supabase
    .from("leads")
    .select("*")
    .eq("imobiliaria_id", imob)
    .order("created_at", { ascending: false })
    .limit(500);
  if (data?.status) q = q.eq("status", data.status);
  const { data: rows, error } = await q;
  if (error) throw error;
  const busca = data?.busca?.toLowerCase();
  return busca
    ? (rows ?? []).filter((r: any) =>
        `${r.nome} ${r.email ?? ""} ${r.telefone ?? ""} ${r.interesse ?? ""}`
          .toLowerCase()
          .includes(busca),
      )
    : (rows ?? []);
}

export async function createLead({ data }: { data: LeadInput }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("leads")
    .insert({
      ...data,
      origem: data.origem ?? "site",
      status: data.status ?? "novo",
      score: data.score ?? 0,
      imobiliaria_id: imob,
    })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateLead({ data }: { data: { id: string; patch: Partial<LeadInput> } }) {
  const imob = await getActiveImobiliariaId();
  const { data: row, error } = await supabase
    .from("leads")
    .update(data.patch)
    .eq("id", data.id)
    .eq("imobiliaria_id", imob)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function deleteLead({ data }: { data: { id: string } }) {
  const imob = await getActiveImobiliariaId();
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", data.id)
    .eq("imobiliaria_id", imob);
  if (error) throw error;
  return { ok: true };
}
