import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  BarChart3,
  Activity,
  Building2,
  LifeBuoy,
  Users,
  CreditCard,
  DollarSign,
  ToggleLeft,
  ScrollText,
  LayoutTemplate,
  Globe,
  CalendarDays,
  Sparkles,
  CloudUpload,
  Database,
  Megaphone,
  Settings,
  ShieldAlert,
} from "lucide-react";

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

const groups = [
  {
    label: "Visão geral",
    items: [
      { to: "/admin/dashboard", title: "Dashboard", icon: LayoutGrid },
      { to: "/admin/analytics", title: "Analytics", icon: BarChart3 },
      { to: "/admin/monitoring", title: "Monitoring", icon: Activity },
    ],
  },
  {
    label: "Clientes",
    items: [
      { to: "/admin/imobiliarias", title: "Imobiliárias", icon: Building2 },
      { to: "/admin/suporte", title: "Suporte", icon: LifeBuoy },
      { to: "/admin/equipe", title: "Equipe", icon: Users },
    ],
  },
  {
    label: "Comercial",
    items: [
      { to: "/admin/planos", title: "Planos", icon: CreditCard },
      { to: "/admin/billing", title: "Billing", icon: DollarSign },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { to: "/admin/feature-flags", title: "Feature Flags", icon: ToggleLeft },
      { to: "/admin/audit-log", title: "Audit Log", icon: ScrollText },
      { to: "/admin/templates", title: "Templates", icon: LayoutTemplate },
      { to: "/admin/dominios", title: "Domínios", icon: Globe },
      { to: "/admin/consultoria", title: "Consultoria", icon: CalendarDays },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { to: "/admin/importador-ia", title: "Importador IA", icon: Sparkles },
      { to: "/admin/migracao", title: "Migração FluowAI", icon: CloudUpload },
      { to: "/admin/storage", title: "Storage Intelligence", icon: Database },
      { to: "/admin/marketing", title: "Marketing & SEO", icon: Megaphone },
    ],
  },
  {
    label: "Sistema",
    items: [{ to: "/admin/configuracoes", title: "Configurações", icon: Settings }],
  },
] as const;

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
            <ShieldAlert className="size-5" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold leading-tight text-sidebar-foreground">
                Super Admin
              </p>
              <p className="truncate text-xs text-muted-foreground">ImobiOS Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(item.to + "/");
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.to} className="flex items-center gap-2">
                          <item.icon className="size-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
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
