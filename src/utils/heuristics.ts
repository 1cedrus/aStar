export function misplaced(state: number[], _rows: number, _cols: number) {
  let count = 0;

  for (let i = 0; i < state.length; i++) {
    if (state[i] && state[i] !== i + 1) {
      count += 1;
    }
  }

  return count;
}

export function manhattan(state: number[], _rows: number, cols: number) {
  let count = 0;

  for (let i = 0; i < state.length; i++) {
    if (state[i]) {
      const targetX = (state[i] - 1) % cols;
      const targetY = Math.floor((state[i] - 1) / cols);

      const cursorX = i % cols;
      const cursorY = Math.floor(i / cols);

      count += Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY);
    }
  }

  return count;
}

export function manhattanWithLinearConflict(state: number[], rows: number, cols: number) {
  return manhattan(state, rows, cols) + linearConflict(state, rows, cols);
}

export function unknown(state: number[], rows: number, cols: number) {
  let count = 0;

  for (let i = 0; i < state.length; i++) {
    let targetX;
    let targetY;
    if (state[i]) {
      targetX = (state[i] - 1) % cols;
      targetY = Math.floor((state[i] - 1) / cols);
    } else {
      targetX = (state.length - 1) % cols;
      targetY = Math.floor((state.length - 1) / cols);
    }

    const cursorX = i % cols;
    const cursorY = Math.floor(i / cols);

    count += Math.pow(Math.abs(targetX - cursorX), 2) + Math.pow(Math.abs(targetY - cursorY), 2);
  }

  const linearConflictCount = linearConflict(state, rows, cols);

  return count - 0.15 * count + linearConflictCount;
}

export function inversion(state: number[], rows: number, cols: number) {
  const vertical = verticalInversion(state);
  const horizontal = horizontalInversion(state, rows, cols);

  return (
    Math.floor(vertical / (cols - 1)) +
    (vertical % (cols - 1)) +
    Math.floor(horizontal / (rows - 1)) +
    (horizontal % (rows - 1))
  );
}

export function verticalInversion(state: number[]) {
  let count = 0;

  for (let i = 0; i < state.length; i++) {
    if (!state[i]) continue;
    for (let j = i + 1; j < state.length; j++) {
      if (!state[j] || state[i] < state[j]) {
        continue;
      }

      count += 1;
    }
  }

  return count;
}

export function horizontalInversion(state: number[], rows: number, cols: number) {
  const mirror: number[] = Array.from({ length: state.length });
  let idx = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      mirror[idx] = j * cols + i + 1;
      idx++;
    }
  }
  mirror[mirror.length - 1] = 0;

  const horizontal: number[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const value = state[j * cols + i];
      if (!value) {
        horizontal.push(0);
      } else {
        horizontal.push(mirror.indexOf(value) + 1);
      }
    }
  }

  return verticalInversion(horizontal);
}

export function linearConflict(state: number[], rows: number, cols: number) {
  let count = 0;

  for (let i = 0; i < state.length - 2; i++) {
    if (i % cols === cols - 1) continue;

    if (state[i] === i + 2 && state[i + 1] === i + 1) {
      count += 2;
    }
  }

  for (let i = 0; i < state.length - cols - 1; i++) {
    if (Math.floor(i / cols) === rows - 1) break;

    if (state[i] === i + cols + 1 && state[i + cols] === i + 1) {
      count += 2;
    }
  }

  return count;
}

export function walkingDistance(state: number[], rows: number, cols: number) {
  walkingDatabase.init(rows, cols);

  const vertical: number[][] = [];
  for (let i = 0; i < rows; i++) {
    vertical.push([]);
    for (let j = 0; j < cols; j++) {
      vertical[i].push(Math.ceil(state[i * cols + j] / cols));
    }

    vertical[i].sort();
  }

  const horizontal: number[][] = [];
  for (let i = 0; i < cols; i++) {
    horizontal.push([]);
    for (let j = 0; j < rows; j++) {
      if (!state[j * cols + i]) {
        horizontal[i].push(0);
      } else {
        horizontal[i].push(Math.ceil(state[j * cols + i] % cols === 0 ? cols : state[j * cols + i] % cols));
      }
    }

    horizontal[i].sort();
  }

  return walkingDatabase.stepsToGoal(vertical) + walkingDatabase.stepsToGoal(horizontal);
}
