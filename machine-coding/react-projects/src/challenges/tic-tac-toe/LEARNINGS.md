# Learning Gist: Tic-Tac-Toe Game

### 🧠 The Core Logic
Managing a 2D grid state (3x3) and implementing win/draw detection logic.

### 🛠️ Implementation Strategy
1. **Flat State**: Use a 1D array of 9 elements `[null, null, ...]` for the board (easier to manage than 2D).
2. **Turn Management**: Use a boolean `isXNext` to toggle between 'X' and 'O'.
3. **Win Check**: Hardcode the winning combinations (rows, cols, diagonals) and check if any combination is filled by the same player.
4. **Draw Detection**: If all squares are filled and no winner is found.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on why we check for a winner on every move (small grid) vs more optimized approaches for larger grids.
- **Scalability**: How would you handle an N x N grid? (Track row/col/diag counts in O(1) per move).

```javascript
const lines = [[0,1,2], [3,4,5], [6,7,8], ...];
for (let [a, b, c] of lines) {
  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
}
```
