# Learning Gist: Recursive Folder Structure

### 🧠 The Core Logic
Represent a nested file system using a recursive component structure. This is a classic "Self-Referential Data" challenge.

### 🛠️ Implementation Strategy
1. **Recursive Component**: Create a `FileNode` component that renders itself for any sub-items.
2. **Terminal Case**: If the item is a `file`, just render its name/icon.
3. **Recursive Case**: If the item is a `folder`, render the folder name AND map over `item.children` to render more `FileNode` components.
4. **State Isolation**: Use local state (`isOpen`) inside each `FileNode` instance to manage expand/collapse behavior independently.

### 🚀 FAANG Interview Tips
- **Performance**: Discuss how to optimize deep trees (Windowing/Virtualization if the tree has thousands of nodes).
- **Data Structure**: Usually represented as a `node { name, type, children: [] }`.
- **Keyboard Navigation**: How would you add accessibility (Arrow keys to navigate, Space to expand)?

```tsx
const Folder = ({ node }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div onClick={() => setOpen(!open)}>{node.name}</div>
      {open && node.children.map(child => <Folder node={child} />)}
    </div>
  );
};
```
