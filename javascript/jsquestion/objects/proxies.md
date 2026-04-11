# 🕵️ JavaScript Proxies: The Default Value Pattern

Proxies allow you to create a "wrapper" for another object, enabling you to intercept and redefine fundamental operations (like property lookup, assignment, etc.).

---

## 💻 The Code Example
This pattern is often used to provide **default values** for missing properties.

```javascript
const target = { a: 1 };

const proxy = new Proxy(target, {
  get(obj, key) {
    // If key exists in target, return it; otherwise return 42
    return key in obj ? obj[key] : 42;
  },
});

console.log(proxy.a); // 1  (exists in target)
console.log(proxy.b); // 42 (missing in target, trap returns 42)
console.log(target.b);// undefined (target itself is UNCHANGED)
```

---

## 🧬 The "Science" Behind It

### 1. Metaprogramming
This is a form of **Metaprogramming**. Instead of writing standard logic, you are writing code that changes how the JavaScript engine itself interacts with an object.

### 2. Internal Methods & Traps
In JS, every object has **Internal Methods** (hidden from us but used by the engine), such as:
- `[[Get]]`: For reading properties.
- `[[Set]]`: For writing properties.
- `[[HasProperty]]`: For the `in` operator.

A **Proxy** sits in front of the **Target** object. Its **Handler** (the second argument) contains "Traps." When you call `proxy.a`, the engine doesn't go straight to the object; it falls into the `get` **trap** you defined.

### 3. The Handler vs. The Target
- **Target**: The original object being "guarded."
- **Proxy**: The object you interact with.
- **Trap**: The function that intercepts the operation.

### 4. Non-Mutative Nature
Crucially, the Proxy **does not modify the source object**. As seen above, `target.b` still returns `undefined`. The logic only exists within the Proxy's boundary.

---

## 🚀 Practical Use Cases
1. **Validation**: Check if a value is a valid email before setting it.
2. **Reactivity**: This is how **Vue 3** detects changes to data (whenever a `set` trap is hit, Vue triggers a UI re-render).
3. **Logging/Profiling**: Log every time a property is accessed to find performance bottlenecks.
4. **Negative Indexing**: Using proxies to allow `array[-1]` for the last element.

---

> [!TIP]
> **Interview Question**: "How does Vue 3's reactivity differ from Vue 2?"
> **Answer**: Vue 2 used `Object.defineProperty` (which had to be done per-key). Vue 3 uses **Proxies**, which can watch the entire object at once, including newly added properties!
