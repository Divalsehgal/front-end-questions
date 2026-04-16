# Learning Gist: Transfer List

### 🧠 The Core Logic
Managing the bidirectional movement of items between two distinct lists. Tests selection logic and array filtering.

### 🛠️ Implementation Strategy
1. **Selection State**: Track which items are currently "checked" in each list.
2. **Move Logic**:
   - `moveToRight`: Filter checked items from Left -> Add to Right -> Clear selection.
   - `moveAll`: Append all items from one list to the other -> Clear source list.
3. **Optimized Filtering**: Use Sets or ID comparisons for O(1) matching during the move operations.

### 🚀 FAANG Interview Tips
- **Performance**: How would you handle 10,000 items? (Virtualization).
- **Search**: Adding a search filter for each list without losing the checked state.

```tsx
const moveRight = () => {
  setRight([...right, ...selectedLeft]);
  setLeft(left.filter(item => !selectedLeft.includes(item)));
  setSelectedLeft([]);
};
```
