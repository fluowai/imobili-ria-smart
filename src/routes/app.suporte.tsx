import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/suporte")({
  head: () => ({
    meta: [
      { title: "Suporte — Terra & Lar | ImobiOS" },
      { name: "description", content: "Central de ajuda e abertura de tickets." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Sistema"
      title="Suporte"
      icon={LifeBuoy}
      description="Central de ajuda e abertura de tickets."
      bullets={["Base de conhecimento", "Abertura de tickets", "Chat com o time"]}
    />
  ),
});
