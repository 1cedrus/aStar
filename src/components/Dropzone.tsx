import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box } from '@chakra-ui/react';
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
    <Box {...getRootProps()} border='2px solid black' px={8} cursor='pointer'>
      <input {...getInputProps({ accept: 'image/*' })} />
      {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
    </Box>
  );
}
