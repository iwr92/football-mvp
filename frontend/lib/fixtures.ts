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