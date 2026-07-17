import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/site")({
  head: () => ({
    meta: [
      { title: "Meu Site — Terra & Lar | ImobiOS" },
      { name: "description", content: "Site institucional da imobiliária com integração ao catálogo." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Meu Site"
      icon={Globe}
      description="Site institucional da imobiliária com integração ao catálogo."
      bullets={["Domínio próprio", "Catálogo sincronizado", "SEO otimizado"]}
    />
  ),
});
