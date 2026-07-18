import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Phone, Mail, Building2, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/crm/$id")({
  head: () => ({
    meta: [{ title: "Detalhes do Lead — ImobiOS" }],
  }),
  component: LeadDetailsPage,
});

function LeadDetailsPage() {
  const { id } = useParams({ from: "/app/crm/$id" });

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading)
    return <div className="p-8 text-center text-muted-foreground">Carregando lead...</div>;
  if (!lead) return <div className="p-8 text-center text-destructive">Lead não encontrado.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/app/crm">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          eyebrow="Detalhes"
          title={lead.nome}
          description={`Lead gerado via ${lead.origem} — Status: ${lead.status}`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-2">
          <h3 className="font-semibold mb-4">Informações de Contato</h3>
          <div className="space-y-4">
            {lead.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
            )}
            {lead.telefone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.telefone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Interesse: {lead.interesse || "Não informado"}</span>
            </div>
          </div>

          <h3 className="font-semibold mt-8 mb-4">Anotações</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {lead.observacoes || "Nenhuma anotação registrada."}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Ações Rápidas</h3>
            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() =>
                  window.open(`https://wa.me/${lead.telefone?.replace(/\D/g, "")}`, "_blank")
                }
                disabled={!lead.telefone}
              >
                <Phone className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => (window.location.href = `mailto:${lead.email}`)}
                disabled={!lead.email}
              >
                <Mail className="mr-2 h-4 w-4" /> Enviar Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
