// Pre-commit gate: no staged source file under src/ may exceed MAX_LINES lines.
// ESLint's max-lines enforces this for TS/JS; this also catches CSS/SCSS and anything else.
// Code fixtures (src/content/subjects/**/files/**) are user-facing content, exempt by design.
import { execFileSync } from 'node:child_process';

const MAX_LINES = 250;
const FIXTURE = /^src\/content\/subjects\/[^/]+\/files\//;

const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f.startsWith('src/') && !FIXTURE.test(f));

const tooLong = staged
  .map((file) => {
    const blob = execFileSync('git', ['show', `:${file}`], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    return { file, lines: blob.split('\n').length - (blob.endsWith('\n') ? 1 : 0) };
  })
  .filter(({ lines }) => lines > MAX_LINES);

if (tooLong.length) {
  console.error(`Staged files over ${MAX_LINES} lines:`);
  for (const { file, lines } of tooLong) console.error(`  ${file} (${lines})`);
  process.exit(1);
}
