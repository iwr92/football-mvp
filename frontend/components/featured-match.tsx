import { featuredMatch, featuredForm } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Clock, MapPin, TrendingUp, CheckCircle2 } from "lucide-react"

function FormBadge({ result }: { result: "W" | "D" | "L" }) {
  const styles = {
    W: "bg-success/15 text-success",
    D: "bg-warning/20 text-warning-foreground",
    L: "bg-destructive/12 text-destructive",
  }
  return (
    <span
      className={cn(
        "flex size-6 items-center justify-center rounded-md text-xs font-semibold",
        styles[result],
      )}
    >
      {result}
    </span>
  )
}

export function FeaturedMatch() {
  const m = featuredMatch
  return (
    <section className="glass-strong overflow-hidden rounded-3xl">
      {/* Header */}
      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              {m.league}
            </span>
            <span className="text-xs font-medium text-muted-foreground">{m.round}</span>
          </div>

          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {m.home.name} <span className="text-muted-foreground">vs</span> {m.away.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> Kickoff {m.kickoff}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {m.venue}
            </span>
          </div>
        </div>

        {/* Edge score */}
        <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:text-right">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Edge Score
            </p>
            <p className="text-5xl font-bold tracking-tight text-primary tabular-nums sm:text-6xl">
              {m.edgeScore}
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
            <TrendingUp className="size-3.5" /> High Confidence
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-px bg-border lg:grid-cols-[1.6fr_1fr]">
        {/* Intelligence summary */}
        <div className="bg-card/60 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="size-4 text-primary" />
            Intelligence Summary
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The EdgeMatch model projects a high-scoring encounter based on the current offensive
            efficiency of both squads. {m.away.name}&apos;s build-up play exploits transitional
            weaknesses found in high-pressing systems like {m.home.name}&apos;s. Our goal
            expectancy model suggests a deviation of{" "}
            <span className="font-medium text-foreground">+0.8 goals</span> above the market median.
          </p>

          <ul className="mt-4 space-y-2.5">
            <li className="flex gap-2.5 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Over 2.5 Goals:</span> 74% probability
                based on historical matchups and current form xG.
              </span>
            </li>
            <li className="flex gap-2.5 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Corners High:</span>{" "}
                {m.home.name}&apos;s wing rotation creates 6.8 corners per home game.
              </span>
            </li>
          </ul>
        </div>

        {/* Recent form */}
        <div className="bg-card/60 p-6">
          <h2 className="text-sm font-semibold">Recent Form</h2>
          <div className="mt-4 space-y-4">
            {featuredForm.map((row) => (
              <div key={row.team.name} className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{row.team.name}</span>
                <div className="flex gap-1.5">
                  {row.form.map((r, i) => (
                    <FormBadge key={i} result={r} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground">Pitch Condition</p>
            <p className="mt-1 text-sm leading-relaxed">
              Dry surface expected. Optimal for high-speed passing models and increased shot volume.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
