// Serves `virtual:content-manifest` (see src/content/manifest.ts): the question bank minus question
// bodies, computed from src/content/subjects at build/dev time so it always matches the content.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { normalizePath, runnerImport, type Plugin } from 'vite';
import { contentDates, DATES_LOG_ARGS } from '../src/content/dates';
import { duplicateKeys, toManifest } from '../src/content/manifest';
import type { Subject } from '../src/content/types';

const ID = 'virtual:content-manifest';
const RESOLVED = `\0${ID}`;

/** Question dates from git, or none (with a warning) when history is missing or shallow: never guessed. */
function gitDates(root: string, subjectsDir: string, warn: (msg: string) => void) {
  // Sonar S4036 (PATH lookup): a build step in a trusted environment, fixed argv, no shell.
  const git = (args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }); // NOSONAR
  try {
    if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') {
      warn('Shallow git clone: question dates left out of the JSON-LD (on Vercel, set VERCEL_DEEP_CLONE=true).');
      return {};
    }
    const files: Record<string, string> = {};
    for (const name of readdirSync(subjectsDir, { recursive: true, encoding: 'utf8' })) {
      // Question definitions only: fixtures under files/ have ids of their own.
      if (name.endsWith('.ts') && !name.split('/').includes('files')) {
        files[normalizePath(relative(root, resolve(subjectsDir, name)))] = readFileSync(resolve(subjectsDir, name), 'utf8');
      }
    }
    return contentDates(git(DATES_LOG_ARGS), files);
  } catch {
    warn('No git history: question dates left out of the JSON-LD.');
    return {};
  }
}

export function contentManifest(): Plugin {
  let root = '';
  let subjectsDir = '';
  return {
    name: 'content-manifest',
    configResolved(config) {
      root = config.root;
      subjectsDir = normalizePath(resolve(config.root, 'src/content/subjects'));
    },
    resolveId: (id) => (id === ID ? RESOLVED : undefined),
    async load(id) {
      if (id !== RESOLVED) return;
      const { module } = await runnerImport<{ SUBJECTS: Subject[] }>(resolve(subjectsDir, 'index.ts'), { configFile: false, logLevel: 'error' });
      const manifest = toManifest(
        module.SUBJECTS,
        gitDates(root, subjectsDir, (msg) => this.warn(msg)),
      );
      const dupes = duplicateKeys(manifest);
      if (dupes.length) this.error(`Duplicate question ids: ${dupes.join(', ')}`);
      return `export default ${JSON.stringify(manifest)};`;
    },
    // Editing content in dev regenerates the manifest.
    handleHotUpdate({ file, server, modules }) {
      if (!file.startsWith(`${subjectsDir}/`)) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED);
      if (!mod) return;
      server.moduleGraph.invalidateModule(mod);
      return [...modules, mod];
    },
  };
}
