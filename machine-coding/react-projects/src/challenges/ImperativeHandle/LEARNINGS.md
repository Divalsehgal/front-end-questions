# Learning Gist: useImperativeHandle

### 🧠 The Core Logic
Exposing custom functions from a child component to a parent component via a `ref`.

### 🛠️ Implementation Strategy
1. **forwardRef**: Wrap the child component in `forwardRef((props, ref) => { ... })`.
2. **Hook**: Call `useImperativeHandle(ref, () => ({ ... }), [deps])`.
3. **Control**: Expose methods like `focus()`, `scroll()`, or `clear()` that the parent can trigger.
4. **Parent usage**: The parent creates a `ref = useRef()` and passes it to the child.

### 🚀 FAANG Interview Tips
- **Best Practices**: Why should this hook be used sparingly? (Breaks the declarative nature of React; use it only for focus/scroll/animations that are hard to do with props).
- **Communication**: Contrast this with standard prop-drilling or callbacks.

```javascript
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus(),
  shake: () => setShaking(true)
}));
```
