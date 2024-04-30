import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Flex } from '@chakra-ui/react';
import { Props } from '@/types.ts';

interface DropzoneProps extends Props {
  onChange: (imageURL: string) => void;
}

export default function Dropzone({ onChange }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        onChange(reader.result as string);
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <Flex
      {...getRootProps()}
      height='500px'
      width='500px'
      borderRadius={6}
      border='1px solid'
      borderColor='chakra-border-color'
      overflow='hidden'
      cursor='pointer'
      justify='center'
      align='center'>
      <input {...getInputProps({ accept: 'image/*' })} />
      {isDragActive ? <p>Drop the image here ...</p> : <p>Drag 'n' drop the image here, or click to select image</p>}
    </Flex>
  );
}
