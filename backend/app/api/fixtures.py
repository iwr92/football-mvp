from typing import Any

from fastapi import APIRouter, HTTPException, Path

from app.services.api_football import api_football_get

router = APIRouter(
    prefix="/fixtures",
    tags=["Fixtures"],
)


def normalize_statistics(
    statistics_response: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Convierte las estadísticas de API-Football en una estructura
    más simple para consumir desde el frontend.
    """

    normalized: dict[str, Any] = {}

    for team_data in statistics_response:
        team = team_data.get("team", {})
        team_id = team.get("id")

        if team_id is None:
            continue

        stats = {}

        for stat in team_data.get("statistics", []):
            stat_type = stat.get("type")
            stat_value = stat.get("value")

            if stat_type:
                stats[stat_type] = stat_value

        normalized[str(team_id)] = {
            "team": {
                "id": team_id,
                "name": team.get("name"),
                "logo": team.get("logo"),
            },
            "statistics": stats,
        }

    return normalized


@router.get("/{fixture_id}")
async def get_fixture_detail(
    fixture_id: int = Path(
        ...,
        gt=0,
        description="ID del fixture en API-Football",
    ),
) -> dict[str, Any]:
    fixture_response = await api_football_get(
        endpoint="/fixtures",
        params={"id": fixture_id},
    )

    if not fixture_response:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontró el fixture {fixture_id}.",
        )

    fixture_data = fixture_response[0]

    # Algunas respuestas de /fixtures?id= incluyen eventos,
    # alineaciones y estadísticas. También los consultamos
    # individualmente para mantener el contrato estable.
    statistics_response = await api_football_get(
        endpoint="/fixtures/statistics",
        params={"fixture": fixture_id},
    )

    events_response = await api_football_get(
        endpoint="/fixtures/events",
        params={"fixture": fixture_id},
    )

    lineups_response = await api_football_get(
        endpoint="/fixtures/lineups",
        params={"fixture": fixture_id},
    )

    fixture = fixture_data.get("fixture", {})
    league = fixture_data.get("league", {})
    teams = fixture_data.get("teams", {})
    goals = fixture_data.get("goals", {})
    score = fixture_data.get("score", {})

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
        "teams": {
            "home": teams.get("home"),
            "away": teams.get("away"),
        },
        "goals": {
            "home": goals.get("home"),
            "away": goals.get("away"),
        },
        "score": score,
        "statistics": normalize_statistics(statistics_response),
        "events": events_response,
        "lineups": lineups_response,
    }