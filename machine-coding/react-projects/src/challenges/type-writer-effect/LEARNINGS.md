# Learning Gist: Typewriter Effect

### 🧠 The Core Logic
Simulating human typing by gradually appending characters from a string to the DOM over time.

### 🛠️ Implementation Strategy
1. **State**: Use `displayText` to hold the currently visible substring.
2. **Timing**: Use `setInterval` or recursive `setTimeout` to add one character every X milliseconds.
3. **Cursor Logic**: Append a vertical bar `|` that blinks via CSS animations.
4. **Cleanup**: Clear the timer in the `useEffect` cleanup.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on why this should be handled by a side effect vs purely CSS (CSS `@keyframes` can animate text using `overflow` and `border`, but React state is better for dynamic/multiline text).
- **Concurrency**: How to handle a prop change while the previous string is still "typing"? (Reset index to 0 and clear the old timer).

```tsx
const [text, setText] = useState("");
useEffect(() => {
  const timer = setInterval(() => {
    setText(fullText.slice(0, text.length + 1));
  }, speed);
  return () => clearInterval(timer);
}, [text]);
```
