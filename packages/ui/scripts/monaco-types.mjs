#!/usr/bin/env node
// Writes src/generated/monaco-types.json (gitignored): React's real .d.ts files, so the code editor
// type-checks learner code against the same types the app is built with. Turbo runs it as `generate`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

const MONACO_TYPES = [
  '@types/react/index.d.ts',
  '@types/react/global.d.ts',
  '@types/react/jsx-runtime.d.ts',
  '@types/react/jsx-dev-runtime.d.ts',
  '@types/react-dom/index.d.ts',
  '@types/react-dom/client.d.ts',
  'csstype/index.d.ts',
];

// Via each package's own folder: @types/react's "exports" doesn't list its .d.ts files.
const read = (p) => {
  const [, pkg, file] = /^((?:@[^/]+\/)?[^/]+)\/(.+)$/.exec(p);
  return readFileSync(join(dirname(require.resolve(`${pkg}/package.json`)), file), 'utf8');
};
const types = Object.fromEntries(MONACO_TYPES.map((p) => [`file:///node_modules/${p}`, read(p)]));
const file = join(root, 'src/generated/monaco-types.json');
const text = JSON.stringify(types);
let current = null;
try {
  current = readFileSync(file, 'utf8');
} catch {
  // first run
}
if (current !== text) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}
