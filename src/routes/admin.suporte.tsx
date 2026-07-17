import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/suporte")({
  head: () => ({
    meta: [
      { title: "Suporte — Super Admin | ImobiOS" },
      { name: "description", content: "Tickets e atendimento a imobiliárias clientes." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Clientes"
      title="Suporte"
      icon={LifeBuoy}
      description="Central de tickets, SLA e histórico de atendimento por imobiliária."
      bullets={[
        "Inbox unificado de tickets com filtros por prioridade e SLA",
        "Base de conhecimento interna com respostas prontas",
        "Escalonamento automático e visão por cliente",
      ]}
    />
  ),
});
