import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

interface UserReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserReferencesModal({ isOpen, onClose }: UserReferencesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User References</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection='column' gap={4}>
            <Text>
              - This project is provides an application of A* for solving the n-puzzle problem. The project supports 5
              heuristics now, including: Misplaced, Manhattan, Inversion, Manhattan with Linear Conflict, and Walking
              Distance. The project also provides a user-friendly interface for users to interact with the puzzle. The
              project is open-source and available on Github.
            </Text>
            <Text>
              - You can change the size of the problem to what you want. And you can provide the start state for the
              problem by the State field. The project will provide you with the solution, the time it took to find the
              solution.
            </Text>
            <Box>
              <Text>- Note:</Text>
              <Flex flexDir='column' ml={4} gap={2}>
                <Text>
                  + 4x4 is the best one this app can solve, do not try to solve a 5x5 or 6x6 puzzle, it will take a lot
                  of memory and time. If it run out of memory, your browser will crash.
                </Text>
                <Text> + If your start state is not solvable, the Find Solution button will be disabled.</Text>
              </Flex>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
