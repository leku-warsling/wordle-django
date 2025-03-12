from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
from .models import Game, Guesses
from .serializers import GameSerializer
from .words import words
from .helpers import get_letter_states


@api_view(["GET"])
def games_list(request):
    games = Game.objects.filter(is_game_over=False).all()
    serializer = GameSerializer(games, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def game_item(request, id):
    game = Game.objects.get(id=id)
    serializer = GameSerializer(game)
    return Response(serializer.data)


@api_view(["POST"])
def start_game(request):
    solution_word = random.choice(words)
    game = Game.objects.create(
        solution_word=solution_word,
        max_attempts=6,
        is_game_over=False,
        is_winner=False,
    )

    return Response(
        {
            "game_id": game.id,
            "message": "Game started",
        }
    )


@api_view(["POST"])
def make_guess(request, id):
    try:
        game = Game.objects.get(id=id)
    except Game.DoesNotExist:
        return Response({"type": "ERROR", "message": "Game not found"}, status=404)

    guess_word = request.data["guess_word"].lower()

    if len(guess_word) != 5:
        return Response(
            {"type": "ERROR", "message": "Guess must be exactly 5 characters"},
            status=400,
        )

    solution_word = game.solution_word
    next_guesse = game.guesses_used + 1

    if next_guesse <= 6 and guess_word == solution_word:
        game.is_winner = True
        game.is_game_over = True
        game.save()
        return Response(
            {"type": "CORRECT", "solution": game.solution_word, "message": "You won!"}
        )

    if next_guesse >= 6:
        game.is_game_over = True
        game.save()
        return Response(
            {
                "type": "GAME_OVER",
                "solution": game.solution_word,
                "message": "Game is over",
            },
        )
    else:
        game.guesses_used = next_guesse
        game.save()

    letter_states = get_letter_states(solution_word, guess_word)

    guess = Guesses.objects.create(
        game_id=id,
        word=request.data["guess_word"],
        letter_states=letter_states,
    )

    return Response(
        {"type": "WRONG", "guessId": guess.id, "letterStates": letter_states}
    )


@api_view(["GET"])
def game_status(request, id):
    try:
        game = Game.objects.get(id=id)
    except Game.DoesNotExist:
        return Response({"error": "Game not found"}, status=404)

    serializer = GameSerializer(game)
    guesses = game.guesses.all().values()

    return Response({"game": serializer.data, "guesses": list(guesses)})
