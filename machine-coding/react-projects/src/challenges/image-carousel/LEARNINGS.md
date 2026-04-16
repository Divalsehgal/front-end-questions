# Learning Gist: Image Carousel

### 🧠 The Core Logic
Cycle through a list of images with transitions and navigation controls.

### 🛠️ Implementation Strategy
1. **Active Index**: Track the currently visible image with `activeIndex`.
2. **Circular Logic**: When hitting "Next" at the end, jump to index 0 (using modulo: `(index + 1) % length`).
3. **Auto-play**: Use `setInterval` to advance the slide automatically (ensure cleanup!).
4. **Optimization**: Use `priority` or `loading="lazy"` appropriately.

### 🚀 FAANG Interview Tips
- **Performance**: Pre-loading the next image in the background (prefetch) to avoid white screen.
- **UX**: Support swipe gestures for mobile users using touch events.

```tsx
const next = () => setActive((prev) => (prev + 1) % images.length);
const prev = () => setActive((prev) => (prev - 1 + images.length) % images.length);
```
