// Builds src/generated/traces.json: a traced reference run of every exercise on its first example.
// Run with: npm run dsa:traces. The runs live in traces/solutions.mjs; each run(t) calls t(note, vars)
// to record variable states. Lines ending in "// hide" and every t(...) call are left out of the code
// shown in the app.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fmt } from '../src/tracer.js';
import { E } from './traces/solutions.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const exerciseDir = join(here, '../exercises');

// ---------- strip tracing from the source shown in the app ----------
const DEPTH = { '(': 1, ')': -1 };

/** Index just past the `)` closing a call whose arguments start at `open`, skipping parens inside strings. */
function endOfCall(src, open) {
  let d = 1;
  let quote = null;
  let j = open;
  for (; j < src.length && d > 0; j++) {
    const c = src[j];
    if (quote) {
      if (c === '\\') j++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') quote = c;
    d += DEPTH[c] ?? 0;
  }
  return j;
}

/** Past the `;`, spaces and one line break that follow a removed call. */
function skipTail(src, j) {
  while (src[j] === ';' || src[j] === ' ') j++;
  return src[j] === '\n' ? j + 1 : j;
}

/** Drops "// hide" lines and one-line `if (cond) t(...);` probes, trims blank edges and removes the common indent. */
function tidy(text) {
  const lines = text.split('\n').filter((l) => !/\/\/ hide\s*$/.test(l) && !/^\s*if \(.*\) t\(.*\);\s*$/.test(l));
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => /^ */.exec(l)[0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}

/** The body of a run function as learners see it: every whole t(...) statement removed, even multi-line ones. */
function cleanSource(fn) {
  let src = fn.toString();
  src = src.slice(src.indexOf('{') + 1, src.lastIndexOf('}'));
  let out = '';
  for (let i = 0; i < src.length; ) {
    const m = (i === 0 || src[i - 1] === '\n') && /^[ \t]*t\(/.exec(src.slice(i, i + 200));
    if (m) i = skipTail(src, endOfCall(src, i + m[0].length));
    else out += src[i++];
  }
  return tidy(out);
}

/** Runs one exercise's reference solution, recording every t(note, vars) as a step. */
async function trace(e) {
  const header = readFileSync(join(exerciseDir, e.id, 'index.js'), 'utf8').split('\n')[1];
  const [, n, title] = /^ \* (\d+)\. (.+)$/.exec(header);
  const steps = [];
  const t = (note, vars) => {
    const vals = {};
    for (const [k, v] of Object.entries(vars)) vals[k] = fmt(v);
    steps.push({ note, vals });
  };
  const result = await e.run(t);
  if (JSON.stringify(result) !== JSON.stringify(e.expect)) {
    throw new Error(`${e.id}: expected ${JSON.stringify(e.expect)}, got ${JSON.stringify(result)}`);
  }
  const cols = [...new Set(steps.flatMap((s) => Object.keys(s.vals)))];
  return { id: e.id, n: Number(n), title, input: e.input, output: fmt(result), code: cleanSource(e.run), cols, steps };
}

// ======================================================================
const folders = readdirSync(exerciseDir)
  .filter((d) => /^\d\d-/.test(d))
  .sort((a, b) => a.localeCompare(b));
const missing = folders.filter((f) => !E.some((e) => e.id === f));
if (missing.length) throw new Error('No trace for: ' + missing.join(', '));

// Each run has its own t() and steps, so they can run side by side; Promise.all keeps E's order.
const out = await Promise.all(E.map(trace));

writeFileSync(join(here, '../src/generated/traces.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`wrote ${out.length} traces, ${out.reduce((s, x) => s + x.steps.length, 0)} steps, all outputs match`);
