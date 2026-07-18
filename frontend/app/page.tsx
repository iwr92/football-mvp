"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { ResponsibleGambling } from "@/components/responsible-gambling"
import {
  getTodayFixtures,
  type Fixture,
} from "@/lib/fixtures"
import { cn } from "@/lib/utils"

const INITIAL_VISIBLE_MATCHES = 12
const LOAD_MORE_AMOUNT = 12

const LIVE_STATUSES = [
  "1H",
  "HT",
  "2H",
  "ET",
  "P",
  "LIVE",
]

const FINISHED_STATUSES = ["FT", "AET", "PEN"]

const UPCOMING_STATUSES = ["NS", "TBD"]

type StatusFilter =
  | "all"
  | "live"
  | "upcoming"
  | "finished"

type SortOption =
  | "recommended"
  | "time-asc"
  | "time-desc"
  | "league"

const statusFilters: Array<{
  value: StatusFilter
  label: string
}> = [
  { value: "all", label: "Todos" },
  { value: "live", label: "En vivo" },
  { value: "upcoming", label: "Próximos" },
  { value: "finished", label: "Finalizados" },
]

export default function Page() {
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [fixturesDate, setFixturesDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [sortBy, setSortBy] =
    useState<SortOption>("recommended")
  const [visibleCount, setVisibleCount] = useState(
    INITIAL_VISIBLE_MATCHES,
  )

  useEffect(() => {
    let active = true

    async function loadFixtures() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await getTodayFixtures()

        if (!active) {
          return
        }

        setFixtures(response.matches)
        setFixturesDate(response.date)
      } catch (requestError) {
        if (!active) {
          return
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudieron cargar los partidos.",
        )
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadFixtures()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_MATCHES)
  }, [searchQuery, statusFilter, countryFilter, sortBy])

  const countries = useMemo(() => {
    return Array.from(
      new Set(
        fixtures
          .map((fixture) => fixture.country)
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b))
  }, [fixtures])

  const statusCounts = useMemo(() => {
    return {
      all: fixtures.length,
      live: fixtures.filter((fixture) =>
        isLiveStatus(fixture.status),
      ).length,
      upcoming: fixtures.filter((fixture) =>
        isUpcomingStatus(fixture.status),
      ).length,
      finished: fixtures.filter((fixture) =>
        isFinishedStatus(fixture.status),
      ).length,
    }
  }, [fixtures])

  const featuredMatch = useMemo(() => {
    return selectFeaturedMatch(fixtures)
  }, [fixtures])

  const filteredFixtures = useMemo(() => {
    const normalizedSearch = normalizeText(searchQuery)

    const filtered = fixtures.filter((fixture) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          fixture.home,
          fixture.away,
          fixture.league,
          fixture.country,
          fixture.venue ?? "",
        ].some((value) =>
          normalizeText(value).includes(normalizedSearch),
        )

      const matchesCountry =
        countryFilter === "all" ||
        fixture.country === countryFilter

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "live" &&
          isLiveStatus(fixture.status)) ||
        (statusFilter === "upcoming" &&
          isUpcomingStatus(fixture.status)) ||
        (statusFilter === "finished" &&
          isFinishedStatus(fixture.status))

      return (
        matchesSearch &&
        matchesCountry &&
        matchesStatus
      )
    })

    return sortFixtures(filtered, sortBy)
  }, [
    fixtures,
    searchQuery,
    countryFilter,
    statusFilter,
    sortBy,
  ])

  const displayedFixtures = useMemo(() => {
    return filteredFixtures.slice(0, visibleCount)
  }, [filteredFixtures, visibleCount])

  const hasMore =
    visibleCount < filteredFixtures.length

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    countryFilter !== "all" ||
    sortBy !== "recommended"

  function resetFilters() {
    setSearchQuery("")
    setStatusFilter("all")
    setCountryFilter("all")
    setSortBy("recommended")
    setVisibleCount(INITIAL_VISIBLE_MATCHES)
  }

  return (
    <div className="min-h-dvh bg-iridescent">
      <div className="flex">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
            <Hero
              fixturesDate={fixturesDate}
              total={fixtures.length}
              liveTotal={statusCounts.live}
              upcomingTotal={statusCounts.upcoming}
            />

            {isLoading && <HomeLoading />}

            {!isLoading && error && (
              <HomeError message={error} />
            )}

            {!isLoading &&
              !error &&
              fixtures.length === 0 && <EmptyHome />}

            {!isLoading &&
              !error &&
              fixtures.length > 0 && (
                <>
                  {featuredMatch && (
                    <FeaturedRealMatch
                      match={featuredMatch}
                    />
                  )}

                  <section>
                    <SectionHeader
                      title="Partidos de hoy"
                      description="Buscá, filtrá y abrí la ficha de cualquier encuentro."
                      filteredTotal={
                        filteredFixtures.length
                      }
                      total={fixtures.length}
                    />

                    <FixtureControls
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      statusFilter={statusFilter}
                      onStatusChange={setStatusFilter}
                      statusCounts={statusCounts}
                      countryFilter={countryFilter}
                      onCountryChange={setCountryFilter}
                      countries={countries}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      hasActiveFilters={hasActiveFilters}
                      onReset={resetFilters}
                    />

                    {filteredFixtures.length > 0 ? (
                      <>
                        <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                          {displayedFixtures.map(
                            (match) => (
                              <RealMatchCard
                                key={match.fixture_id}
                                match={match}
                              />
                            ),
                          )}
                        </div>

                        <div className="mt-6 flex flex-col items-center gap-3">
                          {hasMore && (
                            <button
                              type="button"
                              onClick={() =>
                                setVisibleCount(
                                  (current) =>
                                    current +
                                    LOAD_MORE_AMOUNT,
                                )
                              }
                              className="inline-flex items-center justify-center rounded-xl border border-border bg-card/70 px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:shadow-md"
                            >
                              Cargar 12 partidos más
                            </button>
                          )}

                          <p className="text-xs text-muted-foreground">
                            Mostrando{" "}
                            {displayedFixtures.length} de{" "}
                            {filteredFixtures.length} partidos
                          </p>
                        </div>
                      </>
                    ) : (
                      <NoFilterResults
                        onReset={resetFilters}
                      />
                    )}
                  </section>

                  <UpcomingFeatures />
                </>
              )}

            <ResponsibleGambling />
          </main>
        </div>
      </div>
    </div>
  )
}

function Hero({
  fixturesDate,
  total,
  liveTotal,
  upcomingTotal,
}: {
  fixturesDate: string
  total: number
  liveTotal: number
  upcomingTotal: number
}) {
  return (
    <header>
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="size-3.5" />
        Football Intelligence
      </span>

      <h1 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Encontrá el partido y descubrí dónde están las{" "}
        <span className="italic text-primary">
          mejores señales
        </span>
        .
      </h1>

      <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
        Partidos reales, estadísticas verificables y análisis
        explicado. Sin depender de cuotas de casas de apuestas.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <SummaryPill
          icon={
            <CalendarDays className="size-4 text-primary" />
          }
          text={
            fixturesDate
              ? formatBackendDate(fixturesDate)
              : "Fecha actual"
          }
        />

        <SummaryPill
          icon={
            <Trophy className="size-4 text-primary" />
          }
          text={`${total} ${
            total === 1 ? "partido" : "partidos"
          }`}
        />

        {liveTotal > 0 && (
          <SummaryPill
            icon={
              <span className="size-2 animate-pulse rounded-full bg-destructive" />
            }
            text={`${liveTotal} en vivo`}
            emphasized
          />
        )}

        {upcomingTotal > 0 && (
          <SummaryPill
            icon={
              <Clock3 className="size-4 text-primary" />
            }
            text={`${upcomingTotal} próximos`}
          />
        )}
      </div>
    </header>
  )
}

function SummaryPill({
  icon,
  text,
  emphasized = false,
}: {
  icon: React.ReactNode
  text: string
  emphasized?: boolean
}) {
  return (
    <div
      className={cn(
        "glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs",
        emphasized
          ? "text-destructive"
          : "text-muted-foreground",
      )}
    >
      {icon}
      {text}
    </div>
  )
}

function FeaturedRealMatch({
  match,
}: {
  match: Fixture
}) {
  const homeScore = match.score.home
  const awayScore = match.score.away

  const hasScore =
    homeScore !== null && awayScore !== null

  return (
    <section className="glass-strong overflow-hidden rounded-[28px]">
      <div className="flex flex-col gap-4 border-b border-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            {isLiveStatus(match.status)
              ? "Ahora en vivo"
              : "Partido destacado"}
          </span>

          <p className="mt-3 text-sm font-semibold text-foreground">
            {match.league}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {match.country}
          </p>
        </div>

        <StatusBadge status={match.status} />
      </div>

      <div className="px-5 py-8 md:px-10 md:py-10">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 md:gap-10">
          <FeaturedTeam
            name={match.home}
            side="Local"
          />

          <div className="rounded-2xl bg-foreground px-4 py-4 text-center text-background shadow-lg sm:px-5 md:min-w-40">
            {hasScore ? (
              <p className="whitespace-nowrap text-3xl font-bold md:text-5xl">
                {homeScore}
                <span className="mx-2 text-background/35">
                  :
                </span>
                {awayScore}
              </p>
            ) : (
              <p className="text-2xl font-semibold md:text-3xl">
                VS
              </p>
            )}

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-background/60">
              {getStatusLabel(match.status)}
            </p>
          </div>

          <FeaturedTeam
            name={match.away}
            side="Visitante"
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {match.date && (
              <span className="flex items-center gap-2">
                <Clock3 className="size-4 text-primary" />
                {formatFixtureDate(match.date)}
              </span>
            )}

            {match.venue && (
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                {match.venue}
              </span>
            )}
          </div>

          <Link
            href={`/matches/${match.fixture_id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Ver partido
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function FeaturedTeam({
  name,
  side,
}: {
  name: string
  side: string
}) {
  return (
    <div className="min-w-0 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary md:size-24 md:text-3xl">
        {getInitials(name)}
      </div>

      <h2 className="mt-4 line-clamp-2 text-base font-semibold text-foreground md:text-2xl">
        {name}
      </h2>

      <p className="mt-1 text-xs text-muted-foreground">
        {side}
      </p>
    </div>
  )
}

function FixtureControls({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusCounts,
  countryFilter,
  onCountryChange,
  countries,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onReset,
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  statusCounts: Record<StatusFilter, number>
  countryFilter: string
  onCountryChange: (value: string) => void
  countries: string[]
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  hasActiveFilters: boolean
  onReset: () => void
}) {
  return (
    <div className="glass sticky top-3 z-20 rounded-3xl p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() =>
              onStatusChange(filter.value)
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
              statusFilter === filter.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background/50 text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {filter.label}

            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px]",
                statusFilter === filter.value
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {statusCounts[filter.value]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Buscar equipo, liga, país o estadio..."
            className="h-11 w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <SelectControl
          value={countryFilter}
          onChange={onCountryChange}
          ariaLabel="Filtrar por país"
        >
          <option value="all">Todos los países</option>

          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </SelectControl>

        <SelectControl
          value={sortBy}
          onChange={(value) =>
            onSortChange(value as SortOption)
          }
          ariaLabel="Ordenar partidos"
        >
          <option value="recommended">
            Orden recomendado
          </option>
          <option value="time-asc">
            Hora: más temprano
          </option>
          <option value="time-desc">
            Hora: más tarde
          </option>
          <option value="league">
            Liga: A–Z
          </option>
        </SelectControl>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-4 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="size-3.5" />
          Limpiar
        </button>
      </div>
    </div>
  )
}

function SelectControl({
  value,
  onChange,
  children,
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <label className="relative block">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        aria-label={ariaLabel}
        className="h-11 w-full appearance-none rounded-xl border border-border bg-background/60 px-3.5 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
      >
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  )
}

function RealMatchCard({
  match,
}: {
  match: Fixture
}) {
  const homeScore = match.score.home
  const awayScore = match.score.away

  const hasScore =
    homeScore !== null && awayScore !== null

  return (
    <article className="glass group flex min-h-64 flex-col rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-primary">
            {match.country}
          </p>

          <p
            className="mt-1 truncate text-xs text-muted-foreground"
            title={match.league}
          >
            {match.league}
          </p>
        </div>

        <StatusBadge status={match.status} />
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
        <TeamCardName
          name={match.home}
          side="Local"
        />

        <div className="rounded-2xl border border-border bg-background/70 px-3 py-2.5 text-center shadow-sm">
          {hasScore ? (
            <span className="whitespace-nowrap text-base font-bold tracking-tight">
              {homeScore} - {awayScore}
            </span>
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">
              VS
            </span>
          )}
        </div>

        <TeamCardName
          name={match.away}
          side="Visitante"
          align="right"
        />
      </div>

      <div className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        {match.date && (
          <div className="flex items-center gap-2">
            <Clock3 className="size-3.5 shrink-0 text-primary" />
            <span>{formatFixtureDate(match.date)}</span>
          </div>
        )}

        {match.venue && (
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <span
              className="truncate"
              title={match.venue}
            >
              {match.venue}
            </span>
          </div>
        )}
      </div>

      <Link
        href={`/matches/${match.fixture_id}`}
        className="mt-auto pt-5"
      >
        <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground">
          Abrir análisis
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </article>
  )
}

function TeamCardName({
  name,
  side,
  align = "left",
}: {
  name: string
  side: string
  align?: "left" | "right"
}) {
  return (
    <div
      className={cn(
        "min-w-0",
        align === "right" && "text-right",
      )}
    >
      <p
        className="line-clamp-2 min-h-10 text-sm font-semibold leading-5"
        title={name}
      >
        {name}
      </p>

      <p className="mt-1 text-[11px] text-muted-foreground">
        {side}
      </p>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  if (isLiveStatus(status)) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">
        <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
        En vivo
      </span>
    )
  }

  if (isFinishedStatus(status)) {
    return (
      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
        Finalizado
      </span>
    )
  }

  if (isUpcomingStatus(status)) {
    return (
      <span className="shrink-0 rounded-full bg-info/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-info">
        Programado
      </span>
    )
  }

  return (
    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
      {getStatusLabel(status)}
    </span>
  )
}

function SectionHeader({
  title,
  description,
  filteredTotal,
  total,
}: {
  title: string
  description: string
  filteredTotal: number
  total: number
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <span className="text-xs font-semibold text-primary">
        {filteredTotal === total
          ? `${total} ${
              total === 1 ? "partido" : "partidos"
            }`
          : `${filteredTotal} de ${total} partidos`}
      </span>
    </div>
  )
}

function UpcomingFeatures() {
  return (
    <section className="glass rounded-3xl p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Próxima etapa
      </p>

      <h2 className="mt-2 text-xl font-semibold">
        El análisis se construirá sobre partidos reales
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        El Home ya trabaja con fixtures reales. Ahora podemos
        incorporar estadísticas, forma reciente y recomendaciones
        explicadas desde el backend.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Estadísticas"
          description="Remates, corners, tarjetas, posesión y tiros al arco."
        />

        <FeatureCard
          title="Forma reciente"
          description="Rendimiento de los últimos partidos de cada equipo."
        />

        <FeatureCard
          title="Análisis"
          description="Recomendaciones fundamentadas, sin mostrar cuotas."
        />
      </div>
    </section>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <article className="rounded-2xl border border-border/70 bg-card/50 p-4">
      <p className="font-semibold">{title}</p>

      <p className="mt-1 text-sm leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  )
}

function HomeLoading() {
  return (
    <div className="space-y-5">
      <div className="glass flex min-h-72 items-center justify-center rounded-3xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          Cargando partidos reales...
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="glass h-64 animate-pulse rounded-3xl"
          />
        ))}
      </div>
    </div>
  )
}

function HomeError({
  message,
}: {
  message: string
}) {
  return (
    <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

        <div>
          <p className="font-semibold">
            No se pudieron cargar los partidos
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {message}
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            Verificá que el backend esté corriendo y que
            `/fixtures/today` responda correctamente.
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptyHome() {
  return (
    <div className="glass rounded-3xl p-10 text-center">
      <CalendarDays className="mx-auto size-9 text-muted-foreground" />

      <p className="mt-4 font-semibold">
        No hay partidos disponibles
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        La API no devolvió fixtures para la fecha actual.
      </p>
    </div>
  )
}

function NoFilterResults({
  onReset,
}: {
  onReset: () => void
}) {
  return (
    <div className="glass mt-5 rounded-3xl p-10 text-center">
      <Search className="mx-auto size-9 text-muted-foreground" />

      <p className="mt-4 font-semibold">
        No encontramos partidos
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Probá con otra búsqueda o eliminá alguno de los
        filtros.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
      >
        <RotateCcw className="size-3.5" />
        Limpiar filtros
      </button>
    </div>
  )
}

function selectFeaturedMatch(
  fixtures: Fixture[],
): Fixture | null {
  if (fixtures.length === 0) {
    return null
  }

  const prioritizedLive = fixtures
    .filter((fixture) =>
      isLiveStatus(fixture.status),
    )
    .sort(compareByLeaguePriority)[0]

  if (prioritizedLive) {
    return prioritizedLive
  }

  const upcoming = fixtures
    .filter((fixture) =>
      isUpcomingStatus(fixture.status),
    )
    .sort((a, b) => {
      const priorityDifference =
        getLeaguePriority(a.league) -
        getLeaguePriority(b.league)

      if (priorityDifference !== 0) {
        return priorityDifference
      }

      return getTimestamp(a) - getTimestamp(b)
    })[0]

  if (upcoming) {
    return upcoming
  }

  return [...fixtures].sort((a, b) => {
    const priorityDifference =
      getLeaguePriority(a.league) -
      getLeaguePriority(b.league)

    if (priorityDifference !== 0) {
      return priorityDifference
    }

    return getTimestamp(b) - getTimestamp(a)
  })[0]
}

function sortFixtures(
  fixtures: Fixture[],
  sortBy: SortOption,
) {
  const copy = [...fixtures]

  switch (sortBy) {
    case "time-asc":
      return copy.sort(
        (a, b) => getTimestamp(a) - getTimestamp(b),
      )

    case "time-desc":
      return copy.sort(
        (a, b) => getTimestamp(b) - getTimestamp(a),
      )

    case "league":
      return copy.sort((a, b) => {
        const leagueComparison =
          a.league.localeCompare(b.league)

        if (leagueComparison !== 0) {
          return leagueComparison
        }

        return getTimestamp(a) - getTimestamp(b)
      })

    case "recommended":
    default:
      return copy.sort((a, b) => {
        const statusDifference =
          getStatusPriority(a.status) -
          getStatusPriority(b.status)

        if (statusDifference !== 0) {
          return statusDifference
        }

        const leagueDifference =
          getLeaguePriority(a.league) -
          getLeaguePriority(b.league)

        if (leagueDifference !== 0) {
          return leagueDifference
        }

        return getTimestamp(a) - getTimestamp(b)
      })
  }
}

function compareByLeaguePriority(
  a: Fixture,
  b: Fixture,
) {
  return (
    getLeaguePriority(a.league) -
      getLeaguePriority(b.league) ||
    getTimestamp(a) - getTimestamp(b)
  )
}

function getStatusPriority(status: string) {
  if (isLiveStatus(status)) {
    return 0
  }

  if (isUpcomingStatus(status)) {
    return 1
  }

  if (isFinishedStatus(status)) {
    return 2
  }

  return 3
}

function getLeaguePriority(league: string) {
  const normalizedLeague = normalizeText(league)

  const priorities = [
    "world cup",
    "uefa champions league",
    "champions league",
    "copa libertadores",
    "premier league",
    "la liga",
    "serie a",
    "bundesliga",
    "ligue 1",
    "europa league",
    "copa sudamericana",
    "liga profesional argentina",
    "primera division",
    "major league soccer",
    "mls",
  ]

  const position = priorities.findIndex((item) =>
    normalizedLeague.includes(item),
  )

  return position === -1 ? 999 : position
}

function getTimestamp(fixture: Fixture) {
  if (!fixture.date) {
    return Number.MAX_SAFE_INTEGER
  }

  const timestamp = new Date(fixture.date).getTime()

  return Number.isNaN(timestamp)
    ? Number.MAX_SAFE_INTEGER
    : timestamp
}

function isLiveStatus(status: string) {
  return LIVE_STATUSES.includes(status)
}

function isFinishedStatus(status: string) {
  return FINISHED_STATUSES.includes(status)
}

function isUpcomingStatus(status: string) {
  return UPCOMING_STATUSES.includes(status)
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function formatFixtureDate(date: string) {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date))
  } catch {
    return date
  }
}

function formatBackendDate(date: string) {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(`${date}T12:00:00Z`))
  } catch {
    return date
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    TBD: "Por definir",
    NS: "Programado",
    "1H": "Primer tiempo",
    HT: "Entretiempo",
    "2H": "Segundo tiempo",
    ET: "Tiempo extra",
    P: "Penales",
    FT: "Finalizado",
    AET: "Finalizado",
    PEN: "Finalizado",
    BT: "Descanso",
    SUSP: "Suspendido",
    INT: "Interrumpido",
    PST: "Pospuesto",
    CANC: "Cancelado",
    ABD: "Abandonado",
    AWD: "Resultado administrativo",
    WO: "Walkover",
    LIVE: "En vivo",
  }

  return labels[status] ?? status ?? "Sin estado"
}