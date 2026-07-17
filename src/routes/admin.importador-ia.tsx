import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/importador-ia")({
  head: () => ({
    meta: [
      { title: "Importador IA — Super Admin | ImobiOS" },
      { name: "description", content: "Importação inteligente de bases de dados legadas." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Ferramentas"
      title="Importador IA"
      icon={Sparkles}
      description="Importe planilhas, PDFs e bases legadas com deduplicação e enriquecimento por IA."
      bullets={[
        "Mapeamento automático de colunas",
        "Deduplicação por similaridade semântica",
        "Enriquecimento com CEP, CNPJ e CAR",
      ]}
    />
  ),
});
