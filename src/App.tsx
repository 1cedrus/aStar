import { Flex } from '@chakra-ui/react';
import Dropzone from '@/components/Dropzone.tsx';
import { useState } from 'react';
import Puzzle from '@/components/Puzzle.tsx';

function App() {
  const [image, setImage] = useState<string>('');

  const handleDrop = (imageURL: string) => {
    setImage(imageURL);
  };

  return (
    <Flex h='100vh' w='full' justify='center' align='center'>
      {image ? <Puzzle imageURL={image} /> : <Dropzone onChange={handleDrop} />}
    </Flex>
  );
}

export default App;
