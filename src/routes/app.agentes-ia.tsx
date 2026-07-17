import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/agentes-ia")({
  head: () => ({
    meta: [
      { title: "Agentes IA — Terra & Lar | ImobiOS" },
      { name: "description", content: "Agentes de IA para atendimento, qualificação e geração de conteúdo." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Agentes IA"
      icon={Bot}
      description="Agentes de IA para atendimento, qualificação e geração de conteúdo."
      bullets={["Atendimento 24/7", "Qualificação de leads", "Geração de descrições"]}
    />
  ),
});
