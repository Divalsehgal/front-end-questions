// Serves `virtual:content-manifest` (see src/content/manifest.ts): the question bank minus question
// bodies, computed from src/content/subjects at build/dev time so it always matches the content.
import { resolve } from 'node:path';
import { normalizePath, runnerImport, type Plugin } from 'vite';
import { duplicateKeys, toManifest } from '../src/content/manifest';
import type { Subject } from '../src/content/types';

const ID = 'virtual:content-manifest';
const RESOLVED = `\0${ID}`;

export function contentManifest(): Plugin {
  let subjectsDir = '';
  return {
    name: 'content-manifest',
    configResolved(config) {
      subjectsDir = normalizePath(resolve(config.root, 'src/content/subjects'));
    },
    resolveId: (id) => (id === ID ? RESOLVED : undefined),
    async load(id) {
      if (id !== RESOLVED) return;
      const { module } = await runnerImport<{ SUBJECTS: Subject[] }>(resolve(subjectsDir, 'index.ts'), { configFile: false, logLevel: 'error' });
      const manifest = toManifest(module.SUBJECTS);
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
