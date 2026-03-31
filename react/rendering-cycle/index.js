/*
╔══════════════════════════════════════════════════════╗
║           REACT INTERNALS — QUICK REFERENCE          ║
╚══════════════════════════════════════════════════════╝

"React's rendering cycle has two main phases — the render phase and the commit phase.
In the render phase, React calls your component functions, builds a Virtual DOM tree, and 
diffs it against the previous one using reconciliation. This phase is pure and interruptible — 
React can pause and resume it.
In the commit phase, React takes the diff and applies only the actual changes to the real DOM. 
This is synchronous and can't be interrupted. After that, effects like useEffect fire.
If state changes, the cycle repeats — new render phase, new diff, new commit."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 LIFECYCLE (big picture)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Request → HTML → JS → React loads
    → [1] Render   (diff VDOM, interruptible)
    → [2] Commit   (write DOM, synchronous)
    → [3] Paint
    → state change → repeat from [1]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TWO PHASES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  RENDER   pure, pausable — builds VDOM, diffs it
  COMMIT   sync, can't stop — writes to real DOM

  Commit sub-phases:
    BeforeMutation → Mutation (DOM writes) → Layout
                                              ↑
                                        useLayoutEffect fires here
                                        useEffect fires after paint


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT IS FIBER?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  A linked list node representing one component.
  Holds its state, props, hooks, and pending work.

  "Fiber = component + snapshots + work
            → enables pausing and prioritizing renders"

  Before Fiber: one big synchronous recursive call.
  After Fiber:  a linked list React can walk and pause.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FIBER NODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function FiberNode(type, props) {
  this.type = type;    // component (fn or class)
  this.props = props;
  this.state = null;
  this.hooks = null;    // linked list of hook slots

  this.child = null;    // first child
  this.sibling = null;    // next sibling
  this.return = null;    // parent

  this.alternate = null;    // pointer to the other tree
  this.effectTag = null;    // UPDATE / PLACEMENT / DELETION
}

/*
"Fiber is React's internal data structure — 
every component in your tree is represented as a Fiber node. Each node holds the component
type, its props, state, and pointers to its child, sibling, and parent.
The key thing Fiber enables is incremental rendering — 
React can split rendering work into chunks, pause mid-tree for higher priority updates, 
then resume. Before Fiber,
rendering was one synchronous recursive call that couldn't be interrupted.
React always maintains two fiber trees — the current tree (what's on screen) 
and the work-in-progress tree (what's being built).
Each node has an alternate pointer linking the two. 
When the WIP tree is fully built, React swaps them in the commit phase."

*/

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TWO TREES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CURRENT  ◄── alternate ──►  WORK-IN-PROGRESS
  (screen)                     (being built)
       ▲                            │
       └──── swap after commit ─────┘

  Old current is recycled as the next WIP — not trashed.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HOOKS LINKED LIST (inside each fiber)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  slot 0 → useState       order must never change
  slot 1 → useState       ← why hooks can't be in if-blocks
  slot 2 → useCallback    returns cached fn if deps unchanged
  slot 3 → useMemo        returns cached value if deps unchanged

  useCallback(fn, deps) === useMemo(() => fn, deps)  ← same thing internally


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 INTERVIEW ONE-LINERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Rendering cycle  →  "Render phase diffs VDOM (pausable),
                        commit phase writes DOM (sync)."

  Fiber            →  "Linked list of work units that makes
                        rendering interruptible."

  alternate        →  "Pointer linking current ↔ WIP tree.
                        Swapped after every commit."

  React.memo       →  "Shallow prop check — bails out the
                        whole subtree if nothing changed."

  useCallback      →  "Stable fn reference. Pointless without
                        React.memo on the child."

  useMemo          →  "Cached value. useCallback is just
                        useMemo for functions."

*/