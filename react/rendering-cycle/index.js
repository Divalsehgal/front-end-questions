/*

Request → HTML → JS download
→ React loads
→ Virtual DOM created
→ Diffing(Reconciliation) 1
→ Commit to real DOM 2
→ Browser paints 3
→ State change → repeat


A Fiber is React’s internal data structure that
 represents a component as a unit of work.
It holds different snapshots of a component 
(state, props, updates) and helps React batch, prioritize, and efficiently update the UI.

👉 Even simpler:
“Fiber = component + its state snapshots + 
its work, managed in a way that enables batching and 
smooth rendering.”


Initial render:
VDOM is created first → then React creates the actual DOM from it
Updates:
New VDOM is created → compared with old VDOM → only changes update the existing DOM

function FiberNode(type, props) {
  this.type = type;           // component
  this.props = props;         // current props
  this.state = null;          // state
  this.child = null;          // first child
  this.sibling = null;        // next node
  this.return = null;         // parent
  this.alternate = null;      // old snapshot (previous fiber)
}

*/