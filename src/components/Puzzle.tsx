import { Props } from '@/types.ts';
import { useEffect, useState } from 'react';
import { Box, Flex, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

interface PuzzleProps extends Props {
  imageURL: string;
}

export default function Puzzle({ imageURL }: PuzzleProps) {
  const [size, setSize] = useState<string>('3x3');
  const [rows, columns] = size.split('x').map((o) => parseInt(o));
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    if (!imageURL) return;

    const pieces = Array.from({ length: rows * columns - 1 }, (_, i) => i + 1);
    setPieces([...pieces, 0]);

    const canvas = document.querySelector('canvas')!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    const cWidth = Math.floor(canvas.width / columns);
    const cHeight = Math.floor(canvas.height / rows);

    ctx.clearRect(0, 0, cWidth, cHeight);

    img.onload = () => {
      const bWidth = Math.floor(img.width / columns);
      const bHeight = Math.floor(img.height / rows);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (row === rows - 1 && col === columns - 1) {
            // Ignore the last piece
            continue;
          }

          const sx = col * bWidth;
          const sy = row * bHeight;

          const dx = col * cWidth;
          const dy = row * cHeight;

          ctx.drawImage(img, sx, sy, bWidth, bHeight, dx, dy, cWidth, cHeight);
        }
      }
    };

    img.src = imageURL;
  }, [imageURL, size]);

  const doMove = (direction: Direction) => {
    const canvas = document.querySelector('canvas')!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    const cWidth = Math.floor(canvas.width / columns);
    const cHeight = Math.floor(canvas.height / rows);

    const indexOfCursor = pieces.indexOf(0);
    const cursorY = Math.floor(indexOfCursor / columns);
    const cursorX = indexOfCursor - cursorY * columns;

    let chooseBlockX: number;
    let chooseBlockY: number;

    switch (direction) {
      case Direction.UP:
        if (cursorY === 0) return;

        chooseBlockX = cursorX;
        chooseBlockY = cursorY - 1;

        break;
      case Direction.DOWN:
        if (cursorY === rows - 1) return;

        chooseBlockX = cursorX;
        chooseBlockY = cursorY + 1;

        break;
      case Direction.LEFT:
        if (cursorX === 0) return;

        chooseBlockX = cursorX - 1;
        chooseBlockY = cursorY;

        break;
      case Direction.RIGHT:
        if (cursorX === columns - 1) return;

        chooseBlockX = cursorX + 1;
        chooseBlockY = cursorY;

        break;
    }

    img.onload = () => {
      const bWidth = Math.floor(img.width / columns);
      const bHeight = Math.floor(img.height / rows);

      const chooseBlockIndex = chooseBlockY * columns + chooseBlockX;
      const chooseBlock = pieces[chooseBlockIndex];

      const row = Math.floor((chooseBlock - 1) / columns);
      const col = chooseBlock - 1 - row * columns;

      const sx = col * bWidth;
      const sy = row * bHeight;

      const dx = cursorX * cWidth;
      const dy = cursorY * cHeight;

      ctx.clearRect(chooseBlockX * cWidth, chooseBlockY * cHeight, cWidth, cHeight);
      ctx.drawImage(img, sx, sy, bWidth, bHeight, Math.floor(dx), Math.floor(dy), cWidth, cHeight);

      setPieces((prev) => {
        const newPieces = [...prev];

        newPieces[chooseBlockIndex] = 0;
        newPieces[indexOfCursor] = chooseBlock;

        return newPieces;
      });
    };

    img.src = imageURL;
  };

  const handleClick = (e: any) => {
    const canvas = document.querySelector('canvas')!;
    const pos = canvas.getBoundingClientRect();
    const img = new Image();

    const cWidth = Math.floor(canvas.width / columns);
    const cHeight = Math.floor(canvas.height / rows);

    const indexOfCursor = pieces.indexOf(0);
    const cursorY = Math.floor(indexOfCursor / columns);
    const cursorX = indexOfCursor - cursorY * columns;

    let clickedX = Math.floor((e.clientX - pos.x) / cWidth);
    let clickedY = Math.floor((e.clientY - pos.y) / cHeight);

    if (clickedX - cursorX === 1 && clickedY === cursorY) {
      doMove(Direction.RIGHT);
    } else if (clickedX - cursorX === -1 && clickedY === cursorY) {
      doMove(Direction.LEFT);
    } else if (clickedY - cursorY === 1 && clickedX === cursorX) {
      doMove(Direction.DOWN);
    } else if (clickedY - cursorY === -1 && clickedX === cursorX) {
      doMove(Direction.UP);
    }

    //
    // img.onload = () => {
    //   const bWidth = Math.floor(img.width / rows);
    //   const bHeight = Math.floor(img.height / columns);
    //
    //   let row = Math.floor((e.clientY - pos.y) / cHeight);
    //   let col = Math.floor((e.clientX - pos.x) / cWidth);
    //
    //   if (possibleMoves.includes(row * columns + col)) {
    //     let lastX = col * cWidth;
    //     let lastY = row * cHeight;
    //     ctx.clearRect(lastX, lastY, cWidth, cHeight);
    //
    //     const o = pieces[row * columns + col];
    //     let x = Math.floor(o / rows);
    //     let y = o - x * rows;
    //
    //     const sx = y * bWidth;
    //     const sy = x * bHeight;
    //
    //     const dx = emptyY * cWidth;
    //     const dy = emptyX * cHeight;
    //
    //     const animate = setInterval(() => {
    //       if (lastX !== dx || lastY !== dy) {
    //         ctx.clearRect(Math.floor(lastX), Math.floor(lastY), cWidth, cHeight);
    //
    //         lastX =
    //           Math.abs(lastX - dx) < 10
    //             ? dx
    //             : lastX < dx
    //               ? lastX + cWidth / 5
    //               : lastX > dx
    //                 ? lastX - cWidth / 5
    //                 : lastX;
    //         lastY =
    //           Math.abs(lastY - dy) < 10
    //             ? dy
    //             : lastY < dy
    //               ? lastY + cHeight / 5
    //               : lastY > dy
    //                 ? lastY - cHeight / 5
    //                 : lastY;
    //
    //         ctx.drawImage(img, sx, sy, bWidth, bHeight, Math.floor(lastX), Math.floor(lastY), cWidth, cHeight);
    //       } else {
    //         clearInterval(animate);
    //       }
    //     }, 20);
    //
    //     setPieces((prev) => {
    //       const newPieces = [...prev];
    //
    //       const lastOIndex = newPieces.indexOf(o);
    //       newPieces[indexOfEmpty] = o;
    //       newPieces[lastOIndex] = 0;
    //
    //       return newPieces;
    //     });
    //   }
    // };

    img.src = imageURL;
  };

  console.log(pieces);

  return (
    <Flex gap={2}>
      <Box borderRadius={6} border='1px solid' borderColor='chakra-border-color'>
        <canvas onClick={handleClick} height='500px' width='500px'></canvas>
      </Box>
      <Flex dir='column'>
        <InputGroup>
          <InputLeftAddon>Size</InputLeftAddon>
          <Input value={size} onChange={(e) => setSize(e.target.value)} placeholder='{number}x{number}' />
        </InputGroup>
      </Flex>
    </Flex>
  );
}
