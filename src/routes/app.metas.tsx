import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/metas")({
  head: () => ({
    meta: [
      { title: "Metas & Vendas — Terra & Lar | ImobiOS" },
      { name: "description", content: "Metas por corretor, funil e comissões." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Metas & Vendas"
      icon={Target}
      description="Metas por corretor, funil e comissões."
      bullets={["Metas por corretor", "Ranking e gamificação", "Comissões automáticas"]}
    />
  ),
});
