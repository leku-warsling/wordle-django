import { LetterState } from '@hooks/use-wordle';

export const getLetter = (word: string, index: number) => {
  return word?.[index] || '';
};

export const getLetterStyleProps = (state: LetterState = 'EMPTY') => {
  const baseStyles = {
    border: '2px solid',
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    rounded: 'sm',
    color: 'white',
    w: 16,
    h: 16,
  };
  switch (state) {
    case 'CORRECT':
      return {
        ...baseStyles,
        bg: 'green.600',
        borderColor: 'green.600',
        color: 'white',
      };
    case 'WRONG':
      return {
        ...baseStyles,
        bg: 'gray.600',
        borderColor: 'gray.600',
        color: 'white',
      };
    case 'WRONG_POSITION':
      return { ...baseStyles, bg: '#b59f3b', borderColor: '#b59f3b' };
    default:
      return baseStyles;
  }
};
