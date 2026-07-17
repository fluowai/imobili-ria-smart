import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Phone, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/clientes/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Cliente — ImobiOS" },
    ],
  }),
  component: ClienteDetailsPage,
});

function ClienteDetailsPage() {
  const { id } = useParams({ from: "/app/clientes/$id" });

  const { data: cliente, isLoading } = useQuery({
    queryKey: ["cliente", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Carregando cliente...</div>;
  if (!cliente) return <div className="p-8 text-center text-destructive">Cliente não encontrado.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/app/clientes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          eyebrow="Cliente"
          title={cliente.nome}
          description={`Cliente tipo: ${cliente.tipo.toUpperCase()}`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-2">
          <h3 className="font-semibold mb-4">Informações de Contato</h3>
          <div className="space-y-4">
            {cliente.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{cliente.email}</span>
              </div>
            )}
            {cliente.telefone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{cliente.telefone}</span>
              </div>
            )}
            {cliente.endereco && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{cliente.endereco}</span>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold mt-8 mb-4">Anotações</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {cliente.observacoes || "Nenhuma anotação registrada para este cliente."}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Ações Rápidas</h3>
            <div className="flex flex-col gap-2">
              <Button className="w-full" variant="outline" onClick={() => window.open(`https://wa.me/${cliente.telefone?.replace(/\D/g, '')}`, '_blank')} disabled={!cliente.telefone}>
                <Phone className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = `mailto:${cliente.email}`} disabled={!cliente.email}>
                <Mail className="mr-2 h-4 w-4" /> Enviar Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
