# Learning Gist: useReducer Todo List

### 🧠 The Core Logic
Managing complex state transitions using a Reducer pattern instead of multiple `useState` hooks.

### 🛠️ Implementation Strategy
1. **Action-Based Logic**: Define a `reducer(state, action)` function with a switch/case for `ADD`, `TOGGLE`, `DELETE`.
2. **Pure Function**: Ensure the reducer is a pure function (no side effects, always returns a new state object).
3. **Dispatch**: Use `dispatch({ type: 'ADD', payload: text })` to trigger updates.
4. **State Structure**: `{ todos: [], count: 0 }`.

### 🚀 FAANG Interview Tips
- **Performance**: Why use `useReducer` over `useState`? (Better for complex state dependencies, easier to test in isolation).
- **Architecture**: How to share the dispatcher? (Context API + useReducer = Lightweight Redux).

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'ADD': return [...state, { id: Date.now(), text: action.payload }];
    // ...
  }
}
```
