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
import { createImovel } from "@/lib/imoveis.functions";

type Finalidade = "venda" | "locacao" | "ambos";

export function NovoImovelDialog({ tipo = "urbano" as "urbano" | "rural" }: { tipo?: "urbano" | "rural" }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    codigo: "",
    titulo: "",
    finalidade: "venda" as Finalidade,
    bairro: "",
    cidade: "",
    valorVenda: "",
    valorLocacao: "",
    areaUtil: "",
  });
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      createImovel({
        data: {
          codigo: form.codigo,
          tipo,
          finalidade: form.finalidade,
          status: "disponivel",
          titulo: form.titulo,
          bairro: form.bairro || undefined,
          cidade: form.cidade || undefined,
          valor_venda: form.valorVenda ? Number(form.valorVenda) : undefined,
          valor_locacao: form.valorLocacao ? Number(form.valorLocacao) : undefined,
          area_util: form.areaUtil ? Number(form.areaUtil) : undefined,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["imoveis"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo imóvel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo imóvel {tipo === "rural" ? "rural" : "urbano"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="i-cod">Código</Label>
              <Input
                id="i-cod"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Finalidade</Label>
              <select
                value={form.finalidade}
                onChange={(e) => setForm({ ...form, finalidade: e.target.value as Finalidade })}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="venda">Venda</option>
                <option value="locacao">Locação</option>
                <option value="ambos">Venda + Locação</option>
              </select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="i-tit">Título</Label>
            <Input
              id="i-tit"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="i-bai">Bairro</Label>
              <Input
                id="i-bai"
                value={form.bairro}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-cid">Cidade</Label>
              <Input
                id="i-cid"
                value={form.cidade}
                onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="i-vv">Venda (R$)</Label>
              <Input
                id="i-vv"
                type="number"
                value={form.valorVenda}
                onChange={(e) => setForm({ ...form, valorVenda: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-vl">Aluguel (R$)</Label>
              <Input
                id="i-vl"
                type="number"
                value={form.valorLocacao}
                onChange={(e) => setForm({ ...form, valorLocacao: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-au">Área (m²)</Label>
              <Input
                id="i-au"
                type="number"
                value={form.areaUtil}
                onChange={(e) => setForm({ ...form, areaUtil: e.target.value })}
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
          <Button
            onClick={() => mutation.mutate()}
            disabled={!form.codigo || !form.titulo || mutation.isPending}
          >
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
