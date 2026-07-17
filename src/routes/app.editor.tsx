import { createFileRoute } from "@tanstack/react-router";
import { Wand2 } from "lucide-react";
import { PageStub } from "@/components/shared/page-stub";

export const Route = createFileRoute("/app/editor")({
  head: () => ({
    meta: [
      { title: "Editor Visual — Terra & Lar | ImobiOS" },
      { name: "description", content: "Editor visual drag-and-drop para o site e landing pages." },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Crescimento"
      title="Editor Visual"
      icon={Wand2}
      description="Editor visual drag-and-drop para o site e landing pages."
      bullets={["Drag-and-drop", "Componentes prontos", "Preview mobile e desktop"]}
    />
  ),
});
