// Formats values the way a browser console shows them inline:
// top-level strings are bare, nested strings are quoted.
// NOTE: this file is also loaded as raw source into the sandbox worker, so it must stay
// self-contained (no imports).
export function formatArgs(args: unknown[]): string {
  return args.map((a) => format(a, true)).join(' ');
}

type Inner = (v: unknown) => string;

/** Deeper than this, arrays and objects collapse to […] / {…}. */
const MAX_DEPTH = 3;

export function format(value: unknown, top = false, depth = 0, seen = new WeakSet<object>()): string {
  if (typeof value === 'function') return formatFunction(value);
  if (value === null || typeof value !== 'object') return formatPrimitive(value, top);
  return formatObject(value, depth, seen);
}

function formatPrimitive(value: unknown, top: boolean): string {
  switch (typeof value) {
    case 'string':
      return top ? value : `'${value}'`;
    case 'number':
      return Object.is(value, -0) ? '-0' : String(value);
    case 'bigint':
      return `${value}n`;
    case 'symbol':
      return value.toString();
    default:
      return String(value);
  }
}

function formatFunction(value: { name: string }): string {
  const src = Function.prototype.toString.call(value);
  return src.startsWith('class') ? `class ${value.name}` : `ƒ ${value.name}()`;
}

function formatObject(value: object, depth: number, seen: WeakSet<object>): string {
  if (seen.has(value)) return '[Circular]';
  if (depth > MAX_DEPTH) return Array.isArray(value) ? '[…]' : '{…}';
  seen.add(value);
  try {
    return formatContents(value, (v) => format(v, false, depth + 1, seen));
  } finally {
    // Only ancestors count as circular; a sibling may reference the same object again.
    seen.delete(value);
  }
}

// Each formatter claims a kind of object (returns a string) or passes (undefined). First match wins.
const FORMATTERS: ((value: object, inner: Inner) => string | undefined)[] = [
  (v, inner) => (Array.isArray(v) ? `[${v.map(inner).join(', ')}]` : undefined),
  (v) => (v instanceof Date ? formatDate(v) : undefined),
  (v) => (v instanceof RegExp ? String(v) : undefined),
  (v) => (v instanceof Error ? `${v.name}: ${v.message}` : undefined),
  (v) => (v instanceof Promise ? 'Promise {…}' : undefined),
  (v, inner) => (v instanceof Map ? formatMap(v, inner) : undefined),
  (v, inner) => (v instanceof Set ? `Set(${v.size}) {${[...v].map(inner).join(', ')}}` : undefined),
];

function formatContents(value: object, inner: Inner): string {
  for (const formatter of FORMATTERS) {
    const out = formatter(value, inner);
    if (out !== undefined) return out;
  }
  return formatPlainObject(value, inner);
}

const formatDate = (d: Date) => (Number.isNaN(d.getTime()) ? 'Invalid Date' : d.toISOString());

const formatMap = (m: Map<unknown, unknown>, inner: Inner) => `Map(${m.size}) {${[...m].map(([k, v]) => `${inner(k)} => ${inner(v)}`).join(', ')}}`;

function prefixOf(value: object): string {
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return '[Object: null prototype] ';
  const name = proto.constructor?.name;
  return name && name !== 'Object' ? `${name} ` : '';
}

const formatKey = (k: string) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`);

function formatPlainObject(value: object, inner: Inner): string {
  const entries = Object.keys(value).map((k) => `${formatKey(k)}: ${inner((value as Record<string, unknown>)[k])}`);
  return `${prefixOf(value)}{${entries.join(', ')}}`;
}

/** Lenient comparison for typed answers: ignores spaces, quote style and Chrome's "(2)" array-length prefix. */
export function normalizeLine(line: string): string {
  return line
    .replaceAll(/\(\d+\)\s*(?=\[)/g, '')
    .replaceAll(/["'`]/g, '')
    .replaceAll(/\s+/g, '');
}

/** "Uncaught ReferenceError: …" also accepts "ReferenceError" or "Uncaught ReferenceError". */
export function linesMatch(mine: string, real: string): boolean {
  if (normalizeLine(mine) === normalizeLine(real)) return true;
  const thrown = real.match(/^Uncaught (?:\(in promise\) )?(\w+)/);
  if (!thrown) return false;
  const name = normalizeLine(mine)
    .replace(/^Uncaught(\(inpromise\))?/i, '')
    .replace(/^throws\(?/i, '')
    .replace(/\)$/, '');
  return name.split(':')[0] === thrown[1];
}
