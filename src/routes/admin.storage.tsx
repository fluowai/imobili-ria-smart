import { createFileRoute } from "@tanstack/react-router";
import { Database } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/storage")({
  head: () => ({
    meta: [
      { title: "Storage Intelligence — Super Admin | ImobiOS" },
      { name: "description", content: "Uso e otimização de armazenamento por cliente." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Ferramentas"
      title="Storage Intelligence"
      icon={Database}
      description="Análise de uso de armazenamento por cliente e recomendações de otimização."
      bullets={[
        "Ranking de clientes por consumo",
        "Detecção de duplicatas e arquivos órfãos",
        "Alertas de overage por plano",
      ]}
    />
  ),
});
