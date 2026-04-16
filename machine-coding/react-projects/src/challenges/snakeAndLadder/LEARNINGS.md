# Learning Gist: Snake & Ladder Logic

### 🧠 The Core Logic
Implementing game mechanics on a 1D state that maps to a 2D board visualization.

### 🛠️ Implementation Strategy
1. **Board Data**: Use an object/Map to store the jumps (e.g., `{ 15: 5, 20: 45 }` where keys are starts and values are ends).
2. **Current Position**: Manage a `position` state for each player.
3. **Roll Logic**: `Math.floor(Math.random() * 6) + 1`. 
4. **Snakes/Ladders Check**: After moving, check if `jumps[newPos]` exists; if so, update position again.
5. **Win Condition**: Position >= 100.

### 🚀 FAANG Interview Tips
- **UI Architecture**: How to map a 1D index (0-99) to a 2D grid coordinates (x, y) for visualization? (Hint: Use `% 10` for x and `/ 10` for y, but account for the "Boustrophedon" pattern where even/odd rows reverse direction).

```javascript
const jumps = { 16: 6, 47: 26, 49: 11, 56: 53, ... };
const newPos = current + roll;
const finalPos = jumps[newPos] || newPos;
```
