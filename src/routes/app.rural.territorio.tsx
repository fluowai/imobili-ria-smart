import { createFileRoute } from "@tanstack/react-router";
import { Map as MapIcon, Layers, AlertTriangle, Trees, Droplet, Sprout } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { imoveisRurais, coberturaSolo, passivosAmbientais, fmtHa } from "@/mocks/rural";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/rural/territorio")({
  head: () => ({
    meta: [
      { title: "Território Rural — ImobiOS" },
      { name: "description", content: "Visão territorial da carteira: cobertura de solo, camadas ambientais e passivos." },
    ],
  }),
  component: TerritorioPage,
});

const severidadeMap = {
  alta:  "bg-red-500/15 text-red-700 dark:text-red-300",
  media: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  baixa: "bg-muted text-muted-foreground",
} as const;

// Coordenadas mockadas para pontos no "mapa" (0-100 %)
const pontos = [
  { x: 22, y: 34, id: "IMR-2201" },
  { x: 48, y: 20, id: "IMR-2202" },
  { x: 62, y: 55, id: "IMR-2203" },
  { x: 30, y: 68, id: "IMR-2204" },
  { x: 72, y: 40, id: "IMR-2205" },
  { x: 55, y: 78, id: "IMR-2206" },
  { x: 18, y: 52, id: "IMR-2207" },
  { x: 82, y: 62, id: "IMR-2208" },
];

function TerritorioPage() {
  const totalHa = coberturaSolo.reduce((a, c) => a + c.ha, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Carteira Rural"
        title="Território Rural"
        description="Visão territorial consolidada: cobertura de solo, camadas ambientais e passivos por imóvel."
        actions={
          <>
            <Button variant="outline" size="sm"><Layers className="mr-2 h-4 w-4" />Camadas</Button>
            <Button size="sm"><MapIcon className="mr-2 h-4 w-4" />Abrir mapa cheio</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-medium">Mapa da carteira · MT</h2>
              <div className="flex gap-1 text-[10px]">
                {coberturaSolo.map((c) => (
                  <span key={c.classe} className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: c.cor }} />
                    {c.classe}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="relative aspect-[16/10]"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 40%, hsl(140 50% 78%) 0%, transparent 45%), radial-gradient(ellipse at 65% 60%, hsl(35 70% 82%) 0%, transparent 45%), radial-gradient(circle at 50% 30%, hsl(200 60% 82%) 0%, transparent 30%), hsl(60 30% 92%)",
              }}
            >
              {/* Malha de fundo */}
              <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              {pontos.map((p, idx) => {
                const imv = imoveisRurais.find((i) => i.codigo === p.id);
                if (!imv) return null;
                const size = Math.max(14, Math.min(48, Math.sqrt(imv.areaHa) / 2));
                return (
                  <button
                    key={p.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg transition hover:scale-110"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: size,
                      height: size,
                      background: idx % 2 ? "hsl(140 55% 40% / 0.85)" : "hsl(35 85% 55% / 0.85)",
                    }}
                    title={`${imv.codigo} · ${imv.nome} · ${fmtHa(imv.areaHa)}`}
                  />
                );
              })}
              <div className="absolute bottom-3 left-3 rounded-md bg-background/80 px-2 py-1 text-[10px] font-medium backdrop-blur">
                Escala aproximada · {pontos.length} imóveis
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-medium">Cobertura de solo · carteira</h2>
            <p className="text-sm text-muted-foreground">{fmtHa(totalHa)} distribuídos entre as classes abaixo.</p>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full">
              {coberturaSolo.map((c) => (
                <div key={c.classe} style={{ width: `${(c.ha / totalHa) * 100}%`, background: c.cor }} title={c.classe} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {coberturaSolo.map((c) => (
                <div key={c.classe} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.cor }} />
                    <span className="text-xs font-medium">{c.classe}</span>
                  </div>
                  <p className="mt-1 font-display text-lg font-semibold">{fmtHa(c.ha)}</p>
                  <p className="text-[11px] text-muted-foreground">{((c.ha / totalHa) * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h2 className="font-medium">Passivos ambientais</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {passivosAmbientais.map((p) => (
                <li key={p.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-mono text-muted-foreground">{p.imovel}</p>
                      <p className="text-sm font-medium">{p.tipo}</p>
                    </div>
                    <Badge className={cn("border-none text-[10px]", severidadeMap[p.severidade])}>{p.severidade}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{p.areaHa > 0 ? fmtHa(p.areaHa) : "—"}</span>
                    <span>Prazo: {p.prazo}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-medium">Camadas disponíveis</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { icon: Trees,   label: "Reserva legal averbada", ativa: true },
                { icon: Droplet, label: "APP · hidrografia",       ativa: true },
                { icon: Sprout,  label: "Vegetação nativa",        ativa: true },
                { icon: Layers,  label: "Zoneamento ecológico",    ativa: false },
                { icon: MapIcon, label: "Uso e ocupação (SICAR)",  ativa: false },
              ].map(({ icon: Icon, label, ativa }) => (
                <li key={label} className="flex items-center justify-between rounded-lg border border-border p-2">
                  <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" />{label}</span>
                  <span className={cn("text-[11px] font-medium", ativa ? "text-primary" : "text-muted-foreground")}>
                    {ativa ? "Ativa" : "Ocultar"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
