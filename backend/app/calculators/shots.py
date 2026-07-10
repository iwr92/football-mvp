def calculate_expected_shots(
    team_avg_shots: float,
    rival_avg_shots: float
):

    expected = (
        team_avg_shots +
        rival_avg_shots
    ) / 2

    if expected >= 15:
        confidence = 95

    elif expected >= 13:
        confidence = 85

    elif expected >= 11:
        confidence = 75

    elif expected >= 9:
        confidence = 65

    else:
        confidence = 50

    return {

        "expected": round(expected,1),

        "confidence": confidence

    }