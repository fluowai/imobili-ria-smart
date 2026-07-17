import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Filter, Plus, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { leads as leadsMock } from "@/mocks/app";
import type { LeadStatus } from "@/mocks/app";
import { cn } from "@/lib/utils";
import { createLead, listLeads } from "@/lib/leads.functions";

export const Route = createFileRoute("/app/crm")({
  head: () => ({
    meta: [
      { title: "CRM Leads — Terra & Lar | ImobiOS" },
      { name: "description", content: "Gestão de leads e oportunidades." },
    ],
  }),
  component: CrmPage,
});

const statusStyle: Record<LeadStatus, string> = {
  novo:     "bg-[color:var(--color-chart-2)]/15 text-[color:var(--color-chart-2)] border-[color:var(--color-chart-2)]/30",
  contato:  "bg-secondary text-secondary-foreground border-border",
  visita:   "bg-[color:var(--color-chart-3)]/15 text-[color:var(--color-chart-3)] border-[color:var(--color-chart-3)]/30",
  proposta: "bg-[color:var(--color-chart-4)]/15 text-[color:var(--color-chart-4)] border-[color:var(--color-chart-4)]/30",
  fechado:  "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)] border-[color:var(--color-success)]/30",
  perdido:  "bg-destructive/15 text-destructive border-destructive/30",
};

// Mapeia enum do banco → UI (banco usa "qualificando", UI usa "contato").
function dbToUiStatus(s: string): LeadStatus {
  if (s === "qualificando") return "contato";
  return (["novo", "visita", "proposta", "fechado", "perdido"].includes(s) ? s : "novo") as LeadStatus;
}

function CrmPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"todos" | LeadStatus>("todos");

  const list = useServerFn(listLeads);
  const query = useQuery({
    queryKey: ["leads"],
    queryFn: () => list({ data: {} }),
    retry: false,
  });

  const rows = useMemo(() => {
    if (query.data && query.data.length > 0) {
      return query.data.map((l) => ({
        id: l.id,
        nome: l.nome,
        email: l.email ?? "",
        interesse: l.interesse ?? "",
        origem: l.origem,
        responsavel: "—",
        valor: 0,
        status: dbToUiStatus(l.status),
        ultimoContato: new Date(l.createdAt).toLocaleDateString("pt-BR"),
      }));
    }
    return leadsMock;
  }, [query.data]);

  const filtered = useMemo(
    () =>
      rows.filter((l) => {
        if (tab !== "todos" && l.status !== tab) return false;
        if (!q) return true;
        const t = q.toLowerCase();
        return (
          l.nome.toLowerCase().includes(t) ||
          l.email.toLowerCase().includes(t) ||
          l.interesse.toLowerCase().includes(t)
        );
      }),
    [q, tab, rows],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação"
        title="CRM Leads"
        description="Todos os leads da imobiliária em um só lugar."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="mr-1.5 size-4" /> Filtros
            </Button>
            <NovoLeadDialog />
          </>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, email ou interesse..."
            className="pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="novo">Novos</TabsTrigger>
            <TabsTrigger value="visita">Visitas</TabsTrigger>
            <TabsTrigger value="proposta">Propostas</TabsTrigger>
            <TabsTrigger value="fechado">Fechados</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Lead</TableHead>
              <TableHead>Interesse</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Último contato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => (
              <TableRow key={l.id} className="cursor-pointer border-border">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                      {l.nome.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{l.nome}</p>
                      <p className="truncate text-xs text-muted-foreground">{l.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{l.interesse}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">{l.origem}</Badge>
                </TableCell>
                <TableCell className="text-sm">{l.responsavel}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {l.valor ? `R$ ${l.valor.toLocaleString("pt-BR")}` : "—"}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                      statusStyle[l.status],
                    )}
                  >
                    {l.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {l.ultimoContato}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  Nenhum lead encontrado com esses filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function NovoLeadDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", interesse: "" });
  const qc = useQueryClient();
  const create = useServerFn(createLead);
  const mutation = useMutation({
    mutationFn: (data: typeof form) =>
      create({
        data: {
          nome: data.nome,
          email: data.email || undefined,
          telefone: data.telefone || undefined,
          interesse: data.interesse || undefined,
          origem: "site",
          status: "novo",
          score: 0,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      setOpen(false);
      setForm({ nome: "", email: "", telefone: "", interesse: "" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 size-4" /> Novo lead
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="l-nome">Nome</Label>
            <Input
              id="l-nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="l-email">Email</Label>
            <Input
              id="l-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="l-tel">Telefone</Label>
            <Input
              id="l-tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="l-int">Interesse</Label>
            <Input
              id="l-int"
              value={form.interesse}
              onChange={(e) => setForm({ ...form, interesse: e.target.value })}
            />
          </div>
          {mutation.error && (
            <p className="text-xs text-destructive">{(mutation.error as Error).message}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={!form.nome || mutation.isPending}
          >
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
