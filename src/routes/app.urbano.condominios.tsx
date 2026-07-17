import { createFileRoute } from "@tanstack/react-router";
import { Building } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/urbano/condominios")({
  head: () => ({
    meta: [
      { title: "Adm. Condomínios — Terra & Lar | ImobiOS" },
      { name: "description", content: "Administração completa de condomínios: taxas, unidades e comunicados." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Carteira Urbana"
      title="Adm. Condomínios"
      icon={Building}
      description="Administração completa de condomínios: taxas, unidades e comunicados."
      bullets={["Boletos e inadimplência", "Comunicados e enquetes", "Assembleias digitais"]}
    />
  ),
});
