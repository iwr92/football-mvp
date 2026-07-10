import type { Match } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

function TeamCrest({ short, color }: { short: string; color: string }) {
  return (
    <span
      className="flex size-8 items-center justify-center rounded-lg text-[11px] font-bold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {short}
    </span>
  )
}

function StatusPill({ match }: { match: Match }) {
  if (match.status === "live") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-destructive/12 px-2.5 py-1 text-[11px] font-semibold text-destructive">
        <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
        {match.minute}&apos;
      </span>
    )
  }
  if (match.status === "finished") {
    return (
      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
        FT
      </span>
    )
  }
  return (
    <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
      {match.kickoff}
    </span>
  )
}

export function MatchCard({ match }: { match: Match }) {
  return (
    <button className="glass group w-full rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {match.leagueShort} · {match.round}
        </span>
        <StatusPill match={match} />
      </div>

      <div className="mt-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <TeamCrest short={match.home.short} color={match.home.color} />
            <span className="text-sm font-medium">{match.home.name}</span>
          </span>
          {match.score && (
            <span className="text-sm font-semibold tabular-nums">{match.score.home}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <TeamCrest short={match.away.short} color={match.away.color} />
            <span className="text-sm font-medium">{match.away.name}</span>
          </span>
          {match.score && (
            <span className="text-sm font-semibold tabular-nums">{match.score.away}</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div>
          <p className="text-[11px] text-muted-foreground">{match.topMarket}</p>
          <p className="text-sm font-semibold tabular-nums">@ {match.topMarketOdds.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Edge</p>
            <p
              className={cn(
                "text-sm font-bold tabular-nums",
                match.edgeScore >= 80
                  ? "text-success"
                  : match.edgeScore >= 70
                    ? "text-primary"
                    : "text-muted-foreground",
              )}
            >
              {match.edgeScore}
            </p>
          </div>
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </button>
  )
}
