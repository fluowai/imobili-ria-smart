import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Bell, Shield, CreditCard, Users, Palette, Globe, Link2, CheckCircle2, AlertCircle, PauseCircle, Clock, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { portais, type PortalStatus } from "@/mocks/sistema";

export const Route = createFileRoute("/app/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Terra & Lar | ImobiOS" },
      { name: "description", content: "Configurações gerais da imobiliária." },
    ],
  }),
  component: ConfiguracoesPage,
});

const tabs = [
  { id: "empresa",       label: "Empresa",       icon: Globe },
  { id: "portais",       label: "Portais",       icon: Link2 },
  { id: "usuarios",      label: "Usuários",      icon: Users },
  { id: "notificacoes",  label: "Notificações",  icon: Bell },
  { id: "seguranca",     label: "Segurança",     icon: Shield },
  { id: "aparencia",     label: "Aparência",     icon: Palette },
  { id: "faturamento",   label: "Faturamento",   icon: CreditCard },
] as const;

type TabId = (typeof tabs)[number]["id"];

function ConfiguracoesPage() {
  const [tab, setTab] = useState<TabId>("empresa");

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Sistema" title="Configurações" description="Preferências da imobiliária, time e faturamento." />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-2 lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-border bg-card p-6">
          {tab === "empresa" && <EmpresaTab />}
          {tab === "portais" && <PortaisTab />}
          {tab === "usuarios" && <UsuariosTab />}
          {tab === "notificacoes" && <NotificacoesTab />}
          {tab === "seguranca" && <SegurancaTab />}
          {tab === "aparencia" && <AparenciaTab />}
          {tab === "faturamento" && <FaturamentoTab />}
        </div>
      </div>
    </div>
  );
}

const portalStatusMeta: Record<PortalStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  conectado: { label: "Conectado", className: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",       Icon: CheckCircle2 },
  erro:      { label: "Erro",      className: "bg-[color:var(--color-destructive)]/15 text-[color:var(--color-destructive)]", Icon: AlertCircle },
  pausado:   { label: "Pausado",   className: "bg-muted text-muted-foreground",                                              Icon: PauseCircle },
  pendente:  { label: "Pendente",  className: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",         Icon: Clock },
};

function PortaisTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle icon={Link2} title="Portais imobiliários" />
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <RefreshCw className="size-4" /> Sincronizar tudo
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        Publicação e sincronização automática com ZAP, Viva Real, OLX e demais portais.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {portais.map((p) => {
          const meta = portalStatusMeta[p.status];
          return (
            <div key={p.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-muted text-xl">{p.logo}</span>
                  <div>
                    <p className="font-medium text-foreground">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">Plano: {p.plano}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>
                  <meta.Icon className="size-3.5" />
                  {meta.label}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.imoveisPublicados} imóveis · {p.leadsMes} leads/mês</span>
                <span>{p.ultimaSync}</span>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="rounded-lg border border-border px-2.5 py-1 text-xs hover:border-primary/50">
                  Configurar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function EmpresaTab() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Settings} title="Dados da imobiliária" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Razão social"><input defaultValue="Terra & Lar Imóveis Ltda" className={inputCls} /></Field>
        <Field label="CNPJ"><input defaultValue="12.345.678/0001-99" className={inputCls} /></Field>
        <Field label="CRECI"><input defaultValue="J-4821" className={inputCls} /></Field>
        <Field label="Telefone"><input defaultValue="(65) 3025-8899" className={inputCls} /></Field>
        <Field label="E-mail"><input defaultValue="contato@terralar.com.br" className={inputCls} /></Field>
        <Field label="Site"><input defaultValue="terralar.com.br" className={inputCls} /></Field>
      </div>
      <Field label="Endereço">
        <input defaultValue="Av. Historiador Rubens de Mendonça, 3400 — Cuiabá/MT" className={inputCls} />
      </Field>
      <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
        Salvar alterações
      </button>
    </div>
  );
}

function UsuariosTab() {
  const usuarios = [
    { nome: "Marcos Silva",    email: "marcos@terralar.com.br",   papel: "Admin",       status: "ativo" },
    { nome: "Larissa Santos",  email: "larissa@terralar.com.br",  papel: "Corretora",   status: "ativo" },
    { nome: "Diego Farias",    email: "diego@terralar.com.br",    papel: "Corretor",    status: "ativo" },
    { nome: "Ana Ribeiro",     email: "ana@terralar.com.br",      papel: "Financeiro",  status: "convite" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle icon={Users} title="Equipe (4 de 10 licenças)" />
        <button className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Convidar usuário
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5">Usuário</th>
              <th className="px-4 py-2.5">Papel</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.email} className="border-t border-border">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{u.nome}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.papel}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.status === "ativo"
                        ? "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]"
                        : "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificacoesTab() {
  const items = [
    { id: "leads",    label: "Novos leads",              on: true },
    { id: "visitas",  label: "Visitas agendadas",        on: true },
    { id: "propostas",label: "Propostas recebidas",      on: true },
    { id: "contratos",label: "Contratos assinados",      on: true },
    { id: "boletos", label: "Vencimento de boletos",     on: false },
    { id: "portais", label: "Falhas de sincronização",   on: true },
  ];
  return (
    <div className="space-y-4">
      <SectionTitle icon={Bell} title="Preferências de notificação" />
      <div className="divide-y divide-border rounded-xl border border-border">
        {items.map((n) => (
          <div key={n.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm">{n.label}</span>
            <Toggle defaultOn={n.on} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SegurancaTab() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Shield} title="Segurança da conta" />
      <div className="rounded-xl border border-border p-4">
        <p className="font-medium">Autenticação em dois fatores</p>
        <p className="mt-1 text-xs text-muted-foreground">Proteja o acesso com código do aplicativo autenticador.</p>
        <div className="mt-3"><Toggle defaultOn /></div>
      </div>
      <div className="rounded-xl border border-border p-4">
        <p className="font-medium">Sessões ativas</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex justify-between"><span>MacBook Pro — Cuiabá/MT</span><span className="text-xs">agora</span></li>
          <li className="flex justify-between"><span>iPhone 15 — Cuiabá/MT</span><span className="text-xs">há 2 h</span></li>
          <li className="flex justify-between"><span>Chrome Windows — Várzea Grande/MT</span><span className="text-xs">há 1 dia</span></li>
        </ul>
      </div>
    </div>
  );
}

function AparenciaTab() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Palette} title="Aparência" />
      <Field label="Tema">
        <div className="flex gap-2">
          {["Claro", "Escuro", "Sistema"].map((t, i) => (
            <button
              key={t}
              className={`rounded-xl border px-4 py-2 text-sm ${
                i === 2 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Densidade">
        <div className="flex gap-2">
          {["Confortável", "Compacta"].map((t, i) => (
            <button
              key={t}
              className={`rounded-xl border px-4 py-2 text-sm ${
                i === 0 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function FaturamentoTab() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={CreditCard} title="Plano atual" />
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary">Plano Ativo</p>
            <p className="mt-1 font-display text-xl font-semibold">Terra & Lar Pro</p>
            <p className="text-sm text-muted-foreground">10 licenças · 500 imóveis · IA ilimitada</p>
          </div>
          <p className="font-display text-2xl font-semibold">R$ 1.290<span className="text-sm text-muted-foreground">/mês</span></p>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Trocar plano
          </button>
          <button className="rounded-xl border border-border px-3 py-2 text-sm hover:border-primary/50">Ver faturas</button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Método de pagamento</p>
        <div className="flex items-center justify-between rounded-xl border border-border p-4 text-sm">
          <span>Cartão Visa •••• 4821 — vence 08/28</span>
          <button className="text-primary hover:underline">Alterar</button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof Settings; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-primary" />
      <h2 className="font-display text-lg font-semibold">{title}</h2>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}
