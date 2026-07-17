import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/marketing")({
  head: () => ({
    meta: [
      { title: "Marketing & SEO — Super Admin | ImobiOS" },
      { name: "description", content: "Campanhas, SEO e conteúdo institucional da plataforma." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Growth"
      title="Marketing & SEO"
      icon={Megaphone}
      description="Campanhas, SEO técnico e conteúdo institucional publicados pela plataforma."
      bullets={[
        "Editor de landing pages institucionais",
        "SEO técnico, sitemaps e schema por rota",
        "Campanhas com UTMs e atribuição",
      ]}
    />
  ),
});
