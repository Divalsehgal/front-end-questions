// A React answer can span several .ts/.tsx files. It is stored as one string (drafts, starters and
// solutions stay plain strings): a lone App.tsx is just its source, more files are JSON.
export const ENTRY = 'App.tsx';
export type Files = Record<string, string>;

export function parseProject(code: string): Files {
  if (code.startsWith('{"files":')) {
    try {
      const { files } = JSON.parse(code) as { files?: unknown };
      if (files && typeof files === 'object' && typeof (files as Files)[ENTRY] === 'string') return files as Files;
    } catch {
      // Not a project after all: treat it as a single file.
    }
  }
  return { [ENTRY]: code };
}

export function serializeProject(files: Files) {
  const names = Object.keys(files);
  return names.length === 1 && names[0] === ENTRY ? files[ENTRY] : JSON.stringify({ files });
}

/** Resolves `./x` / `../x` from `from` to a project file, trying the extensions TypeScript would. */
export function resolveImport(from: string, spec: string, files: Files) {
  const parts = from.split('/').slice(0, -1);
  for (const seg of spec.split('/')) {
    if (seg === '..') parts.pop();
    else if (seg && seg !== '.') parts.push(seg);
  }
  const base = parts.join('/');
  return ['', '.tsx', '.ts', '/index.tsx', '/index.ts'].map((ext) => base + ext).find((p) => Object.hasOwn(files, p));
}

export const normalizePath = (raw: string) => raw.trim().replace(/^\.?\/+/, '');

/** Why a new file path is not allowed, or null if it is fine. */
export function fileNameError(raw: string, existing: string[]) {
  const path = normalizePath(raw);
  if (!/\.tsx?$/.test(path)) return 'Use a .ts or .tsx file name.';
  if (path.split('/').some((seg) => !/^[\w-][\w.-]*$/.test(seg))) return 'Use letters, numbers, - _ . and / between folders.';
  if (existing.includes(path)) return `${path} already exists.`;
  return null;
}

export type TreeRow = { kind: 'folder' | 'file'; path: string; name: string; depth: number };

// Folders before files at each level, then by name: the order an editor's explorer uses.
function comparePaths(a: string, b: string) {
  const x = a.split('/');
  const y = b.split('/');
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] === y[i]) continue;
    const xFolder = i < x.length - 1;
    const yFolder = i < y.length - 1;
    if (xFolder !== yFolder) return xFolder ? -1 : 1;
    return (x[i] ?? '').localeCompare(y[i] ?? '');
  }
  return 0;
}

/** File paths as explorer rows: each folder once, above its contents. */
export function treeRows(paths: string[]): TreeRow[] {
  const rows: TreeRow[] = [];
  const seen = new Set<string>();
  for (const path of [...paths].sort(comparePaths)) {
    const segs = path.split('/');
    segs.slice(0, -1).forEach((name, depth) => {
      const folder = segs.slice(0, depth + 1).join('/');
      if (seen.has(folder)) return;
      seen.add(folder);
      rows.push({ kind: 'folder', path: folder, name, depth });
    });
    rows.push({ kind: 'file', path, name: segs.at(-1) ?? path, depth: segs.length - 1 });
  }
  return rows;
}
