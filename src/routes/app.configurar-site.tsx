import { createFileRoute } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/configurar-site")({
  head: () => ({
    meta: [
      { title: "Configurar Site — Terra & Lar | ImobiOS" },
      { name: "description", content: "Configurações de identidade visual, SEO e integrações do site." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Configurar Site"
      icon={Settings2}
      description="Configurações de identidade visual, SEO e integrações do site."
      bullets={["Cores e tipografia", "Meta tags e Open Graph", "Pixels e analytics"]}
    />
  ),
});
