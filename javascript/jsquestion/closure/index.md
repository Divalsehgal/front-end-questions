# Closures in JavaScript

## Advantages

- **Data Privacy (Encapsulation):** Allows hiding variables from the global scope (simulating private state/methods).

  ```javascript
  function createCounter() {
    let count = 0; // Private state
    return {
      increment: () => ++count,
      getCount: () => count,
    };
  }
  const counter = createCounter();
  counter.increment(); // 1
  console.log(counter.count); // undefined (purely private)
  ```

- **State Retention:** Functions 'remember' the environment they were created in. This powers functional programming patterns like currying, memoization, and partial application.

  ```javascript
  const add = (a) => (b) => a + b; // Currying via closure
  const addFive = add(5);
  console.log(addFive(3)); // 8
  ```

- **Callback Context:** Essential for async operations (timers, `fetch`, event listeners) where nested callbacks need access to their parent function's lexical scope even after the parent has finished executing.
  ```javascript
  function setupAlert(message) {
    setTimeout(() => {
      console.log(message); // Remembers "message" long after setupAlert finishes
    }, 1000);
  }
  setupAlert("Hello future!");
  ```

## Disadvantages

- **Memory Consumption:** Closed-over variables are retained in memory and cannot be garbage-collected as long as the inner function maintains a reference to them.
- **Memory Leaks:** Improper closure management (especially with detached DOM nodes or un-cleared intervals) can permanently trap memory.
  ```javascript
  function attachEvent() {
    const hugeData = new Array(1000000).fill("leak");
    document.getElementById("btn").onclick = function () {
      // hugeData is permanently trapped because the DOM node listener closes over it
      console.log("Button clicked", hugeData[0]);
    };
  }
  ```
- **Performance Overhead:** Creating inner functions redundantly inside loops is slower and uses more memory compared to defining shared methods on a prototype chain.

## How Closures Are Created (Step-by-Step)

A closure is created when an inner function has access to variables from its outer function's scope, even after that outer function has finished executing.

```javascript
function outerFunction() {
  let count = 0; // Outer function variable

  function innerFunction() {
    count++; // Inner function accesses and modifies 'count'
    console.log(count);
  }

  return innerFunction;
}

const counter = outerFunction(); // outerFunction has finished executing
counter(); // 1 - inner function still has access to 'count'
counter(); // 2 - 'count' is preserved across calls
```

In this example, a closure is created because the inner function can still **access and update** the `count` variable from the outer function even after the outer function has finished executing. The variable `count` is "closed over" by the inner function, creating a persistent reference to it.

## Usage in React

In modern React, closures are the core mechanism powering Functional Components and Hooks.

- **State Capture:** Functions like `onClick` or `useEffect` close over the state (`useState`) and props belonging to a **specific render cycle**. They remember these exact values even if they finish executing later asynchronously.

  ```javascript
  function AlertButton() {
    const [count, setCount] = useState(0);

    const handleAlert = () => {
      // Because of closures, this captures the exactly rendered `count`
      // Even if you click 5 times before the timeout finishes, it alerts the old value
      setTimeout(() => alert(count), 3000);
    };

    return <button onClick={handleAlert}>Alert Count</button>;
  }
  ```

- **Stale Closures (The Pitfall):** Because closures lock in the variables from the exact render they were created in, asynchronous logic (like a `setInterval` inside `useEffect`) can get stuck with "stale" (outdated) state if the dependency array isn't properly managed.

  ```javascript
  useEffect(() => {
    const id = setInterval(() => {
      // BUG: `count` is trapped at 0 because the closure was only created during initial mount
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // Fix: pass [count] or use functional update setCount(prev => prev + 1)
  ```

- **Custom Hooks:** Custom hooks utilize closures to hide internal modular logic and internal state, exposing only specific API handlers to the main component.

  ```javascript
  function useToggle(initial) {
    const [isOn, setIsOn] = useState(initial);

    // The toggle function uses closure to securely wrap its state actions
    const toggle = () => setIsOn((prev) => !prev);

    return [isOn, toggle];
  }
  ```
