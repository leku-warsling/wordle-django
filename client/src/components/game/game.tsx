import { MdOutlineRefresh } from 'react-icons/md';
import { Heading, Dialog, Text, Button, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Keyboard } from '@components/keyboard';
import { Board } from '@components/board';
import { useWordle } from '@/wordle';

export const Game = () => {
  const game = useWordle();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (game.data?.isGameOver) {
      setShowModal(true);
    }
  }, [game.data?.isGameOver]);

  if (game.isLoading) return null;

  return (
    <Flex direction="column" gap={6} justify="center" align="center" py={4}>
      <Flex>
        <Heading as="h1" size="3xl" color="white">
          WORDLE
        </Heading>
      </Flex>
      <Board
        guesses={game.data.guesses}
        currentGuess={game.data.currentGuess}
        letterStates={game.data.letterStates}
      />
      <Keyboard
        onKeyPress={game.onKeyPress}
        guess={game.data.currentGuess}
        letterHistory={game.data.letterHistory}
      />
      <Dialog.Root open={showModal}>
        <Dialog.Trigger />
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900" color="white" py={6}>
            <Dialog.CloseTrigger />
            <Dialog.Header justifyContent="center">
              <Dialog.Title fontSize="2xl">{game.data.message}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body textAlign="center">
              <Text fontWeight={600} fontSize="xl">
                {game.data.solution?.toUpperCase()}
              </Text>
            </Dialog.Body>
            <Dialog.Footer justifyContent="center">
              <Button
                size="lg"
                colorPalette="blue"
                variant="solid"
                onClick={() => {
                  setShowModal(false);
                  game.reset();
                }}
              >
                Play Again
                <MdOutlineRefresh />
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Flex>
  );
};
