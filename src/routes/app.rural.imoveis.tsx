import { createFileRoute } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/rural/imoveis")({
  head: () => ({
    meta: [
      { title: "Imóveis Rurais — Terra & Lar | ImobiOS" },
      { name: "description", content: "Fichas completas de imóveis rurais com CAR, matrícula e georreferenciamento." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Carteira Rural"
      title="Imóveis Rurais"
      icon={Sprout}
      description="Fichas completas de imóveis rurais com CAR, matrícula e georreferenciamento."
      bullets={["Ficha com CAR e matrícula", "Camadas de APP e reserva legal", "Documentação digitalizada"]}
    />
  ),
});
