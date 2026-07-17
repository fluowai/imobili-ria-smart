import { createFileRoute } from "@tanstack/react-router";
import { Plug } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/integracoes")({
  head: () => ({
    meta: [
      { title: "Integrações — Terra & Lar | ImobiOS" },
      { name: "description", content: "Integrações com bancos, cartórios, gateways e ferramentas de marketing." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Sistema"
      title="Integrações"
      icon={Plug}
      description="Integrações com bancos, cartórios, gateways e ferramentas de marketing."
      bullets={["Bancos e cartórios", "Gateways de pagamento", "Ferramentas de marketing"]}
    />
  ),
});
