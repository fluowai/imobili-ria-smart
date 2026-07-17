import { createFileRoute } from "@tanstack/react-router";
import { DollarSign } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro & ERP — Terra & Lar | ImobiOS" },
      { name: "description", content: "Contas a pagar, a receber, fluxo de caixa e DRE." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Gestão"
      title="Financeiro & ERP"
      icon={DollarSign}
      description="Contas a pagar, a receber, fluxo de caixa e DRE."
      bullets={["Contas a pagar e receber", "Fluxo de caixa projetado", "DRE gerencial"]}
    />
  ),
});
