import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/consultoria")({
  head: () => ({
    meta: [
      { title: "Consultoria — Super Admin | ImobiOS" },
      { name: "description", content: "Agenda de consultorias e onboarding de clientes." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Sucesso"
      title="Consultoria"
      icon={CalendarDays}
      description="Agenda de sessões de onboarding, treinamento e consultoria comercial."
      bullets={[
        "Calendário compartilhado por consultor",
        "Playbook de onboarding por porte de cliente",
        "NPS pós-sessão",
      ]}
    />
  ),
});
