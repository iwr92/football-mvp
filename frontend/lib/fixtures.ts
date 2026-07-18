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

export type FixtureStatus = {
  long: string
  short: string
  elapsed: number | null
  extra: number | null
}

export type FixtureVenue = {
  id: number | null
  name: string | null
  city: string | null
}

export type FixtureLeague = {
  id: number
  name: string
  country: string
  logo: string
  flag: string | null
  season: number
  round: string
}

export type FixtureTeam = {
  id: number
  name: string
  logo: string
  winner: boolean | null
  goals: number | null
}

export type FixtureScorePeriod = {
  home: number | null
  away: number | null
}

export type FixtureScore = {
  halftime: FixtureScorePeriod
  fulltime: FixtureScorePeriod
  extratime: FixtureScorePeriod
  penalty: FixtureScorePeriod
}

export type FixtureDetail = {
  fixture_id: number
  date: string
  timestamp: number
  timezone: string
  referee: string | null
  status: FixtureStatus
  venue: FixtureVenue
  league: FixtureLeague
  home: FixtureTeam
  away: FixtureTeam
  score: FixtureScore
}

export function getTodayFixtures(): Promise<FixturesResponse> {
  return apiGet<FixturesResponse>("/fixtures/today")
}

export function getFixtureById(
  fixtureId: number,
): Promise<FixtureDetail> {
  return apiGet<FixtureDetail>(`/fixtures/${fixtureId}`)
}

export function getFixtureDetail(
  fixtureId: string | number,
): Promise<FixtureDetail> {
  return apiGet<FixtureDetail>(`/fixtures/${fixtureId}`)
}