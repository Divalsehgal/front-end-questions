// Formats a traced value for the dry-run table: linked lists, trees, cycles and depth limits.
/* eslint-disable complexity -- one branch per value type */
export function fmt(v, seen = new Set(), depth = 0) {
  if (v === undefined) return '-';
  if (v === null) return 'null';
  if (typeof v === 'string') return `'${v}'`;
  if (typeof v === 'function') return v.listener ? `once(${v.listener.name})` : v.name || 'fn';
  if (typeof v !== 'object') return String(v);
  if (seen.has(v)) return '[circular]';
  if (depth > 5) return '...';
  const s = new Set(seen).add(v);
  const f = (x) => fmt(x, s, depth + 1);
  // linked list / tree nodes by shape, so the user's own classes work too
  if ('val' in v && 'next' in v) {
    const vals = [];
    const visited = new Set();
    let n = v;
    for (; n && !visited.has(n) && vals.length < 20; n = n.next) {
      visited.add(n);
      vals.push(fmt(n.val, s, depth + 1));
    }
    if (n && visited.has(n)) vals.push(`back to ${fmt(n.val, s, depth + 1)} (cycle)`);
    else if (n) vals.push('...');
    return vals.join(' -> ');
  }
  if ('val' in v && 'left' in v && 'right' in v) return `(${v.val})`;
  if (v instanceof Date) return `Date(${v.getTime()})`;
  if (v instanceof Promise) return 'Promise';
  if (v instanceof Map) return '{' + [...v].map(([k, x]) => `${f(k)}: ${f(x)}`).join(', ') + '}';
  if (v instanceof Set) return '{' + [...v].map(f).join(', ') + '}';
  if (Array.isArray(v)) return '[' + Array.from(v, f).join(', ') + ']';
  const parts = Object.entries(v).map(([k, x]) => `${k}: ${f(x)}`);
  for (const sym of Object.getOwnPropertySymbols(v)) parts.push(`[${sym.description}]: ${f(v[sym])}`);
  return '{' + parts.join(', ') + '}';
}
