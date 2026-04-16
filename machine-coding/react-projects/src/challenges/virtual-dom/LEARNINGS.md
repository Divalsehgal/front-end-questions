# Learning Gist: Virtual DOM Renderer

### 🧠 The Core Logic

The goal is to transform a JSON-like "Virtual DOM" tree into real, physical HTML elements. This is a fundamental concept behind frameworks like React.

### 🛠️ Implementation Strategy

1. **Recursive Traversal**: Use a Depth-First Search (DFS) approach to walk through the nodes and their children.
2. **Base Cases**:
   - If the node is a `string` or `number` -> use `document.createTextNode()`.
3. **Recursive Case**:
   - Use `document.createElement(node.type)`.
   - Iterate over `props` (excluding `children`) and apply them using `setAttribute`.
   - Recursively call the function for all `node.children` and append them to the current element.

### 🚀 FAANG Interview Tips

- **Performance**: Discuss why we use a Virtual DOM (to batch updates and minimize expensive direct DOM manipulation).
- **Edge Cases**: Handle `className` vs `class`, special attributes like `style` (which should be an object mapping), and `onClick` handlers.
- **Complexity**: O(N) where N is the total number of nodes in the virtual tree.

```typescript
function render(vNode) {
  if (typeof vNode !== 'object') return document.createTextNode(vNode);
  const el = document.createElement(vNode.type);
  Object.entries(vNode.props || {}).forEach(([key, val]) => {
    if (key === 'children') {
      val.forEach(child => el.appendChild(render(child)));
    } else {
      el.setAttribute(key, val);
    }
  });
  return el;
}
```
