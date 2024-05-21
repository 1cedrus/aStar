import { Direction } from '@/types.ts';
import { verticalInversion } from '@/utils/heuristics.ts';

export function getMoveDir(move: number[], pieces: number[], columns: number) {
  const indexOfCursor = pieces.indexOf(0);
  const newIndexOfCursor = move.indexOf(0);

  if (newIndexOfCursor - indexOfCursor === 1) return Direction.RIGHT;
  else if (newIndexOfCursor - indexOfCursor === -1) return Direction.LEFT;
  else if (newIndexOfCursor - indexOfCursor === columns) return Direction.DOWN;
  else return Direction.UP;
}

export function isSolvable(state: number[], rows: number, cols: number) {
  const inversions = verticalInversion(state);

  if (cols % 2) {
    return inversions % 2 === 0;
  } else {
    const indexOfCursor = state.indexOf(0);
    const cursorY = Math.floor(indexOfCursor / cols);

    return (rows - cursorY - 1) % 2 ? inversions % 2 === 1 : inversions % 2 === 0;
  }
}
