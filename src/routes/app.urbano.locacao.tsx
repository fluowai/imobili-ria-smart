import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/urbano/locacao")({
  head: () => ({
    meta: [
      { title: "Gestão de Locação — Terra & Lar | ImobiOS" },
      { name: "description", content: "Contratos ativos, boletos, reajustes e vistorias de locação." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Carteira Urbana"
      title="Gestão de Locação"
      icon={KeyRound}
      description="Contratos ativos, boletos, reajustes e vistorias de locação."
      bullets={["Cobrança automática", "Reajustes indexados", "Vistorias digitais"]}
    />
  ),
});
