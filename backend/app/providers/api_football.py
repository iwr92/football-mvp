import requests
from app.config import API_FOOTBALL_KEY, API_FOOTBALL_URL
from typing import Optional

def api_get(path: str, params: Optional[dict] = None):
    url = f"{API_FOOTBALL_URL}{path}"

    headers = {
        "x-apisports-key": API_FOOTBALL_KEY
    }

    response = requests.get(url, headers=headers, params=params, timeout=15)
    response.raise_for_status()

    return response.json()


def get_fixtures_by_date(date: str):
    return api_get("/fixtures", {
        "date": date
    })

def get_fixture(fixture_id: int):
    return api_get(
        "/fixtures",
        {
            "id": fixture_id
        }
    )

def get_fixtures_by_date(date: str):
    return api_get("/fixtures", {
        "date": date
    })

def get_fixture_statistics(fixture_id: int):
    return api_get("/fixtures/statistics", {
        "fixture": fixture_id
    })

def get_fixture_statistics(fixture_id: int):
    return api_get(
        "/fixtures/statistics",
        {
            "fixture": fixture_id
        }
    )