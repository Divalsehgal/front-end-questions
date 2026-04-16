# Learning Gist: Tabs Component

### 🧠 The Core Logic
Implementing accessible, switchable content panels with a shared state.

### 🛠️ Implementation Strategy
1. **State Management**: Use `activeTab` state (usually index or unique key).
2. **Conditional Rendering**: Render the content of the `activeTab` only.
3. **Accessibility**: Use `role="tablist"`, `role="tab"`, and `aria-selected` for screen readers.
4. **Efficiency**: Use a configuration array `[{ label, content }]` to map the tabs dynamically.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on "Lazy Loading" (only mounting the component when the tab is clicked) vs "Hiding" (keeping all tabs mounted but CSS hidden).
- **Keyboard UX**: Support Left/Right arrow keys to switch tabs.

```tsx
const [active, setActive] = useState(0);
return (
  <div>
    {tabs.map((t, i) => <button onClick={() => setActive(i)}>{t.label}</button>)}
    <div>{tabs[active].content}</div>
  </div>
);
```
