import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Smartphone,
  QrCode,
  Plus,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  RefreshCw,
  Power,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";

export const Route = createFileRoute("/app/conexoes")({
  head: () => ({
    meta: [
      { title: "Conexões WhatsApp — Terra & Lar | ImobiOS" },
      { name: "description", content: "Conexões WhatsApp via whatsmeow — múltiplas instâncias por corretor." },
    ],
  }),
  component: ConexoesPage,
});

type InstanciaStatus = "conectado" | "desconectado" | "pareando" | "erro";

interface Instancia {
  id: string;
  nome: string;
  numero: string;
  responsavel: string;
  status: InstanciaStatus;
  mensagensDia: number;
  ultimaAtividade: string;
  bateria?: number;
}

const instancias: Instancia[] = [
  { id: "ins-01", nome: "Atendimento Principal", numero: "+55 65 99812-4400", responsavel: "Central",         status: "conectado",    mensagensDia: 342, ultimaAtividade: "há 12 s", bateria: 87 },
  { id: "ins-02", nome: "Marcos Silva",          numero: "+55 65 99845-1122", responsavel: "Marcos Silva",    status: "conectado",    mensagensDia: 128, ultimaAtividade: "há 2 min", bateria: 64 },
  { id: "ins-03", nome: "Larissa Santos",        numero: "+55 65 99870-5544", responsavel: "Larissa Santos",  status: "conectado",    mensagensDia: 96,  ultimaAtividade: "há 8 min", bateria: 41 },
  { id: "ins-04", nome: "Diego Farias",          numero: "+55 65 99833-9977", responsavel: "Diego Farias",    status: "pareando",     mensagensDia: 0,   ultimaAtividade: "aguardando QR" },
  { id: "ins-05", nome: "SDR Rural",             numero: "+55 65 99811-2020", responsavel: "Ana Ribeiro",     status: "desconectado", mensagensDia: 0,   ultimaAtividade: "há 3 h" },
  { id: "ins-06", nome: "Recuperação",           numero: "+55 65 99899-3311", responsavel: "Automação",       status: "erro",         mensagensDia: 0,   ultimaAtividade: "sessão expirada" },
];

const statusMeta: Record<InstanciaStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  conectado:    { label: "Conectado",    className: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",       Icon: CheckCircle2 },
  pareando:     { label: "Pareando",     className: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",       Icon: QrCode },
  desconectado: { label: "Desconectado", className: "bg-muted text-muted-foreground",                                              Icon: PauseCircle },
  erro:         { label: "Erro",         className: "bg-[color:var(--color-destructive)]/15 text-[color:var(--color-destructive)]", Icon: AlertCircle },
};

function ConexoesPage() {
  const [pareando, setPareando] = useState<Instancia | null>(null);

  const total = instancias.length;
  const conectadas = instancias.filter((i) => i.status === "conectado").length;
  const mensagens = instancias.reduce((s, i) => s + i.mensagensDia, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sistema"
        title="Conexões WhatsApp"
        description="Instâncias WhatsApp via whatsmeow — uma por corretor ou setor, com QR Code próprio."
        actions={
          <button
            onClick={() => setPareando({ id: "novo", nome: "Nova instância", numero: "—", responsavel: "—", status: "pareando", mensagensDia: 0, ultimaAtividade: "aguardando QR" })}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-4" /> Nova instância
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Instâncias" value={`${conectadas}/${total}`} icon={Smartphone} hint="conectadas" />
        <StatCard label="Mensagens hoje" value={mensagens.toLocaleString("pt-BR")} icon={MessageSquare} trend="up" delta="+8%" />
        <StatCard label="Uptime médio" value="99,2%" hint="últimos 7 dias" />
        <StatCard label="Sessões expiradas" value="1" hint="requer re-pareamento" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {instancias.map((i) => {
          const meta = statusMeta[i.status];
          return (
            <div key={i.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]">
                    <Smartphone className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{i.nome}</p>
                    <p className="text-xs text-muted-foreground">{i.numero}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>
                  <meta.Icon className="size-3.5" />
                  {meta.label}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Responsável</p>
                  <p className="truncate font-medium">{i.responsavel}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Mensagens/dia</p>
                  <p className="font-display text-lg font-semibold">{i.mensagensDia}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{i.ultimaAtividade}{typeof i.bateria === "number" ? ` · bateria ${i.bateria}%` : ""}</span>
                <div className="flex gap-1.5">
                  {(i.status === "desconectado" || i.status === "erro" || i.status === "pareando") && (
                    <button
                      onClick={() => setPareando(i)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 hover:border-primary/50 hover:text-foreground"
                    >
                      <QrCode className="size-3.5" /> QR Code
                    </button>
                  )}
                  {i.status === "conectado" && (
                    <button className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 hover:border-primary/50 hover:text-foreground">
                      <RefreshCw className="size-3.5" /> Reconectar
                    </button>
                  )}
                  <button className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 hover:border-[color:var(--color-destructive)]/50 hover:text-[color:var(--color-destructive)]">
                    <Power className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pareando && <QRDialog instancia={pareando} onClose={() => setPareando(null)} />}
    </div>
  );
}

function QRDialog({ instancia, onClose }: { instancia: Instancia; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Pareamento whatsmeow</p>
            <h3 className="mt-1 font-display text-lg font-semibold">{instancia.nome}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg border border-border px-2 py-1 text-xs hover:border-primary/50">
            Fechar
          </button>
        </div>

        <div className="mt-5 grid place-items-center rounded-2xl bg-background p-6">
          <div
            className="size-56 rounded-xl"
            style={{
              backgroundImage:
                "conic-gradient(from 0deg, #000 0 25%, transparent 25% 50%, #000 50% 75%, transparent 75% 100%), radial-gradient(circle at 20% 20%, #000 0 8%, transparent 8%), radial-gradient(circle at 80% 20%, #000 0 8%, transparent 8%), radial-gradient(circle at 20% 80%, #000 0 8%, transparent 8%)",
              backgroundSize: "16px 16px, 100% 100%, 100% 100%, 100% 100%",
              backgroundColor: "white",
            }}
            aria-label="QR Code de pareamento"
          />
        </div>

        <ol className="mt-5 space-y-2 text-sm text-muted-foreground">
          <li>1. Abra o WhatsApp no celular do responsável.</li>
          <li>2. Toque em <span className="text-foreground">Configurações → Aparelhos conectados</span>.</li>
          <li>3. Toque em <span className="text-foreground">Conectar um aparelho</span> e aponte para este QR.</li>
        </ol>

        <p className="mt-4 text-xs text-muted-foreground">
          O QR expira em 45s e é regenerado automaticamente. A sessão fica salva no servidor whatsmeow.
        </p>
      </div>
    </div>
  );
}
