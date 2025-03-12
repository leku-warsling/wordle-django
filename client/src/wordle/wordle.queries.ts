import axios from 'axios';
import { GuessResponse } from './wordle.types';

const client = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchNewGameId = async (): Promise<number> => {
  const res = await client.post('/games/start');
  return res.data.game_id;
};

export const submitGuess = async (
  gameId: number,
  guess_word: string,
): Promise<GuessResponse> => {
  const res = await client.post(`/games/${gameId}/guess`, { guess_word });
  return res.data;
};
