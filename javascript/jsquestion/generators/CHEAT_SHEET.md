# ⚡ Generator Quick Ref (Interview Ready)

### 1. The Core
- **Syntax**: `function* gen() { ... }`
- **Behavior**: Pausable functions. Returns an **Iterator** object.
- **Methods**: `.next()`, `.throw()`, `.return()`.

### 2. Basic Execution
```javascript
function* g() { yield 1; return 2; }
const it = g();
it.next(); // { value: 1, done: false }
it.next(); // { value: 2, done: true }
```

### 3. Two-Way Communication (Interview Favorite)
The argument in `next(val)` replaces the `yield` expression where it paused.
```javascript
function* chat() {
  const result = yield "Start"; 
  console.log(result); // "Hello"
}
const it = chat();
it.next();      // Starts & hits first yield
it.next("Hello"); // Resumes, result becomes "Hello"
```

### 4. Key Interview Questions
- **Difference from regular functions?** Generators pause/resume; regular functions run-to-completion.
- **`for...of` behavior?** Iterates `yield` values, but **ignores** `return`.
- **`yield*`?** Delegates to another iterable (e.g., `yield* [1,2,3]`).
- **Memory?** Lazy evaluation. Values are computed only when requested. Memory efficient.
- **Async/Await connection?** `async/await` is essentially **Generators + Promises**.

### 5. Common Gotchas
- **Exhaustion**: Once `done: true`, you can't restart that instance.
- **First `.next()` call**: Arguments passed to the *very first* `.next()` are normally ignored because there's no `yield` to receive them yet.

### 6. Practice Files
- [Communication (index3.js)](file:///Users/divalsehgal/Documents/dpjs/jsquestion/generators/index3.js)
- [Return Logic (index2.js)](file:///Users/divalsehgal/Documents/dpjs/jsquestion/generators/index2.js)

---
> [!TIP]
> **Key takeaway**: Generators maintain local state but yield execution.
