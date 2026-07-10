export type MatchStatus = "upcoming" | "live" | "finished"
export type FormResult = "W" | "D" | "L"

export interface Team {
  name: string
  short: string
  color: string
}

export interface Match {
  id: string
  league: string
  leagueShort: string
  round: string
  home: Team
  away: Team
  kickoff: string
  venue: string
  status: MatchStatus
  minute?: number
  score?: { home: number; away: number }
  edgeScore: number
  confidence: number
  topMarket: string
  topMarketOdds: number
}

export interface StatMetric {
  id: string
  label: string
  icon: "goals" | "shots" | "target" | "corners" | "cards" | "keeper"
  home: number
  away: number
  homeLabel: string
  awayLabel: string
  projection: string
  trend: number
}

export interface MarketProbability {
  id: string
  market: string
  selection: string
  probability: number
  odds: number
  value: number
  status: "approved" | "neutral" | "rejected"
  note: string
}

const teams: Record<string, Team> = {
  arsenal: { name: "Arsenal", short: "ARS", color: "#EF0107" },
  city: { name: "Man City", short: "MCI", color: "#6CABDD" },
  liverpool: { name: "Liverpool", short: "LIV", color: "#C8102E" },
  chelsea: { name: "Chelsea", short: "CHE", color: "#034694" },
  spurs: { name: "Tottenham", short: "TOT", color: "#132257" },
  united: { name: "Man United", short: "MUN", color: "#DA291C" },
  villa: { name: "Aston Villa", short: "AVL", color: "#95BFE5" },
  newcastle: { name: "Newcastle", short: "NEW", color: "#241F20" },
  madrid: { name: "Real Madrid", short: "RMA", color: "#FEBE10" },
  barca: { name: "Barcelona", short: "BAR", color: "#A50044" },
  bayern: { name: "Bayern", short: "BAY", color: "#DC052D" },
  dortmund: { name: "Dortmund", short: "DOR", color: "#FDE100" },
}

export const featuredMatch: Match = {
  id: "ars-mci",
  league: "Premier League",
  leagueShort: "PL",
  round: "Matchweek 12",
  home: teams.arsenal,
  away: teams.city,
  kickoff: "16:30",
  venue: "Emirates Stadium, London",
  status: "upcoming",
  edgeScore: 89,
  confidence: 88,
  topMarket: "Over 2.5 Goals",
  topMarketOdds: 1.88,
}

export const matches: Match[] = [
  {
    id: "liv-che",
    league: "Premier League",
    leagueShort: "PL",
    round: "Matchweek 12",
    home: teams.liverpool,
    away: teams.chelsea,
    kickoff: "14:00",
    venue: "Anfield",
    status: "live",
    minute: 63,
    score: { home: 2, away: 1 },
    edgeScore: 82,
    confidence: 79,
    topMarket: "Both Teams to Score",
    topMarketOdds: 1.72,
  },
  {
    id: "tot-mun",
    league: "Premier League",
    leagueShort: "PL",
    round: "Matchweek 12",
    home: teams.spurs,
    away: teams.united,
    kickoff: "17:30",
    venue: "Tottenham Hotspur Stadium",
    status: "upcoming",
    edgeScore: 74,
    confidence: 71,
    topMarket: "Over 9.5 Corners",
    topMarketOdds: 1.95,
  },
  {
    id: "rma-bar",
    league: "La Liga",
    leagueShort: "LL",
    round: "Jornada 13",
    home: teams.madrid,
    away: teams.barca,
    kickoff: "20:00",
    venue: "Santiago Bernabéu",
    status: "upcoming",
    edgeScore: 91,
    confidence: 85,
    topMarket: "Over 3.5 Goals",
    topMarketOdds: 2.1,
  },
  {
    id: "bay-dor",
    league: "Bundesliga",
    leagueShort: "BL",
    round: "Spieltag 11",
    home: teams.bayern,
    away: teams.dortmund,
    kickoff: "18:30",
    venue: "Allianz Arena",
    status: "upcoming",
    edgeScore: 68,
    confidence: 64,
    topMarket: "Over 2.5 Goals",
    topMarketOdds: 1.55,
  },
  {
    id: "new-avl",
    league: "Premier League",
    leagueShort: "PL",
    round: "Matchweek 12",
    home: teams.newcastle,
    away: teams.villa,
    kickoff: "15:00",
    venue: "St James' Park",
    status: "finished",
    score: { home: 3, away: 2 },
    edgeScore: 77,
    confidence: 73,
    topMarket: "Over 2.5 Goals",
    topMarketOdds: 1.8,
  },
]

export const featuredForm: { team: Team; form: FormResult[] }[] = [
  { team: teams.arsenal, form: ["W", "W", "W", "D", "L"] },
  { team: teams.city, form: ["W", "W", "D", "W", "W"] },
]

export const statMetrics: StatMetric[] = [
  {
    id: "goals",
    label: "Expected Goals",
    icon: "goals",
    home: 1.9,
    away: 1.6,
    homeLabel: "xG",
    awayLabel: "xG",
    projection: "3.5 combined",
    trend: 8,
  },
  {
    id: "shots",
    label: "Shots",
    icon: "shots",
    home: 14.2,
    away: 12.8,
    homeLabel: "per game",
    awayLabel: "per game",
    projection: "27 total",
    trend: 5,
  },
  {
    id: "target",
    label: "Shots on Target",
    icon: "target",
    home: 5.6,
    away: 5.1,
    homeLabel: "per game",
    awayLabel: "per game",
    projection: "10.7 total",
    trend: 3,
  },
  {
    id: "corners",
    label: "Corners",
    icon: "corners",
    home: 6.8,
    away: 5.9,
    homeLabel: "per game",
    awayLabel: "per game",
    projection: "12.7 total",
    trend: 6,
  },
  {
    id: "cards",
    label: "Cards",
    icon: "cards",
    home: 2.1,
    away: 2.4,
    homeLabel: "per game",
    awayLabel: "per game",
    projection: "4.5 total",
    trend: -2,
  },
  {
    id: "keeper",
    label: "Goalkeeper Kicks",
    icon: "keeper",
    home: 9.4,
    away: 8.2,
    homeLabel: "per game",
    awayLabel: "per game",
    projection: "17.6 total",
    trend: 1,
  },
]

export const marketProbabilities: MarketProbability[] = [
  {
    id: "over25",
    market: "Total Goals",
    selection: "Over 2.5 Goals",
    probability: 74,
    odds: 1.88,
    value: 12,
    status: "approved",
    note: "Model edge above bookmaker line. Strong offensive form on both sides.",
  },
  {
    id: "btts",
    market: "Both Teams to Score",
    selection: "Yes",
    probability: 68,
    odds: 1.72,
    value: 8,
    status: "approved",
    note: "High-pressing systems create chances at both ends.",
  },
  {
    id: "corners",
    market: "Corners",
    selection: "Over 10.5",
    probability: 55,
    odds: 1.95,
    value: 2,
    status: "neutral",
    note: "Fair value. Wing rotation supports the line but no clear edge.",
  },
  {
    id: "cards",
    market: "Cards",
    selection: "Over 4.5",
    probability: 49,
    odds: 2.05,
    value: 0,
    status: "neutral",
    note: "Balanced referee profile. Sits close to the true line.",
  },
  {
    id: "cs",
    market: "Correct Score",
    selection: "3-1 Home",
    probability: 9,
    odds: 9.5,
    value: -6,
    status: "rejected",
    note: "Overpriced relative to model. No positive expected value.",
  },
  {
    id: "hcap",
    market: "Handicap",
    selection: "Away -1.5",
    probability: 21,
    odds: 3.6,
    value: -4,
    status: "rejected",
    note: "Away side unlikely to cover on the road. Negative edge.",
  },
]

export interface TrendPoint {
  match: string
  edge: number
  market: number
  goals: number
}

export const trendData: TrendPoint[] = [
  { match: "MW5", edge: 71, market: 64, goals: 2.1 },
  { match: "MW6", edge: 68, market: 66, goals: 3.0 },
  { match: "MW7", edge: 76, market: 69, goals: 2.4 },
  { match: "MW8", edge: 81, market: 72, goals: 3.2 },
  { match: "MW9", edge: 78, market: 74, goals: 1.8 },
  { match: "MW10", edge: 85, market: 76, goals: 3.6 },
  { match: "MW11", edge: 84, market: 79, goals: 2.9 },
  { match: "MW12", edge: 89, market: 82, goals: 3.5 },
]

export interface LiveTrend {
  id: string
  tag: string
  title: string
  detail: string
  time: string
  tone: "info" | "success" | "warning"
}

export const liveTrends: LiveTrend[] = [
  {
    id: "1",
    tag: "Algorithm Alert",
    title: "Lineup change at Dortmund",
    detail: "Unexpected rotation increases 'Over 2.5' probability to 72%.",
    time: "2m ago",
    tone: "warning",
  },
  {
    id: "2",
    tag: "Market Move",
    title: "Smart money on Liverpool corners",
    detail: "Heavy volume on Over 9.5 across major exchanges.",
    time: "13m ago",
    tone: "info",
  },
  {
    id: "3",
    tag: "Edge Found",
    title: "Real Sociedad vs Valencia",
    detail: "12% discrepancy in Expected Goals versus posted line.",
    time: "18m ago",
    tone: "success",
  },
]
