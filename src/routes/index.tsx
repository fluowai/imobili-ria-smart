import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Sprout,
  ShieldAlert,
  Sparkles,
  BarChart3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-4" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">ImobiOS</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth/login">Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            ERP completo · Urbano + Rural + IA
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
            O sistema operacional das{" "}
            <span className="text-primary">imobiliárias modernas</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            CRM, financeiro, contratos, sites, agentes de IA e carteira dupla —
            urbana e rural — em uma única plataforma pensada para escala.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/admin/dashboard">
                Acessar Super Admin
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app/dashboard">Acessar painel da imobiliária</Link>
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-primary/10 blur-3xl" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Três camadas, uma plataforma
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Feito para operar tanto o back-office da plataforma quanto o dia a dia da imobiliária.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card
            eyebrow="Plataforma"
            title="Super Admin"
            desc="Gestão da rede de imobiliárias clientes: MRR, planos, feature flags, auditoria e observabilidade."
            icon={ShieldAlert}
            to="/admin/dashboard"
            cta="Abrir Super Admin"
          />
          <Card
            eyebrow="Carteira Urbana"
            title="Imobiliária Urbana"
            desc="Imóveis, locação, condomínios, loteamentos, chaves e financeiro — tudo no mesmo painel."
            icon={Building2}
            to="/app/urbano/imoveis"
            cta="Ver imóveis urbanos"
          />
          <Card
            eyebrow="Carteira Rural"
            title="Imobiliária Rural"
            desc="Fichas com CAR, valuation por IA, território rural com mapas e georreferenciamento."
            icon={Sprout}
            to="/app/rural/imoveis"
            cta="Ver carteira rural"
          />
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Feature icon={BarChart3} title="Analytics em tempo real" text="MRR, adoção por módulo, retenção e engajamento." />
          <Feature icon={Users} title="CRM 360" text="Leads, clientes unificados, kanban e automações." />
          <Feature icon={Sparkles} title="Agentes de IA" text="Valuation, atendimento e geração de conteúdo." />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-muted-foreground md:px-8">
          <span>© {new Date().getFullYear()} ImobiOS</span>
          <span>Fase 1+2 · Fundação + Super Admin</span>
        </div>
      </footer>
    </div>
  );
}

function Card({
  eyebrow,
  title,
  desc,
  icon: Icon,
  to,
  cta,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  icon: typeof Building2;
  to: string;
  cta: string;
}) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
      <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>
      <Link
        to={to}
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5"
      >
        {cta} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Building2;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6">
      <Icon className="size-5 text-primary" />
      <p className="mt-3 font-display text-base font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
