import { Box, Flex, IconButton } from '@chakra-ui/react';
import Puzzle from '@/components/Puzzle.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GithubIcon } from '@/icons.tsx';

function App() {
  return (
    <Flex h='100vh' w='full' justify='center' align='center'>
      <Puzzle />
      <ToastContainer />
      <Box as='form' action='https://github.com/1cedrus/aStar' position='absolute' right='1rem' bottom='1rem'>
        <IconButton type='submit' aria-label={'Github'} icon={<GithubIcon />} variant='outline' />
      </Box>
    </Flex>
  );
}

export default App;
