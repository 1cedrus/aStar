import { Box, Flex, IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import Puzzle from '@/components/Puzzle.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GithubIcon, MessageQuestionIcon } from '@/icons.tsx';
import UserReferencesModal from '@/components/UserReferencesModal.tsx';

function App() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex h='100vh' w='full' justify='center' align='center'>
      <Puzzle />
      <ToastContainer />
      <Flex position='absolute' right='1rem' bottom='1rem' gap={2}>
        <Tooltip label='User references'>
          <IconButton onClick={onOpen} aria-label={'Github'} icon={<MessageQuestionIcon />} variant='outline' />
        </Tooltip>
        <Box as='form' action='https://github.com/1cedrus/aStar'>
          <Tooltip label='Github Repo'>
            <IconButton type='submit' aria-label={'Github'} icon={<GithubIcon />} variant='outline' />
          </Tooltip>
        </Box>
      </Flex>
      <UserReferencesModal onClose={onClose} isOpen={isOpen} />
    </Flex>
  );
}

export default App;
