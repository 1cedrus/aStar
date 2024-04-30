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
  UNKNOWN = 'Unknown',
}

export interface SolutionInfo {
  solution: number[][];
  time?: number;
  inspectedNodes: number;
  steps: number;
}
