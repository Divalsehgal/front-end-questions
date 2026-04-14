# Redux Core Principles

Redux maintains a **single state object (store)** that represents the entire app state, which is updated immutably through actions and reducers.

---

## Immutability is Crucial

If you mutate state directly, React won't realize anything changed because the object reference in memory remains exactly the same!

### ❌ What not to do (Mutation)

```javascript
const obj = { count: 0 };

obj.count = 1;  
setState(obj); 

// React thinks nothing happened! (Same reference → skip render ✅)
```

### ✅ What you should do (Immutable Update)

```javascript
setState({ ...obj, count: 1 }); 

// React detects the new object! (New reference → triggers re-render ❌)
```

*> Memoization only works when references are stable.*

---

## Slices

**Slices** help structure the global state into independent, logical, modular parts.

When one slice updates, **only components subscribed to that specific slice re-render** due to reference changes. This prevents the entire application from re-rendering every time any minor value in the store changes.

---

## Context API vs Redux

Both tools help solve **prop drilling** by providing centralized, accessible global state. However, they are fundamentally optimized for different architectural patterns based on state frequency and scale.

### React Context API

- **Design Intent:** Best used when you only need **certain, specific states** to be centralized or abstracted globally.
- **Ideal Use Cases:** Low-frequency updates where state changes rarely, such as Theme configurations (dark/light mode), User Authentication (logged in/out), or Locale language settings.
- **Performance Pitfall:** Context is essentially a dependency injector. When the Context Provider value changes, **every single component** consuming that context automatically re-renders. Without careful memoization, using Context for rapidly changing, heavy application state can cause massive performance bottlenecks.

### Redux (Redux Toolkit)

- **Design Intent:** Built for highly complex applications managing massive, constantly evolving global states.
- **Architectural Power:** Redux is more robust and heavily optimized out of the box. As noted above with **Slices**, Redux inherently prevents unnecessary renders—a component only renders if the exact slice of data it is subscribed to changes.
- **Beyond State Holding:** Redux provides strictly predictable state mutations (Reducers), incredible debugging capabilities via Redux DevTools (Time Travel debugging), and standardized infrastructure (Middlewares like Thunk or Saga) for managing complex asynchronous data flow.

### ⚖️ When to Use What? (Rule of Thumb)

**Use the Context API when...**

- The global data is nearly static or updates very infrequently.
- The state naturally applies to a specific subset/wrapper of components instead of the entire app.
- You are trying to avoid heavy boilerplate just to pass a simple prop down multiple levels.
- **Classic Examples:** Active Theme (Dark/Light), User Identity/Auth object, Locale translation strings.

**Use Redux when...**

- You have large amounts of application state spanning completely disparate parts of the app.
- The state updates very frequently over time (e.g., trading dashboards, chat interfaces).
- The state update logic is extremely complex and you need granular, traceable logs of exactly *when, why, and how* state mutated.
- You deliberately need powerful middleware integrations (e.g., complex API caching layers).
- **Classic Examples:** Heavy E-Commerce Stores (Cart/Inventory syncing), Live Data feeds, deeply nested complex form builders.
