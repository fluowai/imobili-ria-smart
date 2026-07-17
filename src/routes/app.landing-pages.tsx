import { createFileRoute } from "@tanstack/react-router";
import { LayoutPanelTop } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/landing-pages")({
  head: () => ({
    meta: [
      { title: "Landing Pages — Terra & Lar | ImobiOS" },
      { name: "description", content: "Landing pages otimizadas para captura de leads." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Landing Pages"
      icon={LayoutPanelTop}
      description="Landing pages otimizadas para captura de leads."
      bullets={["Templates prontos", "A/B testing", "Integração com CRM"]}
    />
  ),
});
