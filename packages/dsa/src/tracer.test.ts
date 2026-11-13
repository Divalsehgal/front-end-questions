// The dry-run tracer (was scripts/check-tracer.mjs in the standalone app).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';
import { describe, expect, it } from 'vitest';
import * as helpers from '../exercises/helpers.js';
import traces from './generated/traces.json';
import { dryRun, fmt, stripImports } from './tracer.js';

const quiet = { ...helpers, check: () => undefined };
const EXERCISES = fileURLToPath(new URL('../exercises', import.meta.url));
const REVERSE =
  'function reverse(head) {\n  let prev = null, curr = head;\n  while (curr) { const next = curr.next; curr.next = prev; prev = curr; curr = next; }\n  return prev;\n}\n';

describe('dryRun', () => {
  it('handles brace-less bodies, returns, destructuring, closures and classes', async () => {
    const sample = `
function f(arr) {
  let total = 0;
  for (const x of arr) if (x % 2) total += x; else continue;
  const [a, b = 2] = arr;
  if (total > 100) return -1;
  while (total > 5) total -= 5;
  return total + a + b;
}
class Box { constructor(v) { this.v = v; } get() { return this.v; } }
const box = new Box(3);
f([1, 2, 3, 4]) + box.get()`;
    const r = await dryRun(sample, quiet);
    expect(r.output).toBe('10');
    expect(r.steps.length).toBeGreaterThan(5);
    expect(r.cols).toEqual(expect.arrayContaining(['total', 'this']));
  });

  it('traces code without semicolons', async () => {
    const r = await dryRun('function f(a) {\n  let x = a\n  x = x * 2\n  return x\n}\nf(4)', quiet);
    expect(r.output).toBe('8');
    expect(r.steps).toHaveLength(3);
  });

  it('shows linked lists from the helpers, from your own ListNode class, and marks cycles', async () => {
    expect((await dryRun(REVERSE + 'reverse(arrayToList([1, 2, 3]))', quiet)).output).toBe('3 -> 2 -> 1');
    const own = await dryRun(
      'class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }\nconst head = new ListNode(1, new ListNode(2, new ListNode(3)));\n' +
        REVERSE +
        'reverse(head)',
      quiet,
    );
    expect(own.error).toBeNull();
    expect(own.output).toBe('3 -> 2 -> 1');
    expect((await dryRun('const a = new ListNode(1); a.next = new ListNode(2, a); a', quiet)).output).toBe('1 -> 2 -> back to 1 (cycle)');
  });

  it('reports syntax errors, runaway loops and timeouts, keeping the steps so far', async () => {
    expect((await dryRun('let x = ;', quiet)).error).toMatch(/^Syntax error/);
    const loop = await dryRun('let i = 0;\nwhile (true) i++;', quiet, { limit: 50 });
    expect(loop.error).toMatch(/Stopped after 50 steps/);
    expect(loop.steps).toHaveLength(50);
    expect((await dryRun('await new Promise(() => {})', quiet, { timeout: 20 })).error).toBe('Timed out after 0.02s');
  });

  it('blanks out import lines so line numbers stay put', () => {
    expect(stripImports("import { check } from '../helpers.js';\nconst a = 1;")).toBe('\nconst a = 1;');
  });
});

describe('fmt', () => {
  it('formats values the way the trace table shows them', () => {
    expect([undefined, null, 'a', 1].map((v) => fmt(v))).toEqual(['-', 'null', "'a'", '1']);
    expect(fmt(new Map([['k', [1, 2]]]))).toBe("{'k': [1, 2]}");
    expect(fmt(new Set([1]))).toBe('{1}');
    expect(fmt(new helpers.TreeNode(5))).toBe('(5)');
    const self: Record<string, unknown> = { a: 1 };
    self.self = self;
    expect(fmt(self)).toBe('{a: 1, self: [circular]}');
  });
});

describe('pre-built traces', () => {
  // 26, 27, 39 use a hidden virtual clock and 38 a hidden wait, so the plain tracer can't replay them.
  const replayable = traces.filter((t) => !/^(26|27|38|39)-/.test(t.id));
  it.each(replayable.map((t) => [t.id, t] as const))('%s gives the same output through the tracer', async (_, t) => {
    const r = await dryRun(t.code, quiet);
    expect(r.error).toBeNull();
    expect(r.output).toBe(t.output);
  });
});

describe('exercise files', () => {
  const dirs = readdirSync(EXERCISES)
    .filter((d) => /^\d\d-/.test(d))
    .sort((a, b) => a.localeCompare(b));

  it('has all 45 exercises', () => expect(dirs).toHaveLength(45));

  // Stubs may still fail their checks at runtime, and a half-written solution may not parse yet;
  // whatever parses must also instrument without a syntax error of the tracer's making.
  it.each(dirs)('%s instruments', async (d) => {
    const src = readFileSync(join(EXERCISES, d, 'index.js'), 'utf8');
    let parses = true;
    try {
      parse(stripImports(src), { ecmaVersion: 'latest', allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true });
    } catch {
      parses = false;
    }
    const r = await dryRun(src, quiet);
    if (parses) expect(r.error ?? '').not.toMatch(/^Syntax error/);
    else expect(r.error).toMatch(/^Syntax error/);
  });
});
