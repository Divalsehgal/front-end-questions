# Learning Gist: Checkbox Logic (Indeterminate State)

### 🧠 The Core Logic
Managing a parent-child relationship between checkboxes where the parent's state depends on its children's collective state.

### 🛠️ Implementation Strategy
1. **Derived State**: Instead of storing the parent's state separately, derive it from the children array.
2. **Three States**:
   - `checked`: All children are true.
   - `unchecked`: All children are false.
   - `indeterminate`: SOME children are true, some are false.
3. **DOM API**: React's `checked` prop only supports true/false. To show the horizontal "dash" for indeterminate, you MUST directly set the `indeterminate` property on the input DOM node using a `ref`.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on why we use `every()` and `some()` for O(N) derived state.
- **Data Structure**: Usually an array of objects `{ id, label, isChecked }`.
- **Keyboard UX**: Ensure `Space` toggles the correct group state.

```tsx
const isAllChecked = items.every(i => i.checked);
const isSomeChecked = items.some(i => i.checked);

useEffect(() => {
  if (ref.current) {
    ref.current.indeterminate = !isAllChecked && isSomeChecked;
  }
}, [items]);
```
