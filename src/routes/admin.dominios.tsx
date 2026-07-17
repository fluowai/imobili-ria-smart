import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/dominios")({
  head: () => ({
    meta: [
      { title: "Domínios — Super Admin | ImobiOS" },
      { name: "description", content: "Domínios customizados das imobiliárias." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Plataforma"
      title="Domínios"
      icon={Globe}
      description="Gestão de domínios customizados, DNS e certificados SSL das imobiliárias."
      bullets={[
        "Verificação automática de DNS e SSL",
        "Renovação de certificados sem intervenção",
        "Redirects e alias por cliente",
      ]}
    />
  ),
});
