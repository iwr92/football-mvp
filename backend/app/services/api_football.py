import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

API_FOOTBALL_KEY = os.getenv("API_FOOTBALL_KEY")
API_FOOTBALL_BASE_URL = os.getenv(
    "API_FOOTBALL_BASE_URL",
    "https://v3.football.api-sports.io",
)


async def api_football_get(
    endpoint: str,
    params: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    """
    Ejecuta una petición GET a API-Football y devuelve el campo response.
    """

    if not API_FOOTBALL_KEY:
        raise HTTPException(
            status_code=500,
            detail="API_FOOTBALL_KEY no está configurada.",
        )

    headers = {
        "x-apisports-key": API_FOOTBALL_KEY,
    }

    url = f"{API_FOOTBALL_BASE_URL.rstrip('/')}/{endpoint.lstrip('/')}"

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                url,
                headers=headers,
                params=params or {},
            )

        response.raise_for_status()
        payload = response.json()

    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504,
            detail="API-Football tardó demasiado en responder.",
        ) from exc

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"API-Football respondió con error {exc.response.status_code}.",
        ) from exc

    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail="No se pudo conectar con API-Football.",
        ) from exc

    errors = payload.get("errors")

    if errors:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "API-Football devolvió errores.",
                "errors": errors,
            },
        )

    return payload.get("response", [])