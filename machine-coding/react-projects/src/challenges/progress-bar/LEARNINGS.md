# Learning Gist: Progress Bar

### 🧠 The Core Logic
Visualizing a percentage value using CSS transitions and state.

### 🛠️ Implementation Strategy
1. **Container & Bar**: One parent div (background) and one child div (the progress).
2. **Width Calculation**: Apply the percentage to the child's `width` style.
3. **Transition**: Use `transition: width 0.3s ease-in-out` for smooth movement.
4. **Validation**: Ensure the percentage is clamped between 0 and 100.

### 🚀 FAANG Interview Tips
- **Accessibility**: Use `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Customization**: How to handle a circular progress bar? (SVG `stroke-dasharray` and `stroke-dashoffset`).

```tsx
<div className="w-full bg-gray-200 rounded-full h-2.5">
  <div 
    className="bg-blue-600 h-2.5 rounded-full transition-all" 
    style={{ width: `${progress}%` }} 
  />
</div>
```
