import { featuredMatch } from "@/lib/mock-data"

interface Row {
  label: string
  home: number
  away: number
  suffix?: string
}

const rows: Row[] = [
  { label: "Win probability", home: 46, away: 38, suffix: "%" },
  { label: "Possession", home: 58, away: 54, suffix: "%" },
  { label: "Goals per game", home: 2.3, away: 2.0 },
  { label: "Clean sheets", home: 6, away: 5 },
  { label: "Big chances created", home: 41, away: 37 },
  { label: "Press intensity", home: 82, away: 74 },
]

function Bar({ value, max, align }: { value: number; max: number; align: "left" | "right" }) {
  const pct = (value / max) * 100
  return (
    <div className={`flex h-2 flex-1 overflow-hidden rounded-full bg-muted ${align === "right" ? "justify-start" : "justify-end"}`}>
      <div
        className={align === "left" ? "rounded-full bg-primary" : "rounded-full bg-info"}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function TeamComparison() {
  const { home, away } = featuredMatch
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Head to Head</h2>
        <span className="text-[11px] font-medium text-muted-foreground">Season average</span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-semibold">
        <span className="flex items-center gap-2">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: home.color }}
          />
          {home.name}
        </span>
        <span className="flex items-center gap-2">
          {away.name}
          <span className="size-2.5 rounded-full bg-info" />
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {rows.map((row) => {
          const max = Math.max(row.home, row.away)
          return (
            <div key={row.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-semibold tabular-nums">
                  {row.home}
                  {row.suffix}
                </span>
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold tabular-nums text-muted-foreground">
                  {row.away}
                  {row.suffix}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bar value={row.home} max={max} align="right" />
                <Bar value={row.away} max={max} align="left" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
