import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/urbano/imoveis")({
  head: () => ({
    meta: [
      { title: "Imóveis Urbanos — Terra & Lar | ImobiOS" },
      { name: "description", content: "Todo o catálogo de imóveis urbanos com galeria, ficha e histórico." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Carteira Urbana"
      title="Imóveis Urbanos"
      icon={Building2}
      description="Todo o catálogo de imóveis urbanos com galeria, ficha e histórico."
      bullets={["Grid + filtros avançados", "Ficha completa com galeria", "Publicação em portais"]}
    />
  ),
});
