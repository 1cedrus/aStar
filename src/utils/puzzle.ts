import { Direction } from '@/types.ts';

export function getMoveDir(move: number[], pieces: number[], columns: number) {
  const indexOfCursor = pieces.indexOf(0);
  const newIndexOfCursor = move.indexOf(0);

  if (newIndexOfCursor - indexOfCursor === 1) return Direction.RIGHT;
  else if (newIndexOfCursor - indexOfCursor === -1) return Direction.LEFT;
  else if (newIndexOfCursor - indexOfCursor === columns) return Direction.DOWN;
  else return Direction.UP;
}

export function isSolvable(state: number[], rows: number, cols: number) {
  let inversions = 0;

  for (let i = 0; i < state.length; i++) {
    if (!state[i]) continue;
    for (let j = i + 1; j < state.length; j++) {
      if (!state[j]) continue;

      if (state[i] > state[j]) {
        inversions++;
      }
    }
  }

  if (cols % 2) {
    return inversions % 2 === 0;
  } else {
    const indexOfCursor = state.indexOf(0);
    const cursorY = Math.floor(indexOfCursor / cols);

    return (rows - cursorY - 1) % 2 ? inversions % 2 === 1 : inversions % 2 === 0;
  }
}
