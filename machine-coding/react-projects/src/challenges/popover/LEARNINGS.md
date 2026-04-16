# Learning Gist: Popover & Portal

### 🧠 The Core Logic
Rendering a floating element over the main UI without clipping or z-index issues.

### 🛠️ Implementation Strategy
1. **React Portals**: Use `createPortal` to render the popover at the end of `<body>` rather than inside the hierarchy.
2. **Overlay Management**: A backdrop that intercepts clicks to close the popover.
3. **Anchor Positioning**: Calculate the target element's `getBoundingClientRect()` to position the popover exactly.
4. **Visibility State**: A simple boolean `isOpen`.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on why Portals are used (avoids `overflow: hidden` issues from parent containers).
- **UX**: Implementing "Close on Escape" and "Focus Trap" for accessibility.

```tsx
return createPortal(
  <div className="absolute" style={{ top: y, left: x }}>{content}</div>,
  document.body
);
```
