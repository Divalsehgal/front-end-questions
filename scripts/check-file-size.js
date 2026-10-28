// Pre-commit gate: no staged source file under src/ may exceed MAX_LINES lines.
// ESLint's max-lines enforces this for TS/JS; this also catches CSS/SCSS and anything else.
// Code fixtures (src/content/subjects/**/files/**) are user-facing content, exempt by design, and so is
// src/generated/: machine-written output (CI checks it is current), not code anyone edits.
import { execFileSync } from 'node:child_process';

const MAX_LINES = 250;
const FIXTURE = /^src\/content\/subjects\/[^/]+\/files\//;
const GENERATED = /^src\/generated\//;

// Sonar S4036 (PATH lookup) is suppressed on the git calls: a local pre-commit hook in the developer's own trusted
// environment, run with a fixed argv and no shell.
const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], { encoding: 'utf8' }) // NOSONAR
  .split('\n')
  .filter((f) => f.startsWith('src/') && !FIXTURE.test(f) && !GENERATED.test(f));

const tooLong = staged
  .map((file) => {
    const blob = execFileSync('git', ['show', `:${file}`], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }); // NOSONAR
    return { file, lines: blob.split('\n').length - (blob.endsWith('\n') ? 1 : 0) };
  })
  .filter(({ lines }) => lines > MAX_LINES);

if (tooLong.length) {
  console.error(`Staged files over ${MAX_LINES} lines:`);
  for (const { file, lines } of tooLong) console.error(`  ${file} (${lines})`);
  process.exit(1);
}
