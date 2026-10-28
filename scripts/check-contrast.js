#!/usr/bin/env node
// WCAG 2.2 AA contrast gate for the design tokens in src/index.css.
// Parses the light (:root) and dark (.dark) token blocks and checks every pair the UI
// actually renders: text pairs need 4.5:1 (1.4.3), non-text UI such as the focus ring,
// state borders, input boundaries and the progress fill need 3:1 (1.4.11).
// Run with `npm run check:contrast`; src/test/contrast.test.ts runs the same check in CI.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEXT = 4.5;
export const UI = 3;

const SURFACES = ['canvas', 'surface', 'surface-muted', 'code-bg'];
const SOFTS = ['brand-soft', 'success-soft', 'error-soft', 'warn-soft'];
const SYNTAX = ['syntax-plain', 'syntax-comment', 'syntax-keyword', 'syntax-string', 'syntax-number', 'syntax-function', 'syntax-tag', 'syntax-punctuation'];

/** [foreground, background, minimum ratio, what it is] */
export const PAIRS = [
  ...[...SURFACES, ...SOFTS].map((bg) => ['text', bg, TEXT, 'body text']),
  ...[...SURFACES, 'brand-soft'].map((bg) => ['text-muted', bg, TEXT, 'secondary text']),
  ...['canvas', 'surface', 'surface-muted', 'brand-soft'].map((bg) => ['brand-strong', bg, TEXT, 'links, active nav, brand text']),
  ['on-primary', 'primary', TEXT, 'primary button'],
  ['on-primary', 'primary-hover', TEXT, 'primary button (hover)'],
  ...['success', 'error', 'warn'].flatMap((tone) => [`${tone}-soft`, 'surface', 'canvas', 'code-bg'].map((bg) => [tone, bg, TEXT, `${tone} text`])),
  ['on-status', 'success', TEXT, 'success button / badge'],
  ['on-status', 'error', TEXT, 'danger button / count badge'],
  ...SYNTAX.map((fg) => [fg, 'code-bg', TEXT, 'code token']),
  // Non-text UI (1.4.11)
  ...['canvas', 'surface', 'surface-muted', 'brand-soft', 'code-bg'].map((bg) => ['focus', bg, UI, 'focus ring']),
  ...['canvas', 'surface', 'surface-muted'].map((bg) => ['brand', bg, UI, 'selected border, progress fill, icons']),
  ...['canvas', 'surface', 'code-bg'].map((bg) => ['border-strong', bg, UI, 'input / control boundary']),
  ...['success', 'error'].map((fg) => [fg, 'surface', UI, 'verdict border']),
];

/** Pulls `--name: #hex;` declarations out of the `:root { }` and `.dark { }` blocks. */
export function parseTokens(css) {
  const block = (selector) => {
    const m = css.match(new RegExp(`(?:^|\\n)${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`));
    if (!m) throw new Error(`No ${selector} block in index.css`);
    return Object.fromEntries(m[1].split(';').slice(0, -1).map(hexToken).filter(Boolean));
  };
  return { light: block(':root'), dark: block('.dark') };
}

const NAME_CHAR = /[\w-]/;
const HEX = /^#[0-9a-f]{3,8}$/i;

/**
 * `--name: #hex` (one `;`-terminated chunk, `;` removed) to [name, hex], else undefined. Same as
 * matching /--([\w-]+)\s*:\s*(#[0-9a-f]{3,8})\s*;/ but in linear time: that regex backtracks
 * quadratically on long runs of `-`.
 */
function hexToken(chunk) {
  const colon = chunk.lastIndexOf(':');
  const value = chunk.slice(colon + 1).trim();
  if (colon === -1 || !HEX.test(value)) return undefined;
  const head = chunk.slice(0, colon).trimEnd();
  let start = head.length;
  while (start > 0 && NAME_CHAR.test(head[start - 1])) start--;
  const word = head.slice(start);
  const dashes = word.indexOf('--');
  return dashes !== -1 && dashes + 2 < word.length ? [word.slice(dashes + 2), value] : undefined;
}

function channel(hex, i) {
  const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of a #rgb / #rrggbb colour. */
export function luminance(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return 0.2126 * channel(h, 0) + 0.7152 * channel(h, 2) + 0.0722 * channel(h, 4);
}

export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Every checked pair for both themes, with `ok` set. Missing tokens count as failures. */
export function checkContrast(css) {
  const themes = parseTokens(css);
  return Object.entries(themes).flatMap(([theme, tokens]) =>
    PAIRS.map(([fg, bg, min, use]) => {
      const missing = !tokens[fg] || !tokens[bg];
      const value = missing ? 0 : ratio(tokens[fg], tokens[bg]);
      return { theme, fg, bg, min, use, ratio: Math.round(value * 100) / 100, ok: !missing && value >= min };
    }),
  );
}

export const CSS_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../src/index.css');

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const results = checkContrast(readFileSync(CSS_PATH, 'utf8'));
  const failures = results.filter((r) => !r.ok);
  const verbose = process.argv.includes('--verbose');
  for (const r of verbose ? results : failures) {
    console.warn(
      `${r.ok ? 'ok  ' : 'FAIL'} ${r.theme.padEnd(5)} ${`--${r.fg}`.padEnd(20)} on ${`--${r.bg}`.padEnd(16)} ${r.ratio.toFixed(2).padStart(5)}:1 (min ${r.min}) ${r.use}`,
    );
  }
  if (failures.length) {
    console.error(`\n${failures.length} of ${results.length} colour pairs are below WCAG 2.2 AA.`);
    process.exit(1);
  }
  console.warn(`All ${results.length} colour pairs meet WCAG 2.2 AA (text ≥ ${TEXT}:1, UI ≥ ${UI}:1).`);
}
