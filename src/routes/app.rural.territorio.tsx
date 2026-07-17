import { createFileRoute } from "@tanstack/react-router";
import { Map } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/rural/territorio")({
  head: () => ({
    meta: [
      { title: "Território Rural — Terra & Lar | ImobiOS" },
      { name: "description", content: "Mapa interativo com camadas do CAR, APPs e áreas de reserva legal." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Carteira Rural"
      title="Território Rural"
      icon={Map}
      description="Mapa interativo com camadas do CAR, APPs e áreas de reserva legal."
      bullets={["Camadas do CAR sobrepostas", "Medição de áreas e distâncias", "Exportação KML/Shape"]}
    />
  ),
});
