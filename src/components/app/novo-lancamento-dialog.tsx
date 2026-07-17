import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createLancamento } from "@/lib/lancamentos.functions";

type Tipo = "receita" | "despesa";
type Status = "pendente" | "pago" | "atrasado" | "cancelado";

export function NovoLancamentoDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    tipo: "receita" as Tipo,
    status: "pendente" as Status,
    descricao: "",
    categoria: "",
    valor: "",
    vencimento: "",
  });
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      createLancamento({
        data: {
          tipo: form.tipo,
          status: form.status,
          descricao: form.descricao,
          categoria: form.categoria || undefined,
          valor: Number(form.valor) || 0,
          vencimento: form.vencimento || undefined,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lancamentos"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo lançamento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Tipo</Label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as Tipo })}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="l-desc">Descrição</Label>
            <Input
              id="l-desc"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="l-cat">Categoria</Label>
              <Input
                id="l-cat"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="l-val">Valor (R$)</Label>
              <Input
                id="l-val"
                type="number"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="l-venc">Vencimento</Label>
            <Input
              id="l-venc"
              type="date"
              value={form.vencimento}
              onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
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
            onClick={() => mutation.mutate()}
            disabled={!form.descricao || !form.valor || mutation.isPending}
          >
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
