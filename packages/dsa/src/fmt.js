// Formats a traced value for the dry-run table: linked lists, trees, cycles and depth limits.
export function fmt(v, seen = new Set(), depth = 0) {
  if (v === null || typeof v !== 'object') return fmtScalar(v);
  if (seen.has(v)) return '[circular]';
  if (depth > 5) return '...';
  const s = new Set(seen).add(v);
  return fmtObject(v, (x) => fmt(x, s, depth + 1));
}

function fmtScalar(v) {
  if (v === undefined) return '-';
  if (v === null) return 'null';
  if (typeof v === 'string') return `'${v}'`;
  if (typeof v === 'function') return v.listener ? `once(${v.listener.name})` : v.name || 'fn';
  return String(v);
}

/** Objects by shape, so the user's own list and tree classes work too. `f` formats a child one level deeper. */
function fmtObject(v, f) {
  if ('val' in v && 'next' in v) return fmtList(v, f);
  if ('val' in v && 'left' in v && 'right' in v) return `(${v.val})`;
  if (v instanceof Date) return `Date(${v.getTime()})`;
  if (v instanceof Promise) return 'Promise';
  if (v instanceof Map) return '{' + [...v].map(([k, x]) => `${f(k)}: ${f(x)}`).join(', ') + '}';
  if (v instanceof Set) return '{' + [...v].map((x) => f(x)).join(', ') + '}';
  if (Array.isArray(v)) return '[' + Array.from(v, (x) => f(x)).join(', ') + ']';
  const parts = Object.entries(v).map(([k, x]) => `${k}: ${f(x)}`);
  for (const sym of Object.getOwnPropertySymbols(v)) parts.push(`[${sym.description}]: ${f(v[sym])}`);
  return '{' + parts.join(', ') + '}';
}

/** A linked list as "1 -> 2 -> 3", stopping at a cycle or after 20 nodes. */
function fmtList(head, f) {
  const vals = [];
  const visited = new Set();
  let n = head;
  for (; n && !visited.has(n) && vals.length < 20; n = n.next) {
    visited.add(n);
    vals.push(f(n.val));
  }
  if (n && visited.has(n)) vals.push(`back to ${f(n.val)} (cycle)`);
  else if (n) vals.push('...');
  return vals.join(' -> ');
}
