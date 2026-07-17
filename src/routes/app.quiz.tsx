import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Terra & Lar | ImobiOS" },
      { name: "description", content: "Quizzes interativos para qualificar leads." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Quiz"
      icon={HelpCircle}
      description="Quizzes interativos para qualificar leads."
      bullets={["Fluxo condicional", "Score automático", "Integração com CRM"]}
    />
  ),
});
