import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador Financeiro — Terra & Lar | ImobiOS" },
      { name: "description", content: "Simulação de financiamento e cálculo de parcelas." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Gestão"
      title="Simulador Financeiro"
      icon={Calculator}
      description="Simulação de financiamento e cálculo de parcelas."
      bullets={["SAC e Price", "Comparação de bancos", "Proposta em PDF"]}
    />
  ),
});
