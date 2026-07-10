from app.providers.mock_provider import get_match_data
from app.calculators.shots import calculate_expected_shots


def analyze_match(match_id: int):

    match = get_match_data(match_id)

    home = match["home_team"]
    away = match["away_team"]


    home_prediction = calculate_expected_shots(
        home["avg_shots"],
        away["avg_shots"]
    )

    away_prediction = calculate_expected_shots(
        away["avg_shots"],
        home["avg_shots"]
    )


    return {

        "match": f'{home["name"]} vs {away["name"]}',

        "markets":{

            "home_shots":{

                "team":home["name"],

                **home_prediction

            },

            "away_shots":{

                "team":away["name"],

                **away_prediction

            }

        }

    }