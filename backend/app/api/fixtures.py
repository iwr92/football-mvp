from fastapi import APIRouter

router = APIRouter(prefix="/fixtures", tags=["fixtures"])


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