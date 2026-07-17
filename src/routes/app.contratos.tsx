import { createFileRoute } from "@tanstack/react-router";
import { FileSignature } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/contratos")({
  head: () => ({
    meta: [
      { title: "Contratos & Jurídico — Terra & Lar | ImobiOS" },
      { name: "description", content: "Templates de contrato, assinatura digital e prazos." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Gestão"
      title="Contratos & Jurídico"
      icon={FileSignature}
      description="Templates de contrato, assinatura digital e prazos."
      bullets={["Templates versionados", "Assinatura eletrônica", "Alertas de vencimento"]}
    />
  ),
});
