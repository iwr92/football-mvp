# ⚽ EdgeMatch

> AI-powered football analytics platform that transforms raw football data into actionable insights and intelligent match analysis.

---

## 🚀 Vision

EdgeMatch is a football intelligence platform built for analysts, bettors and football enthusiasts who want to make better decisions using data.

Instead of only displaying statistics, EdgeMatch combines historical data, team performance, contextual information and predictive models to generate valuable recommendations.

Our goal is to answer one question:

> **"What is the strongest edge before kickoff?"**

---

# ✨ Features

## Current

- Modern dashboard
- FastAPI backend
- Next.js frontend
- Frontend connected to backend
- Real fixture loading
- Responsive UI
- Glassmorphism design
- Modular architecture

---

## Planned

- Match analysis
- Team comparison
- Historical trends
- xG models
- Corner prediction
- Shot prediction
- Card prediction
- Goal kick analysis
- Betting value detection
- AI recommendations
- Live match intelligence
- User authentication
- Saved watchlists
- Premium features

---

# 🏗 Project Structure

```
football-mvp/

├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── calculators/
│   │   ├── engine/
│   │   ├── providers/
│   │   ├── models/
│   │   └── main.py
│   │
│   └── .env
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# 🖥 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Backend

- FastAPI
- Python
- API-Football
- Pydantic

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/YOUR_USERNAME/football-mvp.git

cd football-mvp
```

---

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
```

Windows

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run

```bash
uvicorn app.main:app --reload
```

Backend

```
http://localhost:8000
```

---

## Frontend

```bash
cd frontend

pnpm install
```

Run

```bash
pnpm dev
```

Frontend

```
http://localhost:3000
```

---

# 🔌 Environment Variables

## Backend

```
API_FOOTBALL_KEY=YOUR_KEY
```

## Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

# 📡 Current API

## Health

```
GET /
```

Response

```json
{
  "project": "Football Analytics MVP",
  "status": "running"
}
```

---

## Today's Fixtures

```
GET /fixtures/today
```

Example

```json
{
  "date": "2026-07-09",
  "total": 1,
  "matches": [
    {
      "fixture_id": 1519384,
      "league": "Liga Pro",
      "country": "Ecuador",
      "home": "Aucas",
      "away": "Guayaquil City FC",
      "score": {
        "home": 1,
        "away": 0
      },
      "status": "FT"
    }
  ]
}
```

---

# 📍 Roadmap

## Phase 1 ✅

- Dashboard
- Backend
- API connection
- GitHub repository

---

## Phase 2 🚧

- Match detail page
- Statistics endpoint
- Team comparison
- Dynamic dashboard

---

## Phase 3

- Recommendation engine
- Probability models
- Market confidence
- Value detection

---

## Phase 4

- AI Analysis
- Personalized recommendations
- Live analysis
- Premium features

---

# 🎯 Mission

Transform football data into intelligent decisions.

---

## License

MIT