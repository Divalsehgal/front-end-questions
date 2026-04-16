# Learning Gist: Countdown Timer

### 🧠 The Core Logic
Managing precise time intervals and ensuring state synchronicity.

### 🛠️ Implementation Strategy
1. **State**: Store `timeLeft` in seconds.
2. **Interval**: Use `setInterval` inside a `useEffect`.
3. **Cleanup**: CRITICAL. Clear the interval in the `useEffect` return to prevent memory leaks and double timers.
4. **Calculations**: Use `Math.floor(time / 60)` for minutes and `time % 60` for seconds.

### 🚀 FAANG Interview Tips
- **Accuracy**: Discuss why `setInterval` isn't perfect (it can drift). For high precision, compare start time with `Date.now()`.
- **Backgrounding**: What happens when the tab is inactive? (Browsers throttle timers).

```tsx
useEffect(() => {
  if (isRunning && time > 0) {
    const id = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(id);
  }
}, [isRunning, time]);
```
