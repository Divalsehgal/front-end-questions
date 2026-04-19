#### 1. React Portals (`createPortal`)

The `createPortal` function renders children into a DOM node outside the parent hierarchy.

- **Escape Stacking Context**: Avoids `z-index` conflicts and `overflow: hidden` truncation.
- **Clean DOM**: Keeps the interactive overlay at the root (`document.body`).

#### 2. The Overlay Effect (Positioning)

- **`position: fixed`**: Anchors the overlay to the viewport.
- **`inset: 0`**: Ensures full coverage (`top/right/bottom/left: 0`).
- **`backdrop-blur`**: Improves visual focus on the modal content.

#### 3. Efficient Event Handling (Stopping Propagation)

Instead of global `window` listeners, we use React's synthetic event system:

1. **Overlay Listener**: `onMouseDown` on the outer div triggers closure.
2. **Propagation Stop**: `onMouseDown={(e) => e.stopPropagation()}` on the inner dialog prevents clicks *inside* the modal from closing it.
3. **Ref Check**: Still useful as a secondary safety check.

```tsx
const clickHandler = useCallback((e: React.MouseEvent) => {
  if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
    setToggle(false);
  }
}, [modalRef]);

// In Render
<div className="overlay" onMouseDown={clickHandler}>
  <div className="dialog" onMouseDown={(e) => e.stopPropagation()} ref={modalRef}>
    {/* Content */}
  </div>
</div>
```

#### 4. Accessibility (a11y) Prowess

A production-ready modal requires semantic ARIA attributes:

- **`useId`**: Generates stable, unique IDs for ARIA associations across renders.
- **`role="dialog"`**: Identifies the element as a dialog.
- **`aria-modal="true"`**: Tells assistive tech that the background content is "hidden" and non-interactive.
- **`aria-labelledby` & `aria-describedby`**: Explicitly links the title and content to the dialog for screen readers.

### 🚀 FAANG Interview Tips

- **Performance**: Explain why `useCallback` is used for the click handler (preventing unnecessary re-renders in optimized child components).
- **Semantics**: Always mention `useId`. It shows you care about robust, accessible component architecture.
- **Propagation**: Be ready to explain the difference between Event Bubbling and Capturing, and why `stopPropagation()` is the standard tool for modal overlays.
