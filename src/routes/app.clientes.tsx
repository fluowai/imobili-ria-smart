import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, Plus, Search, Sparkles, Star } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { leads as leadsMock } from "@/mocks/app";
import { createCliente, listClientes } from "@/lib/clientes.functions";

export const Route = createFileRoute("/app/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes Unificado — Terra & Lar | ImobiOS" },
      { name: "description", content: "Base 360 de clientes com histórico completo." },
    ],
  }),
  component: ClientesPage,
});

type ClienteUI = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  tags: string[];
  origem?: string;
  status?: string;
  interesse?: string;
};

function ClientesPage() {
  const [q, setQ] = useState("");
  const list = useServerFn(listClientes);
  const query = useQuery({
    queryKey: ["clientes", q],
    queryFn: () => list({ data: { busca: q || undefined } }),
    retry: false,
  });

  const rows: ClienteUI[] =
    query.data && query.data.length > 0
      ? query.data.map((c) => ({
          id: c.id,
          nome: c.nome,
          email: c.email,
          telefone: c.telefone,
          tags: c.tags,
        }))
      : leadsMock.slice(0, 9).map((l) => ({
          id: l.id,
          nome: l.nome,
          email: l.email,
          telefone: l.telefone,
          tags: [l.origem, l.status],
          origem: l.origem,
          status: l.status,
          interesse: l.interesse,
        }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação"
        title="Clientes Unificado"
        description="Base 360º com histórico completo de cada cliente — leads, contratos, visitas e financeiro."
        actions={
          <>
            <NovoClienteDialog />
            <Button variant="outline" size="sm">Exportar CSV</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniCard label="Clientes ativos" value={String(query.data?.length ?? "1.842")} />
        <MiniCard label="Novos no mês" value="128" />
        <MiniCard label="Compradores" value="642" />
        <MiniCard label="Locatários" value="1.200" />
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, CPF, email ou telefone..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {c.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{c.nome}</p>
                <p className="truncate text-xs text-muted-foreground">{c.email ?? c.telefone ?? "—"}</p>
              </div>
              <button className="text-muted-foreground hover:text-[color:var(--color-warning)]">
                <Star className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.tags.slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary" className="capitalize">
                  {t}
                </Badge>
              ))}
            </div>

            {c.interesse && (
              <p className="mt-3 text-xs text-muted-foreground">Interesse: {c.interesse}</p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="mr-1.5 size-3.5" /> Ligar
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="mr-1.5 size-3.5" /> Email
              </Button>
              <Button size="sm">
                <Sparkles className="mr-1.5 size-3.5" /> IA
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NovoClienteDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const qc = useQueryClient();
  const create = useServerFn(createCliente);
  const mutation = useMutation({
    mutationFn: (data: typeof form) =>
      create({
        data: {
          nome: data.nome,
          email: data.email || undefined,
          telefone: data.telefone || undefined,
          tipo: "pf",
          tags: [],
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
      setOpen(false);
      setForm({ nome: "", email: "", telefone: "" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 size-4" /> Novo cliente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo cliente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tel">Telefone</Label>
            <Input
              id="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
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

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
