import { apiGet } from "./api"

export type TeamValue = {
  home: number
  away: number
}

export type FixtureStatistics = {
  possession: TeamValue
  shots: TeamValue
  shots_on_target: TeamValue
  corners: TeamValue
  cards: TeamValue
}

export type Fixture = {
  fixture_id: number
  date?: string
  league: string
  country: string
  home: string
  away: string
  score: {
    home: number | null
    away: number | null
  }
  status: string
  venue?: string
  statistics?: FixtureStatistics
}

export type FixturesResponse = {
  date: string
  total: number
  matches: Fixture[]
}

export function getTodayFixtures(): Promise<FixturesResponse> {
  return apiGet<FixturesResponse>("/fixtures/today")
}

export function getFixtureById(
  fixtureId: number,
): Promise<Fixture> {
  return apiGet<Fixture>(`/fixtures/${fixtureId}`)
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export type FixtureTeam = {
  id: number
  name: string
  logo: string
  winner: boolean | null
}

export type FixtureDetail = {
  fixture_id: number
  date: string
  timestamp: number
  timezone: string

  status: {
    long: string
    short: string
    elapsed: number | null
    extra: number | null
  }

  venue: {
    id: number | null
    name: string | null
    city: string | null
  }

  referee: string | null

  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string | null
    season: number
    round: string
  }

  teams: {
    home: FixtureTeam
    away: FixtureTeam
  }

  goals: {
    home: number | null
    away: number | null
  }

  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
    extratime: {
      home: number | null
      away: number | null
    }
    penalty: {
      home: number | null
      away: number | null
    }
  }

  statistics: Record<string, unknown>
  events: unknown[]
  lineups: unknown[]
}

export async function getFixtureDetail(
  fixtureId: string | number,
): Promise<FixtureDetail> {
  const response = await fetch(
    `${API_URL}/fixtures/${fixtureId}`,
    {
      cache: "no-store",
    },
  )

  if (!response.ok) {
    throw new Error(
      `No se pudo cargar el partido ${fixtureId}`,
    )
  }

  return response.json()
}