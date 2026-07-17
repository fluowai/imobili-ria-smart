import { createFileRoute } from "@tanstack/react-router";
import { Key } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/urbano/chaves")({
  head: () => ({
    meta: [
      { title: "Controle de Chaves — Terra & Lar | ImobiOS" },
      { name: "description", content: "Registro de entradas e saídas de chaves por unidade." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Carteira Urbana"
      title="Controle de Chaves"
      icon={Key}
      description="Registro de entradas e saídas de chaves por unidade."
      bullets={["Ficha de retirada", "Assinatura digital", "Alertas de atraso"]}
    />
  ),
});
