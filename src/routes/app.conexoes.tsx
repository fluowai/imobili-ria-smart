import { createFileRoute } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/conexoes")({
  head: () => ({
    meta: [
      { title: "Conexões — Terra & Lar | ImobiOS" },
      { name: "description", content: "Conexões com portais imobiliários (ZAP, Viva Real, OLX)." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Sistema"
      title="Conexões"
      icon={Link2}
      description="Conexões com portais imobiliários (ZAP, Viva Real, OLX)."
      bullets={["Sincronização em tempo real", "Publicação seletiva", "Métricas por portal"]}
    />
  ),
});
