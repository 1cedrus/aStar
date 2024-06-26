export interface Props {
  children?: React.ReactNode;
  className?: string;
}

export interface Node {
  state: number[];
  cost: number;
}

export enum Heuristic {
  MISPLACED = 'Misplaced (Hamming Distance)',
  MANHATTAN = 'Manhattan Distance',
  INVERSION = 'Inversion Distance',
  WALKING = 'Walking Distance',
  MANHATTAN_WITH_LINEAR_CONFLICT = 'Manhattan + Linear Conflict',
}

export interface SolutionInfo {
  solution: number[][];
  time: number;
  inspectedNodes: number;
  steps: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}
