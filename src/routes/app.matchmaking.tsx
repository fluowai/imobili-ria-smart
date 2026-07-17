import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/matchmaking")({
  head: () => ({
    meta: [
      { title: "Matchmaking 360 — Terra & Lar | ImobiOS" },
      { name: "description", content: "IA que cruza perfil de compradores com o catálogo em tempo real." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Matchmaking 360"
      icon={Zap}
      description="IA que cruza perfil de compradores com o catálogo em tempo real."
      bullets={["Score de compatibilidade", "Notificações automáticas", "Aprendizado contínuo"]}
    />
  ),
});
