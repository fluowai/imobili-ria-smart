import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="theme-admin dark min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur md:px-6">
              <SidebarTrigger />
              <div className="relative hidden max-w-md flex-1 md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar imobiliárias, faturas, tickets..."
                  className="h-9 bg-secondary/60 pl-9"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/">Sair do admin</Link>
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-4" />
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
                </Button>
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
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
