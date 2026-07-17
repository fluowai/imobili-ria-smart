import { createFileRoute } from "@tanstack/react-router";
import { LayoutTemplate } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Super Admin | ImobiOS" },
      { name: "description", content: "Modelos padrão distribuídos para as imobiliárias." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Plataforma"
      title="Templates"
      icon={LayoutTemplate}
      description="Templates padrão de sites, landing pages, contratos e emails distribuídos para os clientes."
      bullets={[
        "Templates versionados com preview",
        "Publicação seletiva por plano ou feature flag",
        "Métricas de adoção por template",
      ]}
    />
  ),
});
