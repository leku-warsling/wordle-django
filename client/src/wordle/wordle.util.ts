import { LetterState, LetterStateMap } from './wordle.types';
import { LETTER_STATE_PRIORITY } from './wordle.constants';

export const hasHigherPriority = (a: LetterState, b: LetterState) => {
  return LETTER_STATE_PRIORITY[a] > LETTER_STATE_PRIORITY[b];
};

export const computeLetterHistory = (
  guesses: string[],
  letterStates: LetterState[][],
): LetterStateMap => {
  const stateMap: LetterStateMap = {};

  for (let i = 0; i < guesses.length; i++) {
    for (let j = 0; j < 5; j++) {
      const letter = guesses[i][j];
      const letterState = letterStates[i][j];
      if (
        letter in stateMap &&
        !hasHigherPriority(letterState, stateMap[letter])
      ) {
        continue;
      }
      stateMap[letter] = letterState;
    }
  }
  return stateMap;
};
