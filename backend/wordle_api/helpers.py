def get_letter_state(target_word: str, letter: str, index: int) -> str:
    if not letter.strip():
        return "EMPTY"

    target_word = target_word.lower()
    letter = letter.lower()

    if target_word[index] == letter:
        return "CORRECT"

    if letter in target_word:
        return "WRONG_POSITION"

    return "WRONG"


def get_letter_states(target_word: str, guess_word: str) -> list:
    return [
        get_letter_state(target_word, letter, index)
        for index, letter in enumerate(guess_word)
    ]
