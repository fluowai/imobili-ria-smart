import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Terra & Lar | ImobiOS" },
      { name: "description", content: "Configurações da imobiliária: equipe, permissões, identidade e plano." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Sistema"
      title="Configurações"
      icon={Settings}
      description="Configurações da imobiliária: equipe, permissões, identidade e plano."
      bullets={["Equipe e permissões", "Identidade da marca", "Plano e faturamento"]}
    />
  ),
});
