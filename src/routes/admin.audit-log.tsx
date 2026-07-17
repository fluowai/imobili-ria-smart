import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditLog } from "@/mocks/admin";

export const Route = createFileRoute("/admin/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — Super Admin | ImobiOS" },
      { name: "description", content: "Trilha de auditoria de todas as ações da plataforma." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Plataforma"
        title="Audit Log"
        description="Histórico imutável de todas as ações executadas na plataforma."
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por ator, ação ou alvo..." className="pl-9" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Ator</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Alvo</TableHead>
              <TableHead>IP</TableHead>
              <TableHead className="text-right">Quando</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLog.map((row) => (
              <TableRow key={row.id} className="border-border">
                <TableCell className="font-medium">{row.ator}</TableCell>
                <TableCell>{row.acao}</TableCell>
                <TableCell>
                  <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
                    {row.alvo}
                  </code>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{row.ip}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {row.quando}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
