// Fact readers for scripts/generate-architecture.mjs. Each one reads the repository and returns
// plain data, or null / [] when the file it needs is missing, so a missing file drops a node instead
// of crashing the generator. Nothing here knows about nodes or edges.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export function createReader(root) {
  const path = (p) => join(root, p);
  const exists = (p) => existsSync(path(p));
  const read = (p) => {
    try {
      return readFileSync(path(p), 'utf8');
    } catch {
      return null;
    }
  };
  const json = (p) => {
    try {
      return JSON.parse(read(p) ?? 'null');
    } catch {
      return null;
    }
  };
  const list = (p) => {
    try {
      return readdirSync(path(p)).sort((a, b) => a.localeCompare(b));
    } catch {
      return [];
    }
  };
  /** Every file under a directory (sorted, relative to the root), skipping node_modules and fixtures. */
  const walk = (dir) => {
    const out = [];
    for (const name of list(dir)) {
      const rel = `${dir}/${name}`;
      if (name === 'node_modules' || name === 'files') continue;
      if (statSync(path(rel)).isDirectory()) out.push(...walk(rel));
      else out.push(relative(root, path(rel)).split('\\').join('/'));
    }
    return out;
  };
  return { exists, read, json, list, walk };
}

/** Installed range of a dependency, without the ^ or ~ ("19.0.0"), or null. */
export function depVersion(pkg, name) {
  const v = pkg?.dependencies?.[name] ?? pkg?.devDependencies?.[name];
  return v ? v.replace(/^[\^~]/, '') : null;
}

/** Next App Router paths: one per page.tsx under src/app, with [param] segments as :param ("/", "/s/:subject"). */
export function routes(r) {
  return r
    .walk('src/app')
    .filter((f) => /\/page\.(tsx|ts|jsx|js)$/.test(f))
    .map(
      (f) =>
        `/${f
          .split('/')
          .slice(2, -1)
          .map((seg) => seg.replace(/^\[(.+)\]$/, ':$1'))
          .join('/')}`,
    )
    .sort((a, b) => a.localeCompare(b));
}

/** `process.env.NEXT_PUBLIC_*` names used in app code (tests excluded), plus ones next.config sets. */
export function envVars(r) {
  const names = new Set();
  const sources = [...r.walk('src').filter((f) => /\.(ts|tsx|js|jsx)$/.test(f) && !/\.test\./.test(f)), 'next.config.ts', 'next.config.mjs'];
  for (const f of sources) for (const m of (r.read(f) ?? '').matchAll(/\b(NEXT_PUBLIC_\w+)/g)) names.add(m[1]);
  return [...names].sort((a, b) => a.localeCompare(b));
}

/** localStorage keys: string literals "grind:..." (or any "<app>:<name>" literal) in files that touch localStorage. */
export function localStorageKeys(r) {
  const keys = new Set();
  for (const f of r.walk('src').filter((x) => /\.(ts|tsx)$/.test(x) && !/\.test\./.test(x))) {
    const src = r.read(f) ?? '';
    if (!src.includes('localStorage')) continue;
    for (const m of src.matchAll(/'([a-z][\w-]*:[\w:-]+)'/g)) keys.add(m[1]);
  }
  return [...keys].sort((a, b) => a.localeCompare(b));
}

/** IndexedDB database and store names from src/state/storage/db.ts. */
export function indexedDb(r) {
  const src = r.read('src/state/storage/db.ts');
  if (!src?.includes('indexedDB')) return null;
  return { name: src.match(/DB_NAME\s*=\s*'([^']+)'/)?.[1] ?? 'unknown', store: src.match(/STORE\s*=\s*'([^']+)'/)?.[1] ?? 'unknown' };
}

/** The suggested file name of the File System Access sync, if src/state/storage/fileSync.ts exists. */
export function fileSync(r) {
  const src = r.read('src/state/storage/fileSync.ts');
  if (!src) return null;
  return { file: src.match(/suggestedName:\s*'([^']+)'/)?.[1] ?? 'a JSON file' };
}

/** The CDN URL @monaco-editor/loader fetches Monaco from, read from the installed loader. */
export function monacoCdn(r) {
  for (const f of ['node_modules/@monaco-editor/loader/lib/es/config/index.js', 'node_modules/@monaco-editor/loader/lib/umd/monaco-loader.js']) {
    const url = r.read(f)?.match(/https:\/\/([\w.-]+)\/npm\/(monaco-editor@[\w.-]+)/);
    if (url) return { host: url[1], pkg: url[2] };
  }
  return null;
}

/** Subject folders of the content bank (a content package's src/subjects, or an app's src/content/subjects). */
export function content(r) {
  for (const dir of ['src/subjects', 'src/content/subjects']) {
    const subjects = r.list(dir).filter((d) => r.exists(`${dir}/${d}/index.ts`));
    if (subjects.length) return { dir, subjects, manifest: r.exists('scripts/generate.mjs') || r.exists('scripts/generate-content.mjs') };
  }
  return null;
}

/** All dependencies of several package.json files, as one, for version lookups across a monorepo. */
export function mergedPackage(pkgs) {
  const merged = { dependencies: {}, devDependencies: {} };
  for (const p of pkgs) {
    Object.assign(merged.dependencies, p?.dependencies);
    Object.assign(merged.devDependencies, p?.devDependencies);
  }
  return merged;
}

/** Summary of vercel.json: rewrites, redirects, header rules. */
export function vercel(r) {
  const cfg = r.json('vercel.json');
  if (!cfg) return null;
  return {
    framework: cfg.framework ?? 'static',
    rewrites: (cfg.rewrites ?? []).map((x) => `${x.source} → ${x.destination}`),
    redirects: (cfg.redirects ?? []).length,
    headers: (cfg.headers ?? []).length,
  };
}

/** Workflow name and job ids of each .github/workflows file. */
export function workflows(r) {
  return r
    .list('.github/workflows')
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => {
      const src = r.read(`.github/workflows/${f}`) ?? '';
      const jobs = src.split(/^jobs:\s*$/m)[1] ?? '';
      const on = src.split(/^on:\s*$/m)[1]?.split(/^\S/m)[0] ?? '';
      return {
        file: f,
        name: src.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? f,
        jobs: [...jobs.matchAll(/^ {2}([\w-]+):\s*$/gm)].map((m) => m[1]),
        steps: [...src.matchAll(/^\s*- (?:name|run|uses):/gm)].length,
        triggers: [...on.matchAll(/^ {2}([\w-]+):/gm)].map((m) => m[1].replaceAll('_', ' ')),
      };
    });
}

/** Key=value pairs of sonar-project.properties. */
export function sonar(r) {
  const src = r.read('sonar-project.properties');
  if (!src) return null;
  const get = (k) => src.match(new RegExp(String.raw`^${k.replaceAll('.', String.raw`\.`)}=(.+)$`, 'm'))?.[1]?.trim();
  return { org: get('sonar.organization') ?? 'unknown', project: get('sonar.projectKey') ?? 'unknown' };
}

/** Google Search Console HTML verification files in public/. */
export const searchConsole = (r) => r.list('public').filter((f) => /^google[\da-f]+\.html$/.test(f));

/** Third-party SDKs we know how to label, from package.json dependencies. */
const SDKS = {
  '@sentry/react': 'Sentry',
  '@supabase/supabase-js': 'Supabase',
  '@vercel/analytics': 'Vercel Analytics',
  firebase: 'Firebase',
  'posthog-js': 'PostHog',
  '@stripe/stripe-js': 'Stripe',
};
export const sdks = (pkg) =>
  Object.entries(SDKS)
    .filter(([name]) => depVersion(pkg, name))
    .map(([name, label]) => ({ name, label, version: depVersion(pkg, name) }));

/** Service modules: files under src/services or src/api. */
export const services = (r) => [...r.walk('src/services'), ...r.walk('src/api')].filter((f) => /\.(ts|tsx|js)$/.test(f) && !/\.test\./.test(f));

/** Workspace packages (package.json "workspaces": ["packages/*"]) and their workspace dependencies. */
export function workspaces(r, pkg) {
  const globs = Array.isArray(pkg?.workspaces) ? pkg.workspaces : (pkg?.workspaces?.packages ?? []);
  const dirs = globs.flatMap((g) => (g.endsWith('/*') ? r.list(g.slice(0, -2)).map((d) => `${g.slice(0, -2)}/${d}`) : [g]));
  const pkgs = dirs.map((dir) => ({ dir, pkg: r.json(`${dir}/package.json`) })).filter((x) => x.pkg?.name);
  const names = new Set(pkgs.map((x) => x.pkg.name));
  return pkgs.map(({ dir, pkg: p }) => ({
    dir,
    name: p.name,
    deps: Object.keys({ ...p.dependencies, ...p.devDependencies }).filter((d) => names.has(d)),
  }));
}

/** Other deploy targets: Cloudflare (wrangler.toml / wrangler.json) and Docker. */
export function otherInfra(r) {
  const wrangler = r.read('wrangler.toml') ?? r.read('wrangler.json') ?? r.read('wrangler.jsonc');
  const docker = r.read('Dockerfile');
  return {
    wrangler: wrangler ? { name: wrangler.match(/name"?\s*[=:]\s*"([^"]+)"/)?.[1] ?? 'worker' } : null,
    docker: docker ? { from: docker.match(/^FROM\s+(\S+)/m)?.[1] ?? 'an image' } : null,
  };
}
