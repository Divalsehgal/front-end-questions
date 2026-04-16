# Learning Gist: Comment & Nested Reply System

### 🧠 The Core Logic

Managing a nested state tree (comments -> replies -> sub-replies). This tests state immutability and recursive updates.

### 🛠️ Implementation Strategy

1. **Tree Management**: Store comments as an array of objects, where each object has a `replies` array.
2. **Recursive Update Function**: When adding a reply, you need a function that traverses the tree, finds the `commentId`, and pushes the new reply into that specific node's `replies` array.
3. **State Immutability**: Use the spread operator `[...arr]` and `.map()` to ensure every nesting level is correctly cloned during updates.
4. **Draft Management**: Use local state for the reply input box to prevent unnecessary global re-renders.

### 🚀 FAANG Interview Tips

- **Optimization**: Discuss why updating deep nested state is expensive and how to optimize it (e.g., Normalizing the state into a flat object/map).
- **Infinite Nesting**: How do you limit nesting depth for UI/UX?
- **Concurrency**: What if two users reply at the same time? (Optimistic updates).

```typescript
function addReply(comments, targetId, newReply) {
  return comments.map(comment => {
    if (comment.id === targetId) {
      return { ...comment, replies: [newReply, ...comment.replies] };
    }
    return { ...comment, replies: addReply(comment.replies, targetId, newReply) };
  });
}
```
