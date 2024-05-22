import { aStar } from '@/utils/astar.ts';
import { Heuristic } from '@/types.ts';
import { inversion, manhattan, manhattanWithLinearConflict, misplaced, walkingDistance } from '@/utils/heuristics.ts';

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
    case Heuristic.INVERSION:
      heuristicFunc = inversion;
      break;
    case Heuristic.MANHATTAN_WITH_LINEAR_CONFLICT:
      heuristicFunc = manhattanWithLinearConflict;
      break;
    case Heuristic.WALKING:
      heuristicFunc = walkingDistance;
      break;
    default:
      throw new Error('Invalid heuristic');
  }

  const start = performance.now();
  const solution = aStar(state, heuristicFunc, rows, cols);
  const end = performance.now();

  solution.time = end - start;

  postMessage(solution);
};
