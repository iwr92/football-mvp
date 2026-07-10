import type { StatMetric } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  Goal,
  Target,
  Crosshair,
  Flag,
  Square,
  Hand,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

const icons = {
  goals: Goal,
  shots: Target,
  target: Crosshair,
  corners: Flag,
  cards: Square,
  keeper: Hand,
}

export function StatCard({ metric }: { metric: StatMetric }) {
  const Icon = icons[metric.icon]
  const total = metric.home + metric.away
  const homePct = total > 0 ? (metric.home / total) * 100 : 50
  const positive = metric.trend >= 0

  return (
    <div className="glass group rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary transition-transform group-hover:scale-110">
          <Icon className="size-[18px]" />
        </span>
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            positive ? "text-success" : "text-destructive",
          )}
        >
          {positive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {Math.abs(metric.trend)}%
        </span>
      </div>

      <p className="mt-3 text-xs font-medium text-muted-foreground">{metric.label}</p>

      <div className="mt-1 flex items-baseline justify-between">
        <span className="text-xl font-semibold tabular-nums">{metric.home}</span>
        <span className="text-xs text-muted-foreground">{metric.homeLabel}</span>
        <span className="text-xl font-semibold tabular-nums text-muted-foreground">
          {metric.away}
        </span>
      </div>

      <div className="mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="bg-primary transition-all" style={{ width: `${homePct}%` }} />
        <div className="bg-info/60 transition-all" style={{ width: `${100 - homePct}%` }} />
      </div>

      <p className="mt-2.5 text-[11px] text-muted-foreground">
        Projection: <span className="font-medium text-foreground">{metric.projection}</span>
      </p>
    </div>
  )
}
