import { createFileRoute } from "@tanstack/react-router";
import { Landmark } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/urbano/loteamentos")({
  head: () => ({
    meta: [
      { title: "Loteamentos — Terra & Lar | ImobiOS" },
      { name: "description", content: "Mapa de lotes, disponibilidade em tempo real e reservas." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Carteira Urbana"
      title="Loteamentos"
      icon={Landmark}
      description="Mapa de lotes, disponibilidade em tempo real e reservas."
      bullets={["Mapa interativo de lotes", "Reserva com carência", "Comissão automática"]}
    />
  ),
});
