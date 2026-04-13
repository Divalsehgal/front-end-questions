# Redux Core Principles

Redux maintains a **single state object (store)** that represents the entire app state, which is updated immutably through actions and reducers.

---

## Immutability is Crucial

If you mutate state directly, React won't realize anything changed because the object reference in memory remains exactly the same!

### ❌ What not to do (Mutation):
```javascript
const obj = { count: 0 };

obj.count = 1;  
setState(obj); 

// React thinks nothing happened! (Same reference → skip render ✅)
```

### ✅ What you should do (Immutable Update):
```javascript
setState({ ...obj, count: 1 }); 

// React detects the new object! (New reference → triggers re-render ❌)
```
*> Memoization only works when references are stable.*

---

## Slices

**Slices** help structure the global state into independent, logical, modular parts.

When one slice updates, **only components subscribed to that specific slice re-render** due to reference changes. This prevents the entire application from re-rendering every time any minor value in the store changes.
