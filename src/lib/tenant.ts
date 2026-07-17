import { supabase } from "@/integrations/supabase/client";

let cachedImobId: string | null = null;

/**
 * Resolve a imobiliária ativa do usuário logado.
 * Pega a primeira membership. Cache in-memory durante a sessão.
 */
export async function getActiveImobiliariaId(): Promise<string> {
  if (cachedImobId) return cachedImobId;
  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes.user?.id;
  if (!uid) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("memberships")
    .select("imobiliaria_id")
    .eq("user_id", uid)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data?.imobiliaria_id) {
    throw new Error(
      "Usuário sem imobiliária associada. Rode o SQL de bootstrap ou peça convite ao admin.",
    );
  }
  cachedImobId = data.imobiliaria_id as string;
  return cachedImobId;
}

export function clearTenantCache() {
  cachedImobId = null;
}
