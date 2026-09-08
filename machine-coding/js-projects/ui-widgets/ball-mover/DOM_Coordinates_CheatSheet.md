# DOM Coordinate Systems: The Interview Cheat Sheet

## 1. Mouse Event Coordinates
| Coordinate | Relative To... | Formula / Behavior |
| :--- | :--- | :--- |
| **`clientX / Y`** | **Viewport** | Stays the same regardless of scrolling. |
| **`pageX / Y`** | **Document** | `clientX + scrollX`. Changes when you scroll. |
| **`offsetX / Y`** | **Target Element** | Position relative to the element that fired the event. |
| **`screenX / Y`** | **Monitor Screen** | Useful for multi-window or popup positioning. |

---

## 2. Element Dimensions & Position
### The "Top/Left" Group
*   **`getBoundingClientRect()`**: Returns `{top, left, width, height...}` relative to the **Viewport**. This is the most reliable tool for modern web apps.
*   **`offsetTop / Left`**: Distance to the nearest **positioned** parent. If no parents are positioned, it's relative to the `<body>`.

### The "Sizing" Group
*   **`offsetWidth / Height`**: "Visual size" (Includes border and scrollbars).
*   **`clientWidth / Height`**: "Internal size" (Includes padding, excludes border/scrollbar).
*   **`scrollWidth / Height`**: "Total content size" (Includes area hidden by overflow/scrolling).

---

## 3. High-Frequency Interview Questions

### Q1: How do you position a tooltip exactly at the mouse click?
**A:** Use `clientX/Y` but ensure the tooltip itself has `position: fixed`. If the tooltip has `position: absolute`, you must use `pageX/Y` to account for page scrolling.

### Q2: How do you detect if an element is in the viewport?
**A:** Use `getBoundingClientRect()`. 
```javascript
const rect = el.getBoundingClientRect();
const isVisible = (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
);
```

### Q3: What is the difference between `element.scrollTop` and `window.scrollY`?
**A:** `window.scrollY` is the scroll position of the entire page. `element.scrollTop` is the scroll position inside a specific overflowable container.

---

## 4. Pro-Tip: "Offset" vs "Client" Example
Imagine a `div` with `10px` border and `20px` padding.
*   **`offsetWidth`** = Content + 40px (padding) + 20px (border).
*   **`clientWidth`** = Content + 40px (padding).
*   **`rect.left`** = Distance from the left edge of the screen to the **outside** of the border.
*   **`clientLeft`** = This is actually just the **border width** (10px)!
