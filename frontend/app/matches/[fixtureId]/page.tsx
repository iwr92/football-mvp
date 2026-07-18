import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CalendarDays, MapPin, Shield, Trophy } from "lucide-react"
import { notFound } from "next/navigation"

import { getFixtureDetail } from "@/lib/fixtures"

type MatchDetailPageProps = {
  params: Promise<{
    fixtureId: string
  }>
}

export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps) {
  const { fixtureId } = await params

  let match

  try {
    match = await getFixtureDetail(fixtureId)
  } catch (error) {
    console.error(`Could not load fixture ${fixtureId}`, error)
    notFound()
  }

  const matchDate = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(match.date))

  const isFinished = match.status.short === "FT"
  const isLive = ["1H", "HT", "2H", "ET", "P", "LIVE"].includes(
    match.status.short,
  )

  const homeGoals = match.home.goals
  const awayGoals = match.away.goals

  return (
    <main className="min-h-screen bg-iridescent px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a partidos
        </Link>

        <section className="glass-strong overflow-hidden rounded-[28px]">
          <header className="flex flex-col gap-4 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
                <Image
                  src={match.league.logo}
                  alt={`Logo de ${match.league.name}`}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>

              <div>
                <p className="font-semibold text-foreground">
                  {match.league.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  {match.league.country} · {match.league.round}
                </p>
              </div>
            </div>

            <MatchStatus
              longStatus={match.status.long}
              shortStatus={match.status.short}
              elapsed={match.status.elapsed}
              isFinished={isFinished}
              isLive={isLive}
            />
          </header>

          <div className="px-5 py-8 md:px-8 md:py-12">
            <div className="mb-9 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              <span className="capitalize">{matchDate}</span>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 md:gap-10">
              <TeamBlock
                name={match.home.name}
                logo={match.home.logo}
                winner={match.home.winner}
              />

              <ScoreBlock
                homeGoals={homeGoals}
                awayGoals={awayGoals}
                shortStatus={match.status.short}
                elapsed={match.status.elapsed}
                isLive={isLive}
              />

              <TeamBlock
                name={match.away.name}
                logo={match.away.logo}
                winner={match.away.winner}
              />
            </div>

            {isFinished && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Descanso: {match.score.halftime.home ?? "-"}–
                  {match.score.halftime.away ?? "-"}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<MapPin className="size-5" />}
            label="Estadio"
            value={match.venue?.name ?? "Sin información"}
          />

          <InfoCard
            icon={<Trophy className="size-5" />}
            label="Temporada"
            value={`${match.league.season}`}
          />

          <InfoCard
            icon={<Shield className="size-5" />}
            label="Árbitro"
            value={match.referee ?? "Sin información"}
          />
        </section>

        <section className="glass mt-5 rounded-[24px] p-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Próxima implementación
            </p>

            <h2 className="mt-2 text-xl font-semibold text-foreground">
              Estadísticas y análisis del partido
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              El encabezado ya consume información real. El siguiente paso será
              incorporar estadísticas reales, forma reciente y recomendaciones
              calculadas desde el backend.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <PendingFeature
              title="Estadísticas"
              description="Remates, posesión, corners, tarjetas y tiros al arco."
            />

            <PendingFeature
              title="Forma reciente"
              description="Últimos partidos y rendimiento de ambos equipos."
            />

            <PendingFeature
              title="Mercados de valor"
              description="Recomendaciones explicadas, sin depender de cuotas."
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function TeamBlock({
  name,
  logo,
  winner,
}: {
  name: string
  logo: string
  winner: boolean | null
}) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div
        className={`flex size-20 items-center justify-center rounded-2xl border bg-card/80 p-3 shadow-sm md:size-28 ${
          winner ? "border-primary/35 ring-4 ring-primary/8" : "border-border"
        }`}
      >
        <Image
          src={logo}
          alt={`Escudo de ${name}`}
          width={84}
          height={84}
          className="size-full object-contain"
        />
      </div>

      <h1 className="mt-4 max-w-full truncate text-base font-semibold text-foreground sm:text-lg md:text-2xl">
        {name}
      </h1>

      {winner && (
        <span className="mt-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Ganador
        </span>
      )}
    </div>
  )
}

function ScoreBlock({
  homeGoals,
  awayGoals,
  shortStatus,
  elapsed,
  isLive,
}: {
  homeGoals: number | null
  awayGoals: number | null
  shortStatus: string
  elapsed: number | null
  isLive: boolean
}) {
  return (
    <div className="rounded-2xl bg-foreground px-4 py-4 text-center text-background shadow-lg md:min-w-40 md:px-6">
      <p className="whitespace-nowrap text-3xl font-bold tracking-tight md:text-5xl">
        {homeGoals ?? "–"}
        <span className="mx-2 text-background/35">:</span>
        {awayGoals ?? "–"}
      </p>

      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-background/60">
        {isLive && elapsed ? `${elapsed}' · ${shortStatus}` : shortStatus}
      </p>
    </div>
  )
}

function MatchStatus({
  longStatus,
  shortStatus,
  elapsed,
  isFinished,
  isLive,
}: {
  longStatus: string
  shortStatus: string
  elapsed: number | null
  isFinished: boolean
  isLive: boolean
}) {
  if (isLive) {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive">
        <span className="size-2 animate-pulse rounded-full bg-destructive" />
        EN VIVO {elapsed ? `· ${elapsed}'` : ""}
      </span>
    )
  }

  if (isFinished) {
    return (
      <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
        Finalizado
      </span>
    )
  }

  return (
    <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
      {longStatus || shortStatus}
    </span>
  )
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <article className="glass rounded-[20px] p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 truncate font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </article>
  )
}

function PendingFeature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <article className="rounded-2xl border border-border/70 bg-card/50 p-4">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  )
}