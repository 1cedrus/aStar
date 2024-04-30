import { aStar } from '@/utils/astar.ts';
import { Heuristic } from '@/types.ts';
import { manhattan, misplaced, unknown } from '@/utils/heuristics.ts';

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
    default:
      throw new Error('Invalid heuristic');
  }

  const solution = aStar(state, heuristicFunc, rows, cols);

  postMessage(solution);
};
