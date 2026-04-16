# Advanced React Context Patterns

## 1. Separating State and Actions

This pattern involves splitting a single Context into two: one for the **Data (State)** and one for the **Functions (Actions)** that update that data.

### 🎭 Why do we need this?

In standard React Context, any component that consumes the context (via `useContext`) will **re-render whenever any part of the context value changes.**

*   **The Problem:** If you have a `Display` component using the data and an `Update` component using `setValue`, and you put them in one object `{{ value, setValue }}`, the `Update` component will re-render every time `value` changes! In complex apps, this causes a "waterfall" of unnecessary renders.
*   **The Solution:** By splitting them, components that only need to trigger actions (like buttons) consume the **Actions Context**. Since functions are stable (if memoized), these components **never re-render** when the data changes.

### 🚀 Implementation Example

```tsx
// Separate Contexts
const StateContext = createContext<State | undefined>(undefined);
const ActionsContext = createContext<Actions | undefined>(undefined);

export const Provider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Memoize actions so the reference never changes
  const actions = useMemo(() => ({
    updateValue: (val) => setState(val)
  }), []);

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </ActionsContext.Provider>
  );
};
```

### 💎 Detailed Benefits of Splitting

*   **Render Isolation:** Components using only `useActions()` **never re-render** when the state changes.
*   **Stable Function References:** Custom hooks like `useActions` provide functions that don't change between renders, preventing unnecessary `useEffect` triggers in child components.
*   **Clearer API:** It distinguishes between "Read-only" views and "Interaction-only" controls.

### 🛑 When is it NOT right?

1.  **Low-Frequency Updates:** If your state only changes once (e.g., Auth status, User Settings), the overhead of splitting contexts is not worth the zero performance gain.
2.  **Small Trees:** If you only have a few components, React's re-rendering is so fast that you won't notice a difference. Don't over-engineer.
3.  **Tightly Coupled Usage:** If every component that uses an action *also* needs to show the state, you get no benefit but double the boilerplate.
4.  **Complex State Management:** If your state management logic is so big that you're splitting 10 contexts, use **Zustand** or **Redux** instead. They solve this problem natively using "Selectors".

---

## 2. Provider Composer Utility

As your application grows, your `App.jsx` can become "nested provider hell" (The Pyramid of Doom):

```jsx
<AuthProvider>
  <ThemeProvider>
    <SettingsProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </SettingsProvider>
  </ThemeProvider>
</AuthProvider>
```

### 🛠️ The Solution: `ProviderComposer`

A simple utility that takes an array of providers and nests them dynamically using `reduceRight`.

### 🚀 Why use this?

*   **Flattened Entry Point:** Your `App.jsx` remains perfectly vertical. No more code shifting to the right.
*   **Cleaner Git Diffs:** Adding a new provider is just **adding a single line to an array**. You don't have to re-indent 20 other lines, which keeps your pull requests clean.
*   **DevTools Optimization:** It reduces the "visual stairs" in the React DevTools, making it easier to find your actual application content.
*   **Decoupled Architecture:** It treats your global services as a "Stack," making it clear which services wrap others without the mess of deep nesting.

**Implementation:**
```tsx
const ProviderComposer = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight((acc, provider) => {
        return React.cloneElement(provider, {}, acc);
      }, children)}
    </>
  );
};
```

**Usage:**
```jsx
<ProviderComposer
  providers={[
    <AuthProvider key="auth" />,
    <ThemeProvider key="theme" />,
    <SettingsProvider key="settings" />
  ]}
>
  <AppContent />
</ProviderComposer>
```

This keeps your entry point clean, readable, and easy to maintain.
