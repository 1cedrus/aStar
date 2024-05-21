// import { Map } from 'immutable';

export class WalkingDatabase {
  parents: Map<string, number[][]>;
  costs: Map<string, number>;
  queue: Array<number[][]>;
  visited: Set<string>;
  rows?: number;
  cols?: number;

  cache: Map<string, number> = new Map();

  clearCache() {
    this.visited.clear();
    this.parents.clear();
    this.queue = [];
    this.cache.clear();
    this.costs = new Map();
  }

  constructor() {
    this.parents = new Map();
    this.queue = [];
    this.visited = new Set();
    this.cache = new Map();
    this.costs = new Map();
    this.init(3, 3);
  }

  stepsToGoal(state: number[][]) {
    return this.costs.get(state.toString())!;
  }

  init(rows: number, cols: number) {
    if (this.rows === rows && this.cols === cols) return;

    this.rows = rows;
    this.cols = cols;
    this.clearCache();

    const startState = this.generateStartState(rows, cols);
    this.queue.unshift(startState);
    this.visited.add(startState.toString());
    this.costs.set(startState.toString(), 0);

    while (this.queue.length > 0) {
      const state = this.queue.shift()!;

      const neighbors = this.getNeighbors(state, rows, cols);
      for (const neighbor of neighbors) {
        const neighborKey = neighbor.toString();

        this.parents.set(neighborKey, state);
        this.queue.push(neighbor);
        this.costs.set(neighborKey, this.costs.get(state.toString())! + 1);
      }
    }

    if (this.rows !== this.cols) {
      const startState = this.generateStartState(cols, rows);
      this.queue.unshift(startState);
      this.visited.add(startState.toString());
      this.costs.set(startState.toString(), 0);

      while (this.queue.length > 0) {
        const state = this.queue.shift()!;

        const neighbors = this.getNeighbors(state, cols, rows);
        for (const neighbor of neighbors) {
          const neighborKey = neighbor.toString();

          this.parents.set(neighborKey, state);
          this.queue.push(neighbor);
          this.costs.set(neighborKey, this.costs.get(state.toString())! + 1);
        }
      }
    }
  }

  getNeighbors(state: number[][], rows: number, _cols: number) {
    const neighbors: number[][][] = [];

    const indexOfCursor = state.findIndex((row) => row.includes(0));

    if (indexOfCursor > 0) {
      const rowAbove = state[indexOfCursor - 1];
      const rowOfCursor = state[indexOfCursor];

      rowAbove.forEach((value, index) => {
        const newRowAbove = rowAbove.toSpliced(index, 1, 0);
        const newRowOfCursor = rowOfCursor.toSpliced(0, 1, value);

        const neighbor = state.toSpliced(indexOfCursor - 1, 2, newRowAbove.toSorted(), newRowOfCursor.toSorted());

        if (!this.visited.has(neighbor.toString())) {
          neighbors.push(neighbor);
          this.visited.add(neighbor.toString());
        }
      });
    }

    if (indexOfCursor < rows - 1) {
      const rowBelow = state[indexOfCursor + 1];
      const rowOfCursor = state[indexOfCursor];

      rowBelow.forEach((value, index) => {
        const newRowBelow = rowBelow.toSpliced(index, 1, 0);
        const newRowOfCursor = rowOfCursor.toSpliced(0, 1, value);

        const neighbor = state.toSpliced(indexOfCursor, 2, newRowOfCursor.toSorted(), newRowBelow.toSorted());

        if (!this.visited.has(neighbor.toString())) {
          neighbors.push(neighbor);
          this.visited.add(neighbor.toString());
        }
      });
    }

    return neighbors;
  }

  generateStartState(rows: number, cols: number) {
    const startState: number[][] = [];

    for (let i = 0; i < rows; i++) {
      startState.push(Array.from({ length: cols }, (_) => i + 1));
    }
    startState[rows - 1][0] = 0;

    return startState;
  }
}

export default new WalkingDatabase();
