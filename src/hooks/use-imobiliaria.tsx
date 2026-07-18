import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type ImobTipo = "urbana" | "rural";

export interface Imobiliaria {
  id: string;
  nome: string;
  slug: string;
  tipo: ImobTipo;
  onboarding_completed: boolean;
  instancia_nome: string | null;
  llm_keys: Record<string, string>;
  responsavel_nome: string | null;
  whatsapp: string | null;
}

interface Ctx {
  imob: Imobiliaria | null;
  loading: boolean;
  refresh: () => Promise<void>;
  update: (patch: Partial<Imobiliaria>) => Promise<{ error: string | null }>;
}

const ImobContext = createContext<Ctx | null>(null);

export function ImobiliariaProvider({ children }: { children: ReactNode }) {
  const { user, configured } = useAuth();
  const [imob, setImob] = useState<Imobiliaria | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!configured || !user) {
      setImob(null);
      setLoading(false);
      return;
    }
    setLoading(true);

    let targetImobId = localStorage.getItem("admin_imob_override");

    if (!targetImobId) {
      const { data: mem } = await supabase
        .from("memberships")
        .select("imobiliaria_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      if (!mem) {
        setImob(null);
        setLoading(false);
        return;
      }
      targetImobId = mem.imobiliaria_id;
    }

    const { data } = await supabase
      .from("imobiliarias")
      .select(
        "id, nome, slug, tipo, onboarding_completed, instancia_nome, llm_keys, responsavel_nome, whatsapp",
      )
      .eq("id", targetImobId)
      .maybeSingle();
    setImob((data as Imobiliaria) ?? null);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, configured]);

  const value = useMemo<Ctx>(
    () => ({
      imob,
      loading,
      refresh: load,
      async update(patch) {
        if (!imob) return { error: "sem imobiliária" };
        const { data, error } = await supabase
          .from("imobiliarias")
          .update(patch)
          .eq("id", imob.id)
          .select(
            "id, nome, slug, tipo, onboarding_completed, instancia_nome, llm_keys, responsavel_nome, whatsapp",
          )
          .maybeSingle();
        if (error) return { error: error.message };
        if (data) setImob(data as Imobiliaria);
        return { error: null };
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imob, loading],
  );

  return <ImobContext.Provider value={value}>{children}</ImobContext.Provider>;
}

export function useImobiliaria() {
  const ctx = useContext(ImobContext);
  if (!ctx) throw new Error("useImobiliaria fora do provider");
  return ctx;
}
