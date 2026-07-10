import type { MarketProbability } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { CheckCircle2, MinusCircle, XCircle } from "lucide-react"

const config = {
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    chip: "bg-success/15 text-success",
    ring: "text-success",
    bar: "bg-success",
  },
  neutral: {
    icon: MinusCircle,
    label: "Neutral",
    chip: "bg-warning/20 text-warning-foreground",
    ring: "text-warning-foreground",
    bar: "bg-warning",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    chip: "bg-destructive/12 text-destructive",
    ring: "text-destructive",
    bar: "bg-destructive/70",
  },
}

export function MarketProbabilityCard({ market }: { market: MarketProbability }) {
  const c = config[market.status]
  const Icon = c.icon
  return (
    <div
      className={cn(
        "glass rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg",
        market.status === "rejected" && "opacity-90",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {market.market}
        </span>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            c.chip,
          )}
        >
          <Icon className="size-3" />
          {c.label}
        </span>
      </div>

      <p className="mt-2 text-base font-semibold">{market.selection}</p>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Model probability</span>
        <span className="font-semibold tabular-nums">{market.probability}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", c.bar)} style={{ width: `${market.probability}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="text-muted-foreground">
          Odds <span className="font-semibold text-foreground tabular-nums">{market.odds.toFixed(2)}</span>
        </span>
        <span
          className={cn(
            "font-semibold tabular-nums",
            market.value > 0
              ? "text-success"
              : market.value < 0
                ? "text-destructive"
                : "text-muted-foreground",
          )}
        >
          {market.value > 0 ? "+" : ""}
          {market.value}% value
        </span>
      </div>

      <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">{market.note}</p>
    </div>
  )
}
