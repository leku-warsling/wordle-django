import { useState, useEffect, useRef } from 'react';
import { UseWordleReturnState, WordleState } from './wordle.types';
import { fetchNewGameId, submitGuess } from './wordle.queries';
import { computeLetterHistory } from './wordle.util';

export const useWordle = (): UseWordleReturnState => {
  const hasInitialized = useRef(false);
  const [state, setState] = useState<WordleState>({
    isLoading: true,
    data: null,
  });

  const startGame = async () => {
    const gameId = await fetchNewGameId();
    setState({
      isLoading: false,
      data: {
        gameId,
        solution: null,
        guesses: [],
        currentGuess: '',
        isGameOver: false,
        message: '',
        letterStates: [],
        letterHistory: {},
      },
    });
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    startGame();
  }, []);

  if (state.isLoading) return state;

  const makeGuess = async (guess: string) => {
    const res = await submitGuess(state.data.gameId, guess);
    switch (res.type) {
      case 'CORRECT':
        setState({
          ...state,
          data: {
            ...state.data,
            solution: res.solution,
            message: res.message,
            isGameOver: true,
          },
        });
        break;
      case 'GAME_OVER':
        setState({
          ...state,
          data: {
            ...state.data,
            solution: res.solution,
            message: res.message,
            isGameOver: true,
          },
        });
        break;
      case 'WRONG':
        {
          const guesses = [...state.data.guesses, guess];
          const letterStates = [...state.data.letterStates, res.letterStates];
          setState({
            ...state,
            data: {
              ...state.data,
              guesses: guesses,
              currentGuess: '',
              letterStates: [...state.data.letterStates, res.letterStates],
              letterHistory: computeLetterHistory(guesses, letterStates),
            },
          });
        }
        break;
      case 'ERROR':
    }
  };

  const onKeyPress = (key: string) => {
    switch (key) {
      case 'BACKSPACE':
        setState({
          ...state,
          data: {
            ...state.data,
            currentGuess: state.data.currentGuess.slice(0, -1),
          },
        });
        break;
      case 'ENTER':
        makeGuess(state.data.currentGuess);
        break;
      default:
        if (state.data.currentGuess.length >= 5) return;
        setState({
          ...state,
          data: {
            ...state.data,
            currentGuess: state.data.currentGuess + key,
          },
        });
    }
  };

  return {
    ...state,
    reset: startGame,
    onKeyPress,
  };
};
