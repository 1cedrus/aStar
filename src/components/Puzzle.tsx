import { Direction, Heuristic, SolutionInfo } from '@/types.ts';
import { useEffect, useState } from 'react';
import { Box, Button, Flex, Input, InputGroup, InputLeftAddon, Select } from '@chakra-ui/react';
import Dropzone from '@/components/Dropzone.tsx';
import { toast } from 'react-toastify';
import { misplaced } from '@/utils/heuristics.ts';
import { getMoveDir, isSolvable } from '@/utils/puzzle.ts';

export default function Puzzle() {
  const [size, setSize] = useState<string>('3x3');
  const [rows, columns] = size.split('x').map((o) => parseInt(o));
  const [pieces, setPieces] = useState<number[]>([]);
  const [heuristic, setHeuristic] = useState<Heuristic>(Heuristic.MISPLACED);
  const [onFinding, setOnFinding] = useState(false);
  const [solution, setSolution] = useState<SolutionInfo>();
  const [image, setImage] = useState('');
  const [worker, setWorker] = useState<Worker>();
  const [solveInterval, setSolveInterval] = useState<number>();
  const [onSolving, setOnSolving] = useState(false);

  const handleDrop = (imageURL: string) => {
    setImage(imageURL);
  };

  useEffect(() => {
    if (!image) return;

    doClear();
  }, [image, size]);

  const renderPuzzle = (pieces: number[]) => {
    const canvas = document.querySelector('canvas')!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    const cWidth = Math.ceil(canvas.width / columns);
    const cHeight = Math.ceil(canvas.height / rows);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    img.onload = () => {
      const bWidth = Math.floor(img.width / columns);
      const bHeight = Math.floor(img.height / rows);

      pieces.forEach((piece, index) => {
        if (piece === 0) return;

        const y = Math.floor((piece - 1) / columns);
        const x = piece - 1 - y * columns;

        const sx = x * bWidth;
        const sy = y * bHeight;

        const dx = (index % columns) * cWidth;
        const dy = Math.floor(index / columns) * cHeight;

        ctx.drawImage(img, sx, sy, bWidth, bHeight, dx, dy, cWidth, cHeight);
      });
    };

    img.src = image;
  };

  const findSolution = () => {
    setOnFinding(true);
    const startTime = Date.now();

    const worker = new Worker(new URL('../utils/worker.ts', import.meta.url), { type: 'module' });
    worker.postMessage([pieces, heuristic, rows, columns]);
    worker.onmessage = (e) => {
      try {
        const info = e.data as SolutionInfo;

        info.time = Date.now() - startTime;
        info.steps = info.solution.length - 1;

        setSolution(info);
        setOnFinding(false);
      } catch (e) {
        toast.error('Out of stack =))');
        clearStuff();
      }
    };

    setWorker(worker);
  };

  const stopFindSolution = () => {
    if (worker) {
      worker.terminate();
      setOnFinding(false);
      setWorker(undefined);
    }
  };

  const doSolve = (solution: number[][]) => {
    if (!solution.length) return;

    let lastMove = solution.shift()!;
    const solveInterval = setInterval(() => {
      if (solution.length === 0) {
        //TODO: Figure out why we need to clear interval here
        clearInterval(solveInterval);
        setSolution(undefined);
        setSolveInterval(undefined);
      } else {
        const move = solution.shift()!;

        doMove(getMoveDir(move, lastMove, columns), lastMove);
        lastMove = move;
      }
    }, 1000);

    setSolveInterval(solveInterval);
  };

  const stopSolving = () => {
    solveInterval && clearInterval(solveInterval);
    setSolveInterval(undefined);
  };

  useEffect(() => {
    setOnSolving(!!solveInterval);
  }, [solveInterval]);

  const handleSolving = () => {
    if (onSolving) {
      stopSolving();
    } else {
      doSolve(solution!.solution);
    }
  };

  const doClear = () => {
    clearStuff();

    const pieces = Array.from({ length: rows * columns - 1 }, (_, i) => i + 1);
    setPieces([...pieces, 0]);

    renderPuzzle(pieces);
  };

  const doShuffle = () => {
    clearStuff();

    let pieces;
    do {
      pieces = new Set<number>();
      while (pieces.size < rows * columns) {
        pieces.add(Math.floor(Math.random() * rows * columns));
      }
    } while (!isSolvable(Array.from(pieces)));

    setPieces(Array.from(pieces));
    renderPuzzle(Array.from(pieces));
  };

  const doMove = (direction: Direction, state?: number[]) => {
    const canvas = document.querySelector('canvas')!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    const cWidth = Math.ceil(canvas.width / columns);
    const cHeight = Math.ceil(canvas.height / rows);

    const indexOfCursor = state ? state.indexOf(0) : pieces.indexOf(0);
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

    const chooseBlockIndex = chooseBlockY * columns + chooseBlockX;
    const chooseBlock = state ? state[chooseBlockIndex] : pieces[chooseBlockIndex];

    const row = Math.floor((chooseBlock - 1) / columns);
    const col = chooseBlock - 1 - row * columns;

    img.onload = () => {
      const bWidth = Math.floor(img.width / columns);
      const bHeight = Math.floor(img.height / rows);

      const sx = col * bWidth;
      const sy = row * bHeight;

      const dx = cursorX * cWidth;
      const dy = cursorY * cHeight;

      let lastX = chooseBlockX * cWidth;
      let lastY = chooseBlockY * cHeight;

      const animate = setInterval(() => {
        if (lastX === dx && lastY === dy) {
          clearInterval(animate);
        } else {
          ctx.clearRect(lastX, lastY, cWidth, cHeight);

          lastX = Math.abs(lastX - dx) < 20 ? dx : lastX < dx ? lastX + 20 : lastX - 20;
          lastY = Math.abs(lastY - dy) < 20 ? dy : lastY < dy ? lastY + 20 : lastY - 20;

          ctx.drawImage(img, sx, sy, bWidth, bHeight, lastX, lastY, cWidth, cHeight);
        }
      }, 5);
    };

    setPieces((prev) => {
      const newPieces = [...prev];

      newPieces[chooseBlockIndex] = 0;
      newPieces[indexOfCursor] = chooseBlock;

      return newPieces;
    });

    img.src = image;
  };

  const clearStuff = () => {
    solveInterval && stopSolving();
    stopFindSolution();
  };

  const doRemove = () => {
    clearStuff();
    setImage('');
  };

  const handleClick = (e: any) => {
    clearStuff();

    const canvas = document.querySelector('canvas')!;
    const pos = canvas.getBoundingClientRect();

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
  };

  const isDisabled = !image || onFinding || onSolving;

  return (
    <Flex gap={4}>
      {image ? (
        <Box borderRadius={6} border='1px solid' borderColor='chakra-border-color' overflow='hidden'>
          <canvas onClick={handleClick} height='500px' width='500px'></canvas>
        </Box>
      ) : (
        <Dropzone onChange={handleDrop} />
      )}
      <Flex direction='column' gap={2} width='25rem'>
        <InputGroup>
          <InputLeftAddon>Size</InputLeftAddon>
          <Input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder='{number}x{number}'
            disabled={isDisabled}
          />
        </InputGroup>
        <Select value={heuristic} onChange={(e) => setHeuristic(e.target.value as Heuristic)} disabled={isDisabled}>
          <option value={Heuristic.MISPLACED}>{Heuristic.MISPLACED}</option>
          <option value={Heuristic.MANHATTAN}>{Heuristic.MANHATTAN}</option>
          <option value={Heuristic.UNKNOWN}>{Heuristic.UNKNOWN}</option>
        </Select>
        <Flex gap={2}>
          <Button onClick={doShuffle} variant='outline' w='100%' isDisabled={isDisabled}>
            Shuffle
          </Button>
          <Button onClick={doClear} variant='outline' w='100%' isDisabled={isDisabled}>
            Clear
          </Button>
          <Button onClick={doRemove} variant='outline' w='100%' isDisabled={isDisabled}>
            Remove
          </Button>
        </Flex>
        <Button
          onClick={findSolution}
          loadingText='Finding'
          isLoading={onFinding}
          isDisabled={isDisabled || !misplaced(pieces, rows, columns)}>
          Find Solution
        </Button>
        {onFinding && (
          <Button onClick={stopFindSolution} colorScheme='red'>
            Stop Finding
          </Button>
        )}
        {solution && (
          <Flex gap={2} justify='space-between' align='center'>
            <Box>
              <p>Time: {solution.time}ms</p>
              <p>Inspected Nodes: {solution.inspectedNodes}</p>
              <p>Steps: {solution.steps}</p>
            </Box>
            <Button onClick={() => handleSolving()} colorScheme={onSolving ? 'red' : 'gray'}>
              {onSolving ? 'Stop' : 'Solve'}
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
