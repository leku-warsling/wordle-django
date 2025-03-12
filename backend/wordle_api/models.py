from django.db import models


class Game(models.Model):
    solution_word = models.CharField(max_length=50)
    max_attempts = models.IntegerField(default=6)
    guesses_used = models.IntegerField(default=0)
    is_game_over = models.BooleanField(default=False)
    is_winner = models.BooleanField(default=False)


class Guesses(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="guesses")
    word = models.CharField(max_length=50)
    letter_states = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
