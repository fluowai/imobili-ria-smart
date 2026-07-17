import { createFileRoute } from "@tanstack/react-router";
import { PieChart } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios Gerenciais — Terra & Lar | ImobiOS" },
      { name: "description", content: "Relatórios executivos com dashboards customizáveis." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Relatórios Gerenciais"
      icon={PieChart}
      description="Relatórios executivos com dashboards customizáveis."
      bullets={["Dashboards customizáveis", "Exportação PDF/Excel", "Envio agendado por email"]}
    />
  ),
});
