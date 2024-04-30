import { Node, SolutionInfo } from '@/types.ts';
import { PriorityQueue } from '@datastructures-js/priority-queue';

export function isGoalState(state: number[], rows: number, cols: number) {
  return state.every((value, index) => (index !== rows * cols - 1 ? value === index + 1 : !value));
}

export function getPath(parents: Map<string, number[]>, state: number[]) {
  const path = [state];

  while (parents.has(state.toString())) {
    state = parents.get(state.toString())!;
    path.unshift(state);
  }

  return path;
}

export function getNeighbors(state: number[], rows: number, cols: number) {
  const indexOfCursor = state.indexOf(0);
  const cursorY = Math.floor(indexOfCursor / cols);
  const cursorX = indexOfCursor - cursorY * cols;

  const neighbors: number[][] = [];

  cursorX > 0 && neighbors.push(state.toSpliced(indexOfCursor - 1, 2, 0, state[indexOfCursor - 1]));

  cursorY > 0 &&
    neighbors.push(
      state
        .toSpliced(indexOfCursor, 1, state[cursorX + (cursorY - 1) * rows])
        .toSpliced(cursorX + (cursorY - 1) * rows, 1, 0),
    );

  cursorX < cols - 1 && neighbors.push(state.toSpliced(indexOfCursor, 2, state[indexOfCursor + 1], 0));

  cursorY < rows - 1 &&
    neighbors.push(
      state
        .toSpliced(indexOfCursor, 1, state[cursorX + (cursorY + 1) * rows])
        .toSpliced(cursorX + (cursorY + 1) * rows, 1, 0),
    );

  return neighbors;
}

export function aStar(
  startState: number[],
  heuristic: (state: number[], rows: number, cols: number) => number,
  rows: number,
  cols: number,
) {
  const visited = new Set<string>();
  const queue = new PriorityQueue<Node>((a, b) => a.cost - b.cost);
  const parents = new Map<string, number[]>();
  const costs = new Map<string, number>();

  queue.push({ state: startState, cost: heuristic(startState, rows, cols) });
  costs.set(startState.toString(), 0);

  while (queue.size() > 0) {
    const { state } = queue.pop()!;

    if (isGoalState(state, rows, cols)) {
      return {
        solution: getPath(parents, state),
        inspectedNodes: visited.size,
      } as SolutionInfo;
    }

    visited.add(state.toString());

    for (const neighbor of getNeighbors(state, rows, cols)) {
      if (visited.has(neighbor.toString())) continue;

      const newCost = costs.get(state.toString())! + 1;
      const oldCost = costs.get(neighbor.toString());
      if (!oldCost || newCost < oldCost) {
        costs.set(neighbor.toString(), newCost);
        parents.set(neighbor.toString(), state);

        queue.push({ state: neighbor, cost: newCost + heuristic(neighbor, rows, cols) });
      }
    }
  }

  throw new Error('No solution found');
}
