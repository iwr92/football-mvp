from fastapi import APIRouter

router = APIRouter(prefix="/fixtures", tags=["fixtures"])

from fastapi import APIRouter, HTTPException

FIXTURES = [
    {
        "fixture_id": 1519384,
        "date": "2026-07-09T00:00:00+00:00",
        "league": "Liga Pro",
        "country": "Ecuador",
        "home": "Aucas",
        "away": "Guayaquil City FC",
        "score": {
            "home": 1,
            "away": 0,
        },
        "status": "FT",
        "venue": "Estadio Gonzalo Pozo Ripalda",
        "statistics": {
            "possession": {
                "home": 54,
                "away": 46,
            },
            "shots": {
                "home": 13,
                "away": 9,
            },
            "shots_on_target": {
                "home": 5,
                "away": 3,
            },
            "corners": {
                "home": 6,
                "away": 4,
            },
            "cards": {
                "home": 2,
                "away": 3,
            },
        },
    }
]


@router.get("/today")
def get_today_fixtures():
    return {
        "date": "2026-07-09",
        "total": len(FIXTURES),
        "matches": FIXTURES,
    }


@router.get("/{fixture_id}")
def get_fixture(fixture_id: int):
    fixture = next(
        (
            fixture
            for fixture in FIXTURES
            if fixture["fixture_id"] == fixture_id
        ),
        None,
    )

    if fixture is None:
        raise HTTPException(
            status_code=404,
            detail="Fixture not found",
        )

    return fixture


@router.get("/today")
def get_today_fixtures():
    return {
        "date": "2026-07-09",
        "total": 1,
        "matches": [
            {
                "fixture_id": 1519384,
                "league": "Liga Pro",
                "country": "Ecuador",
                "home": "Aucas",
                "away": "Guayaquil City FC",
                "score": {"home": 1, "away": 0},
                "status": "FT",
            }
        ],
    }