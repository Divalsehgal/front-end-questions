# Promise Methods Cheat Sheet

- **`Promise.all`**: Will return success in an array `[value1, value2]` if all succeed. If any one fails, it immediately returns the error.
- **`Promise.allSettled`**: Will wait for all to finish and return an array of outcome objects `[{status, value/reason}]`. It never immediately fails.
- **`Promise.race`**: Will return success `value` or `error` immediately based exactly on whichever promise finishes first.
- **`Promise.any`**: Will return the first successful `value` immediately. It only returns an `AggregateError` array if every single promise fails.

---

## Return Types Visualization

| Method | ✅ Success Return Type | ❌ Error Return Type |
| :--- | :--- | :--- |
| **`Promise.all`** | `[value1, value2]` *(Array of all values)* | `error` *(First error)* |
| **`Promise.allSettled`**| `[{status, value/reason}]` *(Array of objects)*| *(Never fails)* |
| **`Promise.race`** | `value` *(First winning value)* | `error` *(First winning error)* |
| **`Promise.any`** | `value` *(First successful value)* | `AggregateError` *(Array of all errors)* |
