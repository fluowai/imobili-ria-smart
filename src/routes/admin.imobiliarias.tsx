import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Filter, Plus, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { imobiliarias, type ImobStatus } from "@/mocks/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/imobiliarias")({
  head: () => ({
    meta: [
      { title: "Imobiliárias — Super Admin | ImobiOS" },
      { name: "description", content: "Lista de imobiliárias clientes da plataforma." },
    ],
  }),
  component: ImobiliariasPage,
});

const statusStyle: Record<ImobStatus, string> = {
  ativa: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)] border-[color:var(--color-success)]/30",
  trial: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/30",
  suspensa: "bg-muted text-muted-foreground border-border",
  cancelada: "bg-destructive/15 text-destructive border-destructive/30",
};

function ImobiliariasPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"todas" | ImobStatus>("todas");

  function handleAcessarPainel(id: string) {
    localStorage.setItem("admin_imob_override", id);
    navigate({ to: "/app/dashboard" });
  }

  const { data: imobiliarias } = useQuery({
    queryKey: ["admin_imobiliarias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("imobiliarias").select("*");
      if (error) throw error;
      return data;
    }
  });

  const filtered = useMemo(() => {
    if (!imobiliarias) return [];
    return imobiliarias.map((i: any) => ({
      id: i.id,
      nome: i.nome,
      cidade: "São Paulo", // Fictício, precisaria de join com endereço
      uf: "SP",
      plano: "premium",
      usuarios: 0,
      imoveis: 0,
      mrr: 0,
      status: "ativa" as ImobStatus
    })).filter((i: any) => {
      if (tab !== "todas" && i.status !== tab) return false;
      if (!q) return true;
      const t = q.toLowerCase();
      return (
        i.nome.toLowerCase().includes(t) ||
        i.cidade.toLowerCase().includes(t) ||
        i.id.toLowerCase().includes(t)
      );
    });
  }, [q, tab, imobiliarias]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Clientes"
        title="Imobiliárias"
        description="Todas as imobiliárias que operam na plataforma."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="mr-1.5 size-4" />
              Filtros
            </Button>
            <Button size="sm">
              <Plus className="mr-1.5 size-4" />
              Nova imobiliária
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, cidade ou ID..."
            className="pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="todas">Todas ({imobiliarias?.length || 0})</TabsTrigger>
            <TabsTrigger value="ativa">Ativas</TabsTrigger>
            <TabsTrigger value="trial">Trial</TabsTrigger>
            <TabsTrigger value="suspensa">Suspensas</TabsTrigger>
            <TabsTrigger value="cancelada">Canceladas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Imobiliária</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead className="text-right">Usuários</TableHead>
              <TableHead className="text-right">Imóveis</TableHead>
              <TableHead className="text-right">MRR</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((im) => (
              <TableRow key={im.id} className="cursor-pointer border-border">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{im.nome}</p>
                      <p className="text-xs text-muted-foreground">{im.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {im.cidade}, {im.uf}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {im.plano}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{im.usuarios}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {im.imoveis.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {im.mrr > 0 ? `R$ ${im.mrr.toLocaleString("pt-BR")}` : "—"}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                      statusStyle[im.status],
                    )}
                  >
                    {im.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleAcessarPainel(im.id)}>
                    Acessar painel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  Nenhuma imobiliária encontrada com esses filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
