#!/usr/bin/env node
// Writes the content build inputs into src/generated/ (gitignored):
//   files/<subject>.json       each subject's code fixtures (src/subjects/<subject>/files/*) as strings
//   content-manifest.json      the question bank minus question bodies, with git dates (src/manifest.ts)
// Turbo runs it (the `generate` task) before dev, build, typecheck and tests; `--watch` keeps it current.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, watch, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runnerImport } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const subjectsDir = join(root, 'src/subjects');
const out = join(root, 'src/generated');
const repoRoot = join(root, '../..');


/** Writes only when the contents changed, so a dev server doesn't reload for nothing. */
function write(path, text) {
  const file = join(out, path);
  let current = null;
  try {
    current = readFileSync(file, 'utf8');
  } catch {
    // new file
  }
  if (current === text) return;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}

function writeFixtures() {
  for (const slug of readdirSync(subjectsDir)) {
    const dir = join(subjectsDir, slug, 'files');
    let names;
    try {
      names = readdirSync(dir).sort((a, b) => a.localeCompare(b));
    } catch {
      continue; // a subject without fixtures
    }
    write(`files/${slug}.json`, JSON.stringify(Object.fromEntries(names.map((n) => [n, readFileSync(join(dir, n), 'utf8')]))));
  }
}


/** Question dates from git, or none (with a warning) when history is missing or shallow: never guessed. */
function gitDates(contentDates, logArgs) {
  // Sonar S4036 (PATH lookup): a build step in a trusted environment, fixed argv, no shell.
  const git = (args) => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }); // NOSONAR
  try {
    if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') {
      console.warn('Shallow git clone: question dates left out of the JSON-LD (on Vercel, set VERCEL_DEEP_CLONE=true).');
      return {};
    }
    const files = {};
    for (const name of readdirSync(subjectsDir, { recursive: true, encoding: 'utf8' })) {
      // Question definitions only: fixtures under files/ have ids of their own.
      if (name.endsWith('.ts') && !name.split('/').includes('files')) {
        files[relative(repoRoot, join(subjectsDir, name)).split('\\').join('/')] = readFileSync(join(subjectsDir, name), 'utf8');
      }
    }
    return contentDates(git(logArgs), files);
  } catch {
    console.warn('No git history: question dates left out of the JSON-LD.');
    return {};
  }
}

async function writeManifest() {
  const load = (p) => runnerImport(join(root, p), { configFile: false, logLevel: 'error' }).then((r) => r.module);
  const [{ SUBJECTS }, { toManifest, duplicateKeys }, { contentDates, DATES_LOG_ARGS }] = await Promise.all([
    load('src/subjects/index.ts'),
    load('src/manifest.ts'),
    load('src/dates.ts'),
  ]);
  const manifest = toManifest(SUBJECTS, gitDates(contentDates, DATES_LOG_ARGS));
  const dupes = duplicateKeys(manifest);
  if (dupes.length) throw new Error(`Duplicate question ids: ${dupes.join(', ')}`);
  write('content-manifest.json', `${JSON.stringify(manifest)}\n`);
}

async function generate() {
  writeFixtures(); // first: the subject modules the manifest step imports read these
  await writeManifest();
}

await generate();

if (process.argv.includes('--watch')) {
  let timer;
  watch(subjectsDir, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => generate().catch((err) => console.error(err)), 100);
  });
}
