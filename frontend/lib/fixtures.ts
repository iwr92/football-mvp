import { apiGet } from "./api"

export type Fixture = {
  fixture_id: number
  league: string
  country: string
  home: string
  away: string
  score: {
    home: number | null
    away: number | null
  }
  status: string
}

export type FixturesResponse = {
  date: string
  total: number
  matches: Fixture[]
}

export function getTodayFixtures() {
  return apiGet<FixturesResponse>("/fixtures/today")
}