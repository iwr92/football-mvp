import Image from "next/image"
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
    console.error(error)
    notFound()
  }

  const matchDate = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(match.date))

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[24px] border border-black/5 bg-white/70 shadow-sm backdrop-blur-xl">
          <div className="border-b border-black/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <Image
                src={match.league.logo}
                alt={match.league.name}
                width={32}
                height={32}
              />

              <div>
                <p className="font-semibold text-neutral-900">
                  {match.league.name}
                </p>

                <p className="text-sm text-neutral-500">
                  {match.league.country} · {match.league.round}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-10">
            <div className="mb-8 text-center">
              <p className="text-sm text-neutral-500">
                {matchDate}
              </p>

              <p className="mt-2 text-sm font-medium text-orange-600">
                {match.status.long}
              </p>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="flex flex-col items-center text-center">
                <Image
                  src={match.teams.home.logo}
                  alt={match.teams.home.name}
                  width={84}
                  height={84}
                  className="object-contain"
                />

                <h1 className="mt-4 text-lg font-semibold text-neutral-900 md:text-2xl">
                  {match.teams.home.name}
                </h1>
              </div>

              <div className="rounded-2xl bg-neutral-950 px-5 py-4 text-center text-white">
                <p className="text-3xl font-bold md:text-4xl">
                  {match.goals.home ?? "-"}{" "}
                  <span className="text-neutral-500">:</span>{" "}
                  {match.goals.away ?? "-"}
                </p>

                <p className="mt-1 text-xs uppercase tracking-wider text-neutral-400">
                  {match.status.short}
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <Image
                  src={match.teams.away.logo}
                  alt={match.teams.away.name}
                  width={84}
                  height={84}
                  className="object-contain"
                />

                <h2 className="mt-4 text-lg font-semibold text-neutral-900 md:text-2xl">
                  {match.teams.away.name}
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            label="Estadio"
            value={match.venue?.name ?? "Sin información"}
          />

          <InfoCard
            label="Ciudad"
            value={match.venue?.city ?? "Sin información"}
          />

          <InfoCard
            label="Árbitro"
            value={match.referee ?? "Sin información"}
          />
        </section>

        <section className="mt-6 rounded-[24px] border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-neutral-900">
            Datos disponibles
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <AvailabilityCard
              label="Estadísticas"
              total={Object.keys(match.statistics ?? {}).length}
            />

            <AvailabilityCard
              label="Eventos"
              total={match.events?.length ?? 0}
            />

            <AvailabilityCard
              label="Alineaciones"
              total={match.lineups?.length ?? 0}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <article className="rounded-[20px] border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 font-semibold text-neutral-900">{value}</p>
    </article>
  )
}

function AvailabilityCard({
  label,
  total,
}: {
  label: string
  total: number
}) {
  const available = total > 0

  return (
    <article className="rounded-2xl bg-black/[0.03] p-4">
      <p className="font-medium text-neutral-900">{label}</p>

      <p
        className={`mt-1 text-sm ${
          available
            ? "text-emerald-700"
            : "text-neutral-500"
        }`}
      >
        {available
          ? `${total} registros disponibles`
          : "Información no disponible"}
      </p>
    </article>
  )
}