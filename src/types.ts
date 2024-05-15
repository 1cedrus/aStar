export interface Props {
  children?: React.ReactNode;
  className?: string;
}

export interface Node {
  state: number[];
  cost: number;
}

export enum Heuristic {
  MISPLACED = 'Misplaced',
  MANHATTAN = 'Manhattan',
  INVERSION = 'Inversion',
  MANHATTAN_WITH_LINEAR_CONFLICT = 'Manhattan + Linear Conflict',
  UNKNOWN = 'unknown (Not Optimal)',
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
