import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/equipe")({
  head: () => ({
    meta: [
      { title: "Equipe — Super Admin | ImobiOS" },
      { name: "description", content: "Membros da equipe interna da plataforma." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Interno"
      title="Equipe"
      icon={Users}
      description="Colaboradores da ImobiOS com acesso ao Super Admin."
      bullets={[
        "Convites, papéis e permissões granulares",
        "Auditoria por ator com trilha completa",
        "SSO corporativo e MFA obrigatório",
      ]}
    />
  ),
});
