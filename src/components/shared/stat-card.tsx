import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  hint?: string;
}

export function StatCard({
  label,
  value,
  delta,
  trend = "neutral",
  icon: Icon,
  hint,
}: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-[color:var(--color-success)]"
      : trend === "down"
        ? "text-[color:var(--color-destructive)]"
        : "text-muted-foreground";
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
        </div>
        {Icon ? (
          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
        ) : null}
      </div>
      {(delta || hint) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta ? (
            <span className={cn("inline-flex items-center gap-1 font-medium", trendColor)}>
              <TrendIcon className="size-3.5" />
              {delta}
            </span>
          ) : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      )}
    </div>
  );
}
