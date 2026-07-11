import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Target,
  Crosshair,
  Flag,
  BadgeAlert,
} from "lucide-react"

import { getFixtureById } from "@/lib/fixtures"

type MatchPageProps = {
  params: Promise<{
    fixtureId: string
  }>
}

export default async function MatchPage({
  params,
}: MatchPageProps) {
  const { fixtureId } = await params
  const fixture = await getFixtureById(Number(fixtureId))

  const statistics = fixture.statistics

  return (
    <main className="bg-iridescent min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <section className="glass mt-6 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {fixture.country} · {fixture.league}
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {fixture.home} vs {fixture.away}
              </h1>

              {fixture.venue && (
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {fixture.venue}
                </p>
              )}
            </div>

            <span className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold">
              {fixture.status}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div>
              <p className="text-lg font-semibold">
                {fixture.home}
              </p>
              <p className="text-sm text-muted-foreground">
                Home
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 px-6 py-4">
              <span className="text-3xl font-bold">
                {fixture.score.home ?? "-"} -{" "}
                {fixture.score.away ?? "-"}
              </span>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold">
                {fixture.away}
              </p>
              <p className="text-sm text-muted-foreground">
                Away
              </p>
            </div>
          </div>
        </section>

        {statistics && (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat
              icon={<ShieldCheck className="size-5" />}
              label="Possession"
              home={`${statistics.possession.home}%`}
              away={`${statistics.possession.away}%`}
            />

            <Stat
              icon={<Target className="size-5" />}
              label="Shots"
              home={statistics.shots.home}
              away={statistics.shots.away}
            />

            <Stat
              icon={<Crosshair className="size-5" />}
              label="Shots on target"
              home={statistics.shots_on_target.home}
              away={statistics.shots_on_target.away}
            />

            <Stat
              icon={<Flag className="size-5" />}
              label="Corners"
              home={statistics.corners.home}
              away={statistics.corners.away}
            />

            <Stat
              icon={<BadgeAlert className="size-5" />}
              label="Cards"
              home={statistics.cards.home}
              away={statistics.cards.away}
            />
          </section>
        )}
      </div>
    </main>
  )
}

type StatProps = {
  icon: React.ReactNode
  label: string
  home: string | number
  away: string | number
}

function Stat({
  icon,
  label,
  home,
  away,
}: StatProps) {
  return (
    <article className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Home</p>
          <p className="mt-1 text-2xl font-semibold">{home}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Away</p>
          <p className="mt-1 text-2xl font-semibold">{away}</p>
        </div>
      </div>
    </article>
  )
}