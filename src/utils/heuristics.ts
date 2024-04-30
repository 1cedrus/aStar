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

export function unknown(state: number[], _rows: number, cols: number) {
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

  return count - 0.15 * count;
}
