# Learning Gist: Feature Flag Orchestration

### 🧠 The Core Logic
Implement a remote configuration system that allows toggling features without re-deploying code. Mastering use of React Context and custom hooks for global state.

### 🛠️ Implementation Strategy
1. **Context Provider**: Create a `FeatureFlagProvider` that fetches flags from a remote API (or mock) and stores them in state.
2. **Provider Pattern**: Wrap the application to ensure flags are accessible to any consumer.
3. **Custom Hook**: Implement `useFeatureFlag(flagName)` to make consumption easy and type-safe.
4. **Dynamic Evaluation**: Support static booleans OR dynamic functions that evaluate based on user context (e.g., role, ID).

### 🚀 FAANG Interview Tips
- **Performance**: Discuss how to prevent components from re-rendering every time the flag state updates (Memoization, Selector patterns).
- **Latency**: How to handle components that need flags during initial load? (Loading state vs. Default values).
- **Scalability**: Strategies for managing hundreds of flags (Namespacing, Layering).

```typescript
const FeatureFlagContext = createContext();

export function useFeatureFlag(name) {
  const { flags } = useContext(FeatureFlagContext);
  return flags[name] ?? false;
}
```
