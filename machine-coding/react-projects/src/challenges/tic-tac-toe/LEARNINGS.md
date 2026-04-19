
#### 1. Correct Array Initialization

Avoid `Array(3).fill(Array(3).fill(null))` as it creates rows that reference the same memory address. This implementation uses nested `Array.from` to ensure each cell is a unique object.

```javascript
const tictac = Array.from({ length: 3 }, () =>
  Array.from({ length: 3 }, () => ({ value: "", player: "" })),
);
```

#### 2. Input Validation (Safety First)

A move should only be processed if:

- The cell is currently empty.
- There is no winner yet.
Missing these checks is a cardinal sin in coding interviews.

```javascript
const clickHandler = (i, j) => {
  if (winner) return; // Stop if game over
  if (board[i][j].value) return; // Stop if cell filled
  // Proceed with move...
};
```

#### 3. Winner Detection (The "Flat" Hack)

Instead of writing complex nested loops for rows, columns, and diagonals, we flatten the 2D board and check against index combinations. This keeps the logic readable and easy to maintain.
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6],             // Diagonals
];

```javascript

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6],             // Diagonals
];

const checkWinner = (board) => {
  const flat = board.flat();
  for (let [a, b, c] of WINNING_COMBINATIONS) {
    const p = flat[a].player;
    if (p && p === flat[b].player && p === flat[c].player) return p;
  }
  return null;
};
```

### 🛠️ Implementation Strategy Roundup

- **Unidirectional Data Flow**: Using mapping functions to return a brand new board state rather than mutating.
- **Effect-Driven Wins**: Using `useEffect` to trigger the winner check immediately after any board update.
- **Premium Aesthetics**: Maintaining a high level of UI polish without overcomplicating the underlying state.
