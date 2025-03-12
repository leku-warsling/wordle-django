import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from unittest.mock import patch
from ..models import Game, Guesses


@pytest.fixture(autouse=True)
def clean_db(db):
    Game.objects.all().delete()
    Guesses.objects.all().delete()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def game_data():
    return {
        "id": 1,
        "solution_word": "beach",
        "max_attempts": 6,
        "guesses_used": 2,
        "is_game_over": False,
        "is_winner": False,
    }


@pytest.fixture
def completed_game_data():
    return {
        "id": 2,
        "solution_word": "tower",
        "max_attempts": 6,
        "guesses_used": 6,
        "is_game_over": True,
        "is_winner": False,
    }


@pytest.fixture
def winning_game_data():
    return {
        "id": 3,
        "solution_word": "light",
        "max_attempts": 6,
        "guesses_used": 3,
        "is_game_over": True,
        "is_winner": True,
    }


@pytest.fixture
def guesses_data():
    return [
        {"id": 1, "game_id": 1, "word": "blast", "letter_states": "BCXXC"},
        {"id": 2, "game_id": 1, "word": "bears", "letter_states": "BCXXX"},
        {"id": 3, "game_id": 3, "word": "fight", "letter_states": "XXXCC"},
        {"id": 4, "game_id": 3, "word": "sight", "letter_states": "XCCCC"},
        {"id": 5, "game_id": 3, "word": "light", "letter_states": "CCCCC"},
    ]


@pytest.fixture
def setup_db(db, game_data, completed_game_data, winning_game_data, guesses_data):
    # Create test games
    active_game = Game.objects.create(**game_data)
    completed_game = Game.objects.create(**completed_game_data)
    winning_game = Game.objects.create(**winning_game_data)

    # Create test guesses
    for guess in guesses_data:
        guess_copy = guess.copy()
        game_id = guess_copy.pop("game_id")
        guess_id = guess_copy.pop("id")
        Guesses.objects.create(id=guess_id, game_id=game_id, **guess_copy)

    return {
        "active_game": active_game,
        "completed_game": completed_game,
        "winning_game": winning_game,
    }


@pytest.mark.django_db(reset_sequences=True)
@patch("random.choice")
def test_start_game(mock_choice, api_client):
    """Test starting a new game"""
    mock_choice.return_value = "train"

    url = reverse("start_game")
    response = api_client.post(url)

    assert response.status_code == status.HTTP_200_OK
    assert "game_id" in response.data
    assert response.data["message"] == "Game started"

    # Verify the game was created with correct word
    game = Game.objects.get(id=response.data["game_id"])
    assert game.solution_word == "train"


@pytest.mark.django_db(reset_sequences=True)
def test_make_correct_guess(api_client, setup_db):
    """Test making a correct guess"""
    url = reverse("make_guess", args=[1])
    data = {"guess_word": "BEACH"}
    response = api_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["type"] == "CORRECT"

    # Verify game state updated
    game = Game.objects.get(id=1)
    assert game.is_winner is True
    assert game.is_game_over is True


@pytest.mark.django_db(reset_sequences=True)
def test_invalid_guess_length(api_client, setup_db):
    """Test submitting a guess with invalid length"""
    url = reverse("make_guess", args=[1])
    data = {"guess_word": "too_long"}
    response = api_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["type"] == "ERROR"


@pytest.mark.django_db(reset_sequences=True)
def test_game_not_found(api_client):
    """Test trying to make a guess on a non-existent game"""
    url = reverse("make_guess", args=[999])
    data = {"guess_word": "world"}
    response = api_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["type"] == "ERROR"
    assert response.data["message"] == "Game not found"
