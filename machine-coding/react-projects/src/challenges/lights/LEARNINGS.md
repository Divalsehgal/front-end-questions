# Learning Gist: Traffic Light System

### 🧠 The Core Logic
Implementing a State Machine to cycle through a sequence of colors with varying durations.

### 🛠️ Implementation Strategy
1. **Config Object**: Define the sequence and durations `{ red: 4000, yellow: 1000, green: 3000 }`.
2. **State Management**: Current active light color.
3. **Timer Chain**: Use a recursive `setTimeout` or a `useEffect` that updates the state and sets a new timer based on the CURRENT color's duration.
4. **Cleanup**: Clear the timer on unmount.

### 🚀 FAANG Interview Tips
- **State Machine**: Discuss why this is a finite state machine (FSM). Red -> Green -> Yellow -> Red.
- **Dynamic Config**: How to easily change the order or timing without touching the core logic? (Pass the config as a prop).

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    setLight(nextLight[light]);
  }, durations[light]);
  return () => clearTimeout(timer);
}, [light]);
```
