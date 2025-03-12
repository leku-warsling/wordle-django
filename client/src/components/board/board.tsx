import { LetterState } from '@/wordle/wordle.types';
import { Flex } from '@chakra-ui/react';
import { getLetterStyleProps, getLetter } from './board.util';

export type BoardProps = {
  guesses?: string[];
  currentGuess?: string;
  letterStates?: Array<LetterState[]>;
};

export const Board = ({
  guesses = [],
  currentGuess = '',
  letterStates = [],
}: BoardProps) => {
  return (
    <Flex flexDir="column" gap={2}>
      {Array.from({ length: 6 }, (_, row) => {
        const guess = guesses?.[row] || '';
        const letterState = letterStates?.[row] || [];
        const isCurrentGuessRow = row === guesses.length;

        return (
          <Flex key={row} gap={2}>
            {Array.from({ length: 5 }, (_, col) => {
              const letter = getLetter(guess, col);
              const animation = guess
                ? `animate__animated animate__flipInX animate__delay-${1 * col}s`
                : undefined;

              return (
                <Flex
                  key={`${col}-${letter}`}
                  className={animation}
                  {...getLetterStyleProps(letterState?.[col] || 'EMPTY')}
                >
                  {getLetter(isCurrentGuessRow ? currentGuess : guess, col)}
                </Flex>
              );
            })}
          </Flex>
        );
      })}
    </Flex>
  );
};
