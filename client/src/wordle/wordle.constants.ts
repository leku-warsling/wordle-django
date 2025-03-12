import { LetterState } from './wordle.types';

export const LETTER_STATE_PRIORITY: Record<LetterState, number> = {
  CORRECT: 4,
  WRONG_POSITION: 3,
  WRONG: 2,
  EMPTY: 1,
};
