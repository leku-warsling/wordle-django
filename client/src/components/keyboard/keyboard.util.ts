import { LetterStateMap } from '@/wordle/wordle.types';

export const getKeyStyleProps = (
  key: string,
  letterHistory: LetterStateMap,
) => {
  const letterState = letterHistory[key];
  const baseStyles = {
    _hover: { bg: 'gray.600' },
    fontWeight: 'bold',
    bg: 'gray.500',
    h: 14,
  };

  switch (letterState) {
    case 'CORRECT':
      return { ...baseStyles, bg: 'green.600', color: 'white' };
    case 'WRONG_POSITION':
      return { ...baseStyles, bg: '#b59f3b' };
    case 'WRONG':
      return { ...baseStyles, bg: 'gray.700', color: 'white' };
    default:
      return baseStyles;
  }
};
