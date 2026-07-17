import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Super Admin | ImobiOS" },
      { name: "description", content: "Configurações globais da plataforma." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Sistema"
      title="Configurações"
      icon={Settings}
      description="Ajustes globais: identidade, integrações, segurança e políticas da plataforma."
      bullets={[
        "Identidade visual e domínios",
        "SSO, MFA e políticas de senha",
        "Integrações críticas e chaves de API",
      ]}
    />
  ),
});
