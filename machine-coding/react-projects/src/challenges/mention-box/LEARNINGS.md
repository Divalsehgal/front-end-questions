# Learning Gist: Mention System (@User)

### 🧠 The Core Logic
Triggering a context-sensitive dropdown during text input. This combines string parsing, selection range management, and floating UI positioning.

### 🛠️ Implementation Strategy
1. **Trigger Detection**: Listen to `onChange` and detect when the cursor is preceded by a trigger character (`@`).
2. **Filtering**: Extract the string between the trigger and the cursor to filter the user list.
3. **Selection Range**: Use `selectionStart` and `selectionEnd` to know WHERE the mention is happening in the textarea.
4. **Insertion**: When a suggestion is clicked, replace the query string with the selected username, ensuring the cursor is placed correctly after the space.

### 🚀 FAANG Interview Tips
- **UX**: Mention positioning (calculating coordinates of the cursor in a textarea is famously hard). Use libraries like `Floating UI` or hidden mirrors.
- **Accessibility**: Mention list navigation (Arrow keys + Enter) and ARIA attributes (listbox, active-descendant).
- **Performance**: Debouncing the search if the user list is remote.

```typescript
const onTextChange = (e) => {
  const text = e.target.value;
  const cursor = e.target.selectionStart;
  const lastAt = text.lastIndexOf('@', cursor - 1);
  if (lastAt !== -1) {
    const query = text.substring(lastAt + 1, cursor);
    // Show suggestions for query
  }
};
```
