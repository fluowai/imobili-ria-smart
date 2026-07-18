import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, DollarSign, Download, FileText, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoices } from "@/mocks/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/billing")({
  head: () => ({
    meta: [
      { title: "Billing — Super Admin | ImobiOS" },
      { name: "description", content: "Faturamento e cobrança dos clientes da plataforma." },
    ],
  }),
  component: BillingPage,
});

const statusStyle: Record<string, string> = {
  paga: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)] border-[color:var(--color-success)]/30",
  pendente:
    "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/30",
  atrasada: "bg-destructive/15 text-destructive border-destructive/30",
};

function BillingPage() {
  const totalPago = invoices.filter((i) => i.status === "paga").reduce((a, i) => a + i.valor, 0);
  const totalPendente = invoices
    .filter((i) => i.status !== "paga")
    .reduce((a, i) => a + i.valor, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Financeiro"
        title="Billing"
        description="Faturas emitidas, recebimentos e inadimplência."
        actions={
          <Button size="sm" variant="outline">
            <Download className="mr-1.5 size-4" />
            Exportar CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Recebido no mês"
          value={`R$ ${(totalPago / 1000).toFixed(1)}k`}
          delta="+11%"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          label="A receber"
          value={`R$ ${(totalPendente / 1000).toFixed(1)}k`}
          icon={TrendingUp}
          hint="6 faturas"
        />
        <StatCard
          label="Taxa de sucesso"
          value="98,4%"
          delta="+0,3pp"
          trend="up"
          icon={CheckCircle2}
          hint="cobrança automática"
        />
        <StatCard label="Faturas emitidas" value="128" icon={FileText} hint="últimos 30 dias" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="font-display text-base font-semibold">Faturas recentes</h3>
            <p className="text-xs text-muted-foreground">Emitidas nos últimos 30 dias</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Fatura</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((f) => (
              <TableRow key={f.id} className="border-border">
                <TableCell className="font-mono text-xs">{f.id}</TableCell>
                <TableCell className="font-medium">{f.cliente}</TableCell>
                <TableCell className="text-right tabular-nums">
                  R$ {f.valor.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(f.vencimento).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                      statusStyle[f.status],
                    )}
                  >
                    {f.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
