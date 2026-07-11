"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { FeaturedMatch } from "@/components/featured-match"
import { StatCard } from "@/components/stat-card"
import { RecommendationCard } from "@/components/recommendation-card"
import { TeamComparison } from "@/components/team-comparison"
import { MarketProbabilityCard } from "@/components/market-probability-card"
import { TrendChart } from "@/components/trend-chart"
import { ResponsibleGambling } from "@/components/responsible-gambling"
import {
  statMetrics,
  marketProbabilities,
  liveTrends,
} from "@/lib/mock-data"
import {
  getTodayFixtures,
  type Fixture,
} from "@/lib/fixtures"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  CalendarDays,
  Loader2,
  MapPin,
  Radio,
  Sparkles,
} from "lucide-react"

import Link from "next/link"

const tabs = [
  "Overview",
  "Statistics",
  "Predictions",
  "Momentum",
  "Markets",
  "AI Insights",
]

const toneStyles = {
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
}

function LiveTrends() {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Radio className="size-4 text-primary" />
          Live Trends
        </h2>

        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-info">
          <span className="size-1.5 animate-pulse rounded-full bg-info" />
          Real-time
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {liveTrends.map((trend) => (
          <div
            key={trend.id}
            className="rounded-2xl border border-border bg-background/40 p-3.5 transition-colors hover:bg-background/70"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  toneStyles[trend.tone],
                )}
              >
                {trend.tag}
              </span>

              <span className="text-[11px] text-muted-foreground">
                {trend.time}
              </span>
            </div>

            <p className="mt-2 text-sm font-medium">{trend.title}</p>

            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {trend.detail}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full rounded-xl border border-border bg-background/50 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        View Full Terminal
      </button>
    </div>
  )
}

function RealMatchCard({ match }: { match: Fixture }) {
  const homeScore = match.score?.home
  const awayScore = match.score?.away

  const hasScore = homeScore !== null && awayScore !== null

  return (
    <article className="glass group rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <MapPin className="size-3.5" />
            {match.country}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {match.league}
          </p>
        </div>

        <span className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {match.status || "Scheduled"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{match.home}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Home
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background/60 px-3 py-2 text-center">
          {hasScore ? (
            <span className="text-base font-bold tracking-tight">
              {homeScore} - {awayScore}
            </span>
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">
              VS
            </span>
          )}
        </div>

        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-semibold">{match.away}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Away
          </p>
        </div>
      </div>

      {/* <button className="mt-5 w-full rounded-xl bg-primary/10 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
        Analyze match
      </button> */}
      <Link
        href={`/matches/${match.fixture_id}`}
        className="mt-5 block w-full rounded-xl bg-primary/10 py-2.5 text-center text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Analyze match
      </Link>
    </article>
  )
}

function MatchesLoading() {
  return (
    <div className="col-span-full flex min-h-40 items-center justify-center rounded-3xl border border-border bg-background/30">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading today&apos;s matches...
      </div>
    </div>
  )
}

function MatchesError({ message }: { message: string }) {
  return (
    <div className="col-span-full rounded-3xl border border-destructive/20 bg-destructive/5 p-5">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

        <div>
          <p className="text-sm font-semibold">
            Could not load today&apos;s matches
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptyMatches() {
  return (
    <div className="col-span-full rounded-3xl border border-border bg-background/30 p-8 text-center">
      <CalendarDays className="mx-auto size-8 text-muted-foreground" />

      <p className="mt-3 text-sm font-semibold">
        No matches available
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        There are no fixtures returned for this date.
      </p>
    </div>
  )
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("Overview")
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [fixturesDate, setFixturesDate] = useState<string>("")
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(true)
  const [fixturesError, setFixturesError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadFixtures() {
      try {
        setIsLoadingFixtures(true)
        setFixturesError(null)

        const response = await getTodayFixtures()

        if (!isMounted) {
          return
        }

        setFixtures(response.matches)
        setFixturesDate(response.date)
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unknown error while connecting to the API."

        setFixturesError(message)
      } finally {
        if (isMounted) {
          setIsLoadingFixtures(false)
        }
      }
    }

    loadFixtures()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="bg-iridescent min-h-dvh">
      <div className="flex">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
            {/* Hero */}
            <header>
              <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="size-3.5" />
                Intelligence Live
              </span>

              <h1 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Find the strongest{" "}
                <span className="italic text-primary">edge</span> before kickoff.
              </h1>

              <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
                The intelligence engine for elite football analysis. Deep-layer
                data models surface market inefficiencies in real time.
              </p>
            </header>

            {/* Featured match */}
            <FeaturedMatch />

            {/* Analysis tabs */}
            <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border bg-background/40 p-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                    activeTab === tab
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Recommendations */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <RecommendationCard
                highlighted
                label="Top Recommended Market"
                market="Over 2.5 Goals"
                metric="Value"
                metricValue="+12%"
                odds={1.88}
              />

              <RecommendationCard
                label="Alternative Edge"
                market="Both Teams to Score"
                metric="Confidence"
                metricValue="82%"
                odds={1.72}
              />

              <RecommendationCard
                label="Value Pick"
                market="Over 10.5 Corners"
                metric="Confidence"
                metricValue="74%"
                odds={1.95}
              />
            </section>

            {/* Comparison + Live trends */}
            <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <TeamComparison />
              <LiveTrends />
            </section>

            {/* Metrics */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  Match Metrics
                </h2>

                <span className="text-xs text-muted-foreground">
                  Projected · both teams
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {statMetrics.map((metric) => (
                  <StatCard key={metric.id} metric={metric} />
                ))}
              </div>
            </section>

            {/* Trend chart */}
            <TrendChart />

            {/* Market probabilities */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  Market Probabilities
                </h2>

                <span className="text-xs text-muted-foreground">
                  Approved · Neutral · Rejected
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {marketProbabilities.map((market) => (
                  <MarketProbabilityCard
                    key={market.id}
                    market={market}
                  />
                ))}
              </div>
            </section>

            {/* Today's real matches */}
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Today&apos;s Matches
                  </h2>

                  {fixturesDate && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Data from backend · {fixturesDate}
                    </p>
                  )}
                </div>

                <span className="text-xs font-semibold text-primary">
                  {fixtures.length} matches
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {isLoadingFixtures && <MatchesLoading />}

                {!isLoadingFixtures && fixturesError && (
                  <MatchesError message={fixturesError} />
                )}

                {!isLoadingFixtures &&
                  !fixturesError &&
                  fixtures.length === 0 && <EmptyMatches />}

                {!isLoadingFixtures &&
                  !fixturesError &&
                  fixtures.map((match) => (
                    <RealMatchCard
                      key={match.fixture_id}
                      match={match}
                    />
                  ))}
              </div>
            </section>

            {/* Responsible gambling */}
            <ResponsibleGambling />
          </main>
        </div>
      </div>
    </div>
  )
}