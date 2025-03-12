export type LetterState = 'EMPTY' | 'CORRECT' | 'WRONG' | 'WRONG_POSITION';
export type LetterStateMap = Record<string, LetterState>;

export type Game = {
  gameId: number;
  solution: string | null;
  guesses: string[];
  currentGuess: string;
  isGameOver: boolean;
  message: string;
  letterStates: Array<LetterState[]>;
  letterHistory: LetterStateMap;
};

export type UninitializedGame = {
  isLoading: true;
  data: null;
};

export type InitializedGame = {
  isLoading: false;
  data: Game;
};

export type WordleState = UninitializedGame | InitializedGame;

export type UseWordleReturnState =
  | UninitializedGame
  | (InitializedGame & {
      reset: () => void;
      onKeyPress: (key: string) => void;
    });

export type GuessCorrectResponse = {
  type: 'CORRECT';
  solution: string;
  message: string;
};

export type GuessGameOverResponse = {
  type: 'GAME_OVER';
  solution: string;
  message: string;
};

export type GuessWrongResponse = {
  type: 'WRONG';
  guessId: number;
  letterStates: LetterState[];
};
export type GuessErrorResponse = {
  type: 'ERROR';
  message: string;
};

export type GuessResponse =
  | GuessCorrectResponse
  | GuessGameOverResponse
  | GuessWrongResponse
  | GuessErrorResponse;
