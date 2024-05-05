export function misplaced(state: number[], _rows: number, _cols: number) {
  let count = 0;

  for (let i = 0; i < state.length; i++) {
    if (state[i] === 0 && i !== state.length - 1) {
      count += 1;
    } else if (state[i] !== 0 && state[i] !== i + 1) {
      count += 1;
    }
  }

  return count;
}

export function manhattan(state: number[], _rows: number, cols: number) {
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

    count += Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY);
  }

  return count;
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

  // Linear conflict
  let a = 0;
  for (let i = 0; i < state.length; i++) {
    if (i % cols === cols - 1) continue;

    if (i === state.length - 2 && state[i + 1] === i + 1 && state[i] === 0) {
      a += 2;
    } else if (state[i] === i + 2 && state[i + 1] === i + 1) {
      a += 2;
    }
  }

  for (let i = 0; i < state.length; i++) {
    if (Math.floor(i / cols) === rows - 1) break;

    if (i === state.length - cols - 1 && state[i + cols] === i + 1 && state[i] === 0) {
      a += 2;
    } else if (state[i] === i + cols + 1 && state[i + cols] === i + 1) {
      a += 2;
    }
  }

  return count - 0.15 * count + a;
}

export function inversion(state: number[], rows: number, cols: number) {
  let vertical = 0;
  let horizontal = 0;

  for (let i = 0; i < state.length; i++) {
    if (!state[i]) continue;
    for (let j = 0; j < i; j++) {
      if (!state[j]) continue;

      if (state[i] < state[j]) {
        vertical++;
      }
    }
  }

  const mirror: number[] = Array.from({ length: state.length });
  let idx = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      mirror[idx] = j * rows + i + 1;
      idx++;
    }
  }

  for (let i = 0; i < state.length; i++) {
    if (!state[i]) continue;
    const indexOfIInMirror = mirror.indexOf(state[i]);
    horizontal += Math.abs(indexOfIInMirror - (mirror[i] - 1));
  }

  return (
    Math.floor(vertical / (cols - 1)) +
    (vertical % (cols - 1)) +
    Math.floor(horizontal / (rows - 1)) +
    (horizontal % (rows - 1))
  );
}

export function manhattanWithInversion(state: number[], rows: number, cols: number) {
  return Math.max(manhattan(state, rows, cols), inversion(state, rows, cols));
}
