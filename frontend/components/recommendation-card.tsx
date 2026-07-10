import { cn } from "@/lib/utils"
import { Sparkles, ShieldCheck } from "lucide-react"

interface RecommendationCardProps {
  label: string
  market: string
  metric: string
  metricValue: string
  odds: number
  highlighted?: boolean
}

export function RecommendationCard({
  label,
  market,
  metric,
  metricValue,
  odds,
  highlighted,
}: RecommendationCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5",
        highlighted
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "glass hover:shadow-lg",
      )}
    >
      <div className="flex items-center gap-2">
        {highlighted ? (
          <Sparkles className="size-4" />
        ) : (
          <ShieldCheck className="size-4 text-info" />
        )}
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-wider",
            highlighted ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>

      <p className="mt-3 text-xl font-semibold tracking-tight">{market}</p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p
            className={cn(
              "text-[11px] font-medium",
              highlighted ? "text-primary-foreground/70" : "text-muted-foreground",
            )}
          >
            {metric}
          </p>
          <p className="text-lg font-bold tabular-nums">{metricValue}</p>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "text-[11px] font-medium",
              highlighted ? "text-primary-foreground/70" : "text-muted-foreground",
            )}
          >
            Odds
          </p>
          <p className="text-lg font-bold tabular-nums">{odds.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
