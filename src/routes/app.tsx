import {
  Outlet,
  createFileRoute,
  Navigate,
  useNavigate,
  useRouterState,
  Link,
} from "@tanstack/react-router";
import { Bell, Loader2, Plus, Search } from "lucide-react";

import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useImobiliaria } from "@/hooks/use-imobiliaria";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, loading, configured, signOut } = useAuth();
  const { imob, loading: imobLoading } = useImobiliaria();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (configured && (loading || (user && imobLoading))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (configured && !user) {
    return <Navigate to="/auth/login" />;
  }
  if (
    configured &&
    user &&
    imob &&
    !imob.onboarding_completed &&
    !pathname.startsWith("/onboarding")
  ) {
    return <Navigate to="/onboarding" />;
  }

  const initials = (user?.user_metadata?.nome || user?.email || "?")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    localStorage.removeItem("admin_imob_override");
    navigate({ to: "/auth/login", replace: true });
  }

  const isMasquerading = !!localStorage.getItem("admin_imob_override");
  function exitMasquerade() {
    localStorage.removeItem("admin_imob_override");
    navigate({ to: "/admin/dashboard", replace: true });
  }

  return (
    <div className="theme-app min-h-screen bg-background text-foreground">
      {isMasquerading && (
        <div className="flex h-10 w-full items-center justify-between bg-destructive px-4 text-sm text-destructive-foreground shadow-md z-50 relative">
          <p className="font-semibold">Modo Super Admin: Visualizando painel da imobiliária</p>
          <Button
            variant="outline"
            size="sm"
            onClick={exitMasquerade}
            className="h-7 text-xs bg-transparent border-white text-white hover:bg-white/20"
          >
            Voltar pro Admin
          </Button>
        </div>
      )}
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar tipo={imob?.tipo ?? "urbana"} nomeImob={imob?.nome} />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur md:px-6">
              <SidebarTrigger />
              <div className="relative hidden max-w-md flex-1 md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar imóveis, clientes, contratos..."
                  className="h-9 bg-secondary/60 pl-9"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button asChild size="sm" className="hidden md:inline-flex">
                  <Link to="/app/crm">
                    <Plus className="mr-1.5 size-4" />
                    Novo lead
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sair
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-4" />
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
                </Button>
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </header>
            <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
