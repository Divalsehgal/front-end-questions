# Learning Gist: Group By Type

### 🧠 The Core Logic
Categorize a mixed-type array into an object where keys are the item types and values are arrays containing the items.

### 🛠️ Implementation Strategy
1. **Reduce Pattern**: Use `Array.prototype.reduce` to initialize an accumulator object `{}`.
2. **Type Detection**:
   - `typeof item` works for primitives.
   - **Special case**: `null` (typeof is 'object').
   - **Special case**: `Array` (typeof is 'object'). Use `Array.isArray()`.
3. **Partitioning**: Group items by placing them into the corresponding array in the accumulator.

### 🚀 FAANG Interview Tips
- **Edge Cases**: Empty arrays, arrays with only one type, arrays with functions or undefined.
- **Complexity**: O(N) time and space.
- **Alternatives**: How would you handle custom class instances? (Check constructor name).

```typescript
function groupByType(arr) {
  return arr.reduce((acc, item) => {
    let type = typeof item;
    if (item === null) type = 'null';
    else if (Array.isArray(item)) type = 'array';
    
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});
}
```
