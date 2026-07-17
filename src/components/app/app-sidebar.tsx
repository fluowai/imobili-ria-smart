import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  MessageSquare,
  Mail,
  KanbanSquare,
  UsersRound,
  UserSquare2,
  Sprout,
  Map,
  Coins,
  Building2,
  KeyRound,
  Landmark,
  Building,
  Key,
  DollarSign,
  Calculator,
  FileSignature,
  FolderOpen,
  Target,
  Globe,
  Wand2,
  Settings2,
  Bot,
  LayoutPanelTop,
  HelpCircle,
  PieChart,
  Zap,
  Sparkles,
  Link2,
  Plug,
  Settings,
  ShieldAlert,
  LifeBuoy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  to: string;
  title: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    label: "Operação",
    items: [
      { to: "/app/dashboard",    title: "Dashboard",           icon: LayoutGrid },
      { to: "/app/mensagens",    title: "Mensagens",           icon: MessageSquare },
      { to: "/app/email",        title: "Email",               icon: Mail },
      { to: "/app/kanban",       title: "Kanban",              icon: KanbanSquare },
      { to: "/app/crm",          title: "CRM Leads",           icon: UsersRound },
      { to: "/app/clientes",     title: "Clientes Unificado",  icon: UserSquare2 },
    ],
  },
  {
    label: "Carteira Rural",
    items: [
      { to: "/app/rural/imoveis",    title: "Imóveis Rurais",  icon: Sprout },
      { to: "/app/rural/territorio", title: "Território Rural", icon: Map },
      { to: "/app/rural/valuation",  title: "Valuation CAR",   icon: Coins },
    ],
  },
  {
    label: "Carteira Urbana",
    items: [
      { to: "/app/urbano/imoveis",     title: "Imóveis Urbanos",  icon: Building2 },
      { to: "/app/urbano/locacao",     title: "Gestão de Locação", icon: KeyRound },
      { to: "/app/urbano/loteamentos", title: "Loteamentos",      icon: Landmark },
      { to: "/app/urbano/condominios", title: "Adm. Condomínios", icon: Building },
      { to: "/app/urbano/chaves",      title: "Controle de Chaves", icon: Key },
    ],
  },
  {
    label: "Gestão",
    items: [
      { to: "/app/financeiro",   title: "Financeiro & ERP",     icon: DollarSign },
      { to: "/app/simulador",    title: "Simulador Financeiro", icon: Calculator },
      { to: "/app/contratos",    title: "Contratos & Jurídico", icon: FileSignature },
      { to: "/app/documentos",   title: "Documentos (GED)",     icon: FolderOpen },
    ],
  },
  {
    label: "Crescimento",
    items: [
      { to: "/app/metas",         title: "Metas & Vendas",  icon: Target },
      { to: "/app/site",          title: "Meu Site",        icon: Globe },
      { to: "/app/editor",        title: "Editor Visual",   icon: Wand2 },
      { to: "/app/configurar-site", title: "Configurar Site", icon: Settings2 },
      { to: "/app/agentes-ia",    title: "Agentes IA",      icon: Bot },
      { to: "/app/landing-pages", title: "Landing Pages",   icon: LayoutPanelTop },
      { to: "/app/quiz",          title: "Quiz",            icon: HelpCircle },
      { to: "/app/relatorios",    title: "Relatórios Gerenciais", icon: PieChart },
      { to: "/app/matchmaking",   title: "Matchmaking IA",  icon: Zap },
      { to: "/app/criativos",     title: "Criativos IA",    icon: Sparkles },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/app/conexoes",      title: "Conexões",      icon: Link2 },
      { to: "/app/integracoes",   title: "Integrações",   icon: Plug },
      { to: "/app/configuracoes", title: "Configurações", icon: Settings },
      { to: "/admin/dashboard",   title: "Super Admin",   icon: ShieldAlert },
      { to: "/app/suporte",       title: "Suporte",       icon: LifeBuoy },
    ],
  },
];

export function AppSidebar({ tipo = "urbana", nomeImob }: { tipo?: "urbana" | "rural"; nomeImob?: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const visibleGroups = groups.filter((g) => {
    if (g.label === "Carteira Rural") return tipo === "rural";
    if (g.label === "Carteira Urbana") return tipo === "urbana";
    return true;
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold leading-tight text-sidebar-foreground">
                {nomeImob ?? "ImobiOS"}
              </p>
              <p className="truncate text-xs text-muted-foreground capitalize">
                Carteira {tipo}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active =
                    pathname === item.to || pathname.startsWith(item.to + "/");
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.to} className="flex items-center gap-2">
                          <item.icon className="size-4 shrink-0" />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
