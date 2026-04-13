# React Internals — Quick Reference

> "React's rendering cycle has two main phases — the **render phase** and the **commit phase**."

In the **render phase**, React calls your component functions, builds a Virtual DOM tree, and diffs it against the previous one using reconciliation. This phase is pure and interruptible — React can pause and resume it.

In the **commit phase**, React takes the diff and applies only the actual changes to the real DOM. This is synchronous and can't be interrupted. After that, effects like `useEffect` fire. 

If state changes, the cycle repeats — new render phase, new diff, new commit.

---

## The Lifecycle (Big Picture)

Request → HTML → JS → React loads
1. **Render** (diff VDOM, interruptible)
2. **Commit** (write DOM, synchronous)
3. **Paint**
4. *State change* → repeat from Step 1

---

## Two Phases

* **RENDER:** pure, pausable — builds VDOM, diffs it
* **COMMIT:** sync, can't stop — writes to real DOM

**Commit Sub-phases:**
```text
BeforeMutation → Mutation (DOM writes) → Layout
                                           ↑
                           useLayoutEffect fires here
                           useEffect fires after paint
```

---

## What is Fiber?

A linked list node representing one component. It holds its state, props, hooks, and pending work.

> **Fiber = component + snapshots + work → enables pausing and prioritizing renders**

* **Before Fiber:** rendering was one big synchronous recursive call.
* **After Fiber:** a linked list that React can walk and pause.

### Fiber Node Structure

```javascript
function FiberNode(type, props) {
  this.type = type;         // component (fn or class)
  this.props = props;
  this.state = null;
  this.hooks = null;        // linked list of hook slots

  this.child = null;        // first child
  this.sibling = null;      // next sibling
  this.return = null;       // parent

  this.alternate = null;    // pointer to the other tree
  this.effectTag = null;    // UPDATE / PLACEMENT / DELETION
}
```

Fiber is React's internal data structure — every component in your tree is represented as a Fiber node. The key thing Fiber enables is incremental rendering — React can split rendering work into chunks, pause mid-tree for higher priority updates, then resume. Before Fiber, rendering was one synchronous recursive call that couldn't be interrupted.

### Two Trees
React always maintains two fiber trees — the current tree (what's on screen) and the work-in-progress tree (what's being built).

```text
CURRENT  ◄── alternate ──►  WORK-IN-PROGRESS
(screen)                     (being built)
     ▲                            │
     └──── swap after commit ─────┘
```
*Old current tree is recycled as the next WIP — it is not trashed.*

Each node has an `alternate` pointer linking the two. When the WIP tree is fully built, React swaps them in the commit phase.

---

## Hooks Linked List (Inside each fiber)

```text
slot 0 → useState       (order must never change)
slot 1 → useState       (← why hooks can't be in if-blocks)
slot 2 → useCallback    (returns cached fn if deps unchanged)
slot 3 → useMemo        (returns cached value if deps unchanged)
```
*Pro tip: `useCallback(fn, deps)` === `useMemo(() => fn, deps)` internally.*

---

## Interview One-Liners

* **Rendering cycle:** "Render phase diffs VDOM (pausable), commit phase writes DOM (sync)."
* **Fiber:** "Linked list of work units that makes rendering interruptible."
* **`alternate` pointer:** "Pointer linking current ↔ WIP tree. Swapped after every commit."
* **`React.memo`:** "Shallow prop check — bails out the whole subtree if nothing changed."
* **`useCallback`:** "Stable fn reference. Pointless without `React.memo` on the child."
* **`useMemo`:** "Cached value. `useCallback` is just `useMemo` for functions."
