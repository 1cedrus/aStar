import { Flex } from '@chakra-ui/react';
import Puzzle from '@/components/Puzzle.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Flex h='100vh' w='full' justify='center' align='center'>
      <Puzzle />
      <ToastContainer />
    </Flex>
  );
}

export default App;
