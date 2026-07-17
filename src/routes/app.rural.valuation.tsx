import { createFileRoute } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/rural/valuation")({
  head: () => ({
    meta: [
      { title: "Valuation CAR — Terra & Lar | ImobiOS" },
      { name: "description", content: "Avaliação assistida por IA para imóveis rurais com base em dados do CAR." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Carteira Rural"
      title="Valuation CAR"
      icon={Coins}
      description="Avaliação assistida por IA para imóveis rurais com base em dados do CAR."
      bullets={["Cálculo automatizado por IA", "Comparativos regionais", "Laudo em PDF"]}
    />
  ),
});
