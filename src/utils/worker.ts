import { aStar } from '@/utils/astar.ts';
import { Heuristic } from '@/types.ts';
import {
  inversion,
  manhattan,
  manhattanWithInversion,
  manhattanWithLinearConflict,
  misplaced,
  unknown,
} from '@/utils/heuristics.ts';

onmessage = (e) => {
  const [state, heuristic, rows, cols] = e.data;

  let heuristicFunc: (state: number[], rows: number, cols: number) => number;
  switch (heuristic) {
    case Heuristic.MISPLACED:
      heuristicFunc = misplaced;
      break;
    case Heuristic.MANHATTAN:
      heuristicFunc = manhattan;
      break;
    case Heuristic.UNKNOWN:
      heuristicFunc = unknown;
      break;
    case Heuristic.INVERSION:
      heuristicFunc = inversion;
      break;
    case Heuristic.MANHATTAN_WITH_LINEAR_CONFLICT:
      heuristicFunc = manhattanWithLinearConflict;
      break;
    default:
      throw new Error('Invalid heuristic');
  }

  const solution = aStar(state, heuristicFunc, rows, cols);

  postMessage(solution);
};
