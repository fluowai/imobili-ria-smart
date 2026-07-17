import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FolderOpen, Search, Upload, File, FileText, FileImage, FileSpreadsheet, MapPin, Share2, History, IdCard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { pastasGED, documentos, type DocTipo } from "@/mocks/gestao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/documentos")({
  head: () => ({
    meta: [
      { title: "Documentos (GED) — ImobiOS" },
      { name: "description", content: "Gestão eletrônica de documentos com versionamento, OCR e compartilhamento seguro." },
    ],
  }),
  component: GEDPage,
});

const tipoInfo: Record<DocTipo, { icon: typeof File; label: string; className: string }> = {
  matricula:  { icon: FileText,        label: "Matrícula", className: "text-blue-600" },
  certidao:   { icon: FileText,        label: "Certidão",  className: "text-emerald-600" },
  contrato:   { icon: FileText,        label: "Contrato",  className: "text-amber-600" },
  foto:       { icon: FileImage,       label: "Fotos",     className: "text-purple-600" },
  planta:     { icon: FileSpreadsheet, label: "Planta",    className: "text-cyan-600" },
  identidade: { icon: IdCard,          label: "ID",        className: "text-rose-600" },
  outros:     { icon: File,            label: "Outros",    className: "text-muted-foreground" },
};

const fmtSize = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);

function GEDPage() {
  const [busca, setBusca] = useState("");
  const [pasta, setPasta] = useState<string | null>(null);

  const filtrados = useMemo(
    () =>
      documentos.filter((d) => {
        if (pasta && !d.pasta.toLowerCase().includes(pasta.toLowerCase())) return false;
        if (busca && !`${d.nome} ${d.pasta}`.toLowerCase().includes(busca.toLowerCase())) return false;
        return true;
      }),
    [busca, pasta],
  );

  const totais = useMemo(() => ({
    docs: documentos.length,
    tamanho: documentos.reduce((a, d) => a + d.tamanhoKB, 0),
    compart: documentos.filter((d) => d.compartilhado).length,
    versoes: documentos.reduce((a, d) => a + d.versoes, 0),
  }), []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Gestão"
        title="Documentos (GED)"
        description="Árvore de pastas, versionamento, OCR e compartilhamento seguro de arquivos."
        actions={<Button size="sm"><Upload className="mr-2 h-4 w-4" />Enviar arquivos</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Documentos" valor={totais.docs} />
        <Kpi label="Armazenamento" valor={fmtSize(totais.tamanho)} />
        <Kpi label="Compartilhados" valor={totais.compart} />
        <Kpi label="Versões totais" valor={totais.versoes} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 h-fit">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pastas</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <button onClick={() => setPasta(null)} className={cn("flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted", pasta === null && "bg-muted font-medium")}>
                <span className="flex items-center gap-2"><FolderOpen className="h-4 w-4 text-primary" />Todos</span>
                <span className="text-xs text-muted-foreground">{documentos.length}</span>
              </button>
            </li>
            {pastasGED.map((p) => (
              <li key={p.id}>
                <button onClick={() => setPasta(p.nome)} className={cn("flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted", pasta === p.nome && "bg-muted font-medium")}>
                  <span className="flex items-center gap-2"><FolderOpen className="h-4 w-4 text-muted-foreground" />{p.nome}</span>
                  <span className="text-xs text-muted-foreground">{p.total}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou pasta (OCR ativo)..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Documento</th>
                  <th className="px-4 py-2">Pasta</th>
                  <th className="px-4 py-2">Autor</th>
                  <th className="px-4 py-2">Atualizado</th>
                  <th className="px-4 py-2 text-right">Tamanho</th>
                  <th className="px-4 py-2 text-right">Versões</th>
                  <th className="px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((d) => {
                  const { icon: Icon, className, label } = tipoInfo[d.tipo];
                  return (
                    <tr key={d.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4 shrink-0", className)} />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{d.nome}</p>
                            <Badge variant="outline" className="mt-0.5 text-[10px]">{label}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{d.pasta}</span>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{d.autor}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{d.atualizadoEm}</td>
                      <td className="px-4 py-2 text-right">{fmtSize(d.tamanhoKB)}</td>
                      <td className="px-4 py-2 text-right">{d.versoes}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><History className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Share2 className={cn("h-3.5 w-3.5", d.compartilhado && "text-primary")} /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtrados.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum documento encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{valor}</p>
    </div>
  );
}
