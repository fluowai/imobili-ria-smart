import { createFileRoute } from "@tanstack/react-router";
import { CloudUpload } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/admin/migracao")({
  head: () => ({
    meta: [
      { title: "Migração FluowAI — Super Admin | ImobiOS" },
      { name: "description", content: "Migração de dados a partir do sistema legado FluowAI." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Ferramentas"
      title="Migração FluowAI"
      icon={CloudUpload}
      description="Assistente dedicado à migração completa de bases vindas do FluowAI para o ImobiOS."
      bullets={[
        "Conector direto com a base legada",
        "Preview de mapeamento antes do commit",
        "Migração incremental com rollback",
      ]}
    />
  ),
});
