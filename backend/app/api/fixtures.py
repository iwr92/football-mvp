import os
from datetime import date

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/fixtures", tags=["fixtures"])

API_FOOTBALL_URL = "https://v3.football.api-sports.io"


def get_api_key() -> str:
    api_key = os.getenv("API_FOOTBALL_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="API_FOOTBALL_KEY is not configured",
        )

    return api_key


@router.get("/today")
async def get_today_fixtures():
    api_key = get_api_key()
    today = date.today().isoformat()

    headers = {
        "x-apisports-key": api_key,
    }

    params = {
        "date": today,
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                f"{API_FOOTBALL_URL}/fixtures",
                headers=headers,
                params=params,
            )

            response.raise_for_status()
            data = response.json()

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail="API-Football returned an error",
        ) from exc

    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not connect to API-Football",
        ) from exc

    if data.get("errors"):
        raise HTTPException(
            status_code=400,
            detail=data["errors"],
        )

    matches = []

    for item in data.get("response", []):
        fixture = item.get("fixture", {})
        league = item.get("league", {})
        teams = item.get("teams", {})
        goals = item.get("goals", {})

        matches.append(
            {
                "fixture_id": fixture.get("id"),
                "date": fixture.get("date"),
                "league": league.get("name"),
                "country": league.get("country"),
                "home": teams.get("home", {}).get("name"),
                "away": teams.get("away", {}).get("name"),
                "score": {
                    "home": goals.get("home"),
                    "away": goals.get("away"),
                },
                "status": fixture.get("status", {}).get("short"),
                "venue": fixture.get("venue", {}).get("name"),
            }
        )

    return {
        "date": today,
        "total": len(matches),
        "matches": matches,
    }


# IMPORTANTE: esta ruta dinámica va después de /today
@router.get("/{fixture_id}")
async def get_fixture(fixture_id: int):
    api_key = get_api_key()

    headers = {
        "x-apisports-key": api_key,
    }

    params = {
        "id": fixture_id,
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                f"{API_FOOTBALL_URL}/fixtures",
                headers=headers,
                params=params,
            )

            response.raise_for_status()
            data = response.json()

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail="API-Football returned an error",
        ) from exc

    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not connect to API-Football",
        ) from exc

    if data.get("errors"):
        raise HTTPException(
            status_code=400,
            detail=data["errors"],
        )

    fixtures = data.get("response", [])

    if not fixtures:
        raise HTTPException(
            status_code=404,
            detail="Fixture not found",
        )

    item = fixtures[0]

    fixture = item.get("fixture", {})
    league = item.get("league", {})
    teams = item.get("teams", {})
    goals = item.get("goals", {})
    score = item.get("score", {})

    return {
        "fixture_id": fixture.get("id"),
        "date": fixture.get("date"),
        "timestamp": fixture.get("timestamp"),
        "timezone": fixture.get("timezone"),
        "status": fixture.get("status"),
        "venue": fixture.get("venue"),
        "referee": fixture.get("referee"),
        "league": {
            "id": league.get("id"),
            "name": league.get("name"),
            "country": league.get("country"),
            "logo": league.get("logo"),
            "flag": league.get("flag"),
            "season": league.get("season"),
            "round": league.get("round"),
        },
        "home": {
            "id": teams.get("home", {}).get("id"),
            "name": teams.get("home", {}).get("name"),
            "logo": teams.get("home", {}).get("logo"),
            "winner": teams.get("home", {}).get("winner"),
            "goals": goals.get("home"),
        },
        "away": {
            "id": teams.get("away", {}).get("id"),
            "name": teams.get("away", {}).get("name"),
            "logo": teams.get("away", {}).get("logo"),
            "winner": teams.get("away", {}).get("winner"),
            "goals": goals.get("away"),
        },
        "score": score,
    }