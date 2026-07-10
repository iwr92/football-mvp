from fastapi import APIRouter
from app.providers.api_football import get_fixtures_by_date, get_fixture
from app.providers.api_football import get_fixtures_by_date, get_fixture, get_fixture_statistics

router = APIRouter()


@router.get("/fixtures")
def fixtures(date: str):
    data = get_fixtures_by_date(date)

    matches = []

    for item in data["response"]:
        matches.append({
            "fixture_id": item["fixture"]["id"],
            "date": item["fixture"]["date"],
            "league": item["league"]["name"],
            "country": item["league"]["country"],
            "home": item["teams"]["home"]["name"],
            "away": item["teams"]["away"]["name"],
            "score": item["goals"],
            "status": item["fixture"]["status"]["short"]
        })

    return {
        "date": date,
        "total": len(matches),
        "matches": matches
    }


@router.get("/analyze/{fixture_id}")
def analyze(fixture_id: int):
    fixture = get_fixture(fixture_id)
    statistics = get_fixture_statistics(fixture_id)

    return {
        "fixture": fixture["response"][0] if fixture["response"] else None,
        "statistics": statistics["response"]
    }