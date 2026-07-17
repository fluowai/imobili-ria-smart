import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/documentos")({
  head: () => ({
    meta: [
      { title: "Documentos (GED) — Terra & Lar | ImobiOS" },
      { name: "description", content: "Gestão eletrônica de documentos com versionamento." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Gestão"
      title="Documentos (GED)"
      icon={FolderOpen}
      description="Gestão eletrônica de documentos com versionamento."
      bullets={["Árvore de pastas", "Versionamento e OCR", "Compartilhamento seguro"]}
    />
  ),
});
