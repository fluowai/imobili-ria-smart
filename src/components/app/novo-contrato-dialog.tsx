import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
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
import { createContrato } from "@/lib/contratos.functions";

type Tipo = "venda" | "locacao" | "captacao" | "administracao";

export function NovoContratoDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ tipo: Tipo; valor: string; inicio: string; fim: string }>({
    tipo: "venda",
    valor: "",
    inicio: "",
    fim: "",
  });
  const qc = useQueryClient();
  const create = useServerFn(createContrato);
  const mutation = useMutation({
    mutationFn: () =>
      create({
        data: {
          tipo: form.tipo,
          status: "rascunho",
          valor: form.valor ? Number(form.valor) : undefined,
          inicio: form.inicio || undefined,
          fim: form.fim || undefined,
          metadados: {},
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contratos"] });
      setOpen(false);
      setForm({ tipo: "venda", valor: "", inicio: "", fim: "" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo contrato
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo contrato</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Tipo</Label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as Tipo })}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="venda">Compra e venda</option>
              <option value="locacao">Locação</option>
              <option value="captacao">Captação</option>
              <option value="administracao">Administração</option>
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="c-valor">Valor (R$)</Label>
            <Input
              id="c-valor"
              type="number"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="c-inicio">Início</Label>
              <Input
                id="c-inicio"
                type="date"
                value={form.inicio}
                onChange={(e) => setForm({ ...form, inicio: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="c-fim">Fim</Label>
              <Input
                id="c-fim"
                type="date"
                value={form.fim}
                onChange={(e) => setForm({ ...form, fim: e.target.value })}
              />
            </div>
          </div>
          {mutation.error && (
            <p className="text-xs text-destructive">{(mutation.error as Error).message}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
