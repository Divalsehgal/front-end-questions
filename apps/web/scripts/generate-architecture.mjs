#!/usr/bin/env node
// Writes the app's src/generated/architecture.json, the architecture diagram shown at /architecture, from facts
// read out of the code (package.json files, the src/app routes, storage modules, vercel.json, CI config...).
// It reads the whole repository: in a monorepo, every workspace package plus the app (the one with a next.config).
// A node exists only when its fact does, so the diagram follows the system as it changes.
//
//   node scripts/generate-architecture.mjs           write the file
//   node scripts/generate-architecture.mjs --check   exit 1 if the committed file is stale
//   --root <dir>  read another checkout (tests)      --out <file>  write/check another path (tests)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as facts from './architecture/facts.mjs';

const TIERS = ['client', 'compute', 'data'];
const X_GAP = 260;
const Y_GAP = 200;

const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
};
const root = resolve(arg('--root') ?? join(dirname(fileURLToPath(import.meta.url)), '../../..'));

const r = facts.createReader(root);
const rootPkg = r.json('package.json');
// One reader per package: the repository root, then each workspace (a single-app repo has only the root).
const packages = [{ dir: '', r }, ...facts.workspaces(r, rootPkg).map((w) => ({ dir: `${w.dir}/`, r: facts.createReader(join(root, w.dir)) }))];
const app = packages.find((p) => p.r.exists('next.config.ts') || p.r.exists('next.config.mjs')) ?? packages[0];
const a = app.r;
const out = resolve(root, arg('--out') ?? `${app.dir}src/generated/architecture.json`);
const pkg = facts.mergedPackage(packages.map((p) => p.r.json('package.json')));
const v = (name) => facts.depVersion(pkg, name);
/** Facts every package can contribute to (env vars, storage keys), merged. */
const union = (fact) => [...new Set(packages.flatMap((p) => fact(p.r)))].sort((x, y) => x.localeCompare(y));
/** The first package that has this file, as a repo-relative path. */
const findFile = (...files) => packages.flatMap((p) => files.filter((f) => p.r.exists(f)).map((f) => p.dir + f))[0];
const list = (items) => items.join(', ');

const node = (id, type, tier, label, description) => ({ id, type, tier, label, description });
/** `text` when `cond` holds, else '': keeps optional clauses out of nested template literals. */
const when = (cond, text) => (cond ? text : '');

/** The app itself, its packages and what runs at build time. */
function appNodes() {
  const routes = facts.routes(a);
  const env = union(facts.envVars);
  const worker = findFile('src/sandbox.worker.ts', 'src/runtime/sandbox.worker.ts');
  const configured = when(env.length, ', configured by ' + list(env));
  const sucrase = when(v('sucrase'), ' with sucrase ' + v('sucrase'));
  const checked = when(a.exists('scripts/check-build.mjs'), `; ${app.dir}scripts/check-build.mjs checks each page carries its content inline`);
  return [
    v('react') &&
      a.exists('src/app/layout.tsx') &&
      node(
        'spa',
        'frontend',
        'client',
        'Next.js app',
        `Next.js ${v('next') ?? '?'} App Router app (React ${v('react')}) across ${routes.length} routes (${list(routes)})${configured}; every route is its own chunk, and pages that need local progress render in the browser only.`,
      ),
    v('@monaco-editor/react') &&
      node(
        'monaco',
        'frontend',
        'client',
        'Monaco editor',
        `@monaco-editor/react ${v('@monaco-editor/react')} code editor, loaded on demand for coding questions.`,
      ),
    ...facts.workspaces(r, rootPkg).map((w) => {
      const deps = when(w.deps.length, ' that depends on ' + list(w.deps));
      return node(`pkg:${w.name}`, 'frontend', 'client', w.name, `Workspace package in ${w.dir}${deps}.`);
    }),
    worker &&
      node(
        'sandbox',
        'backend',
        'compute',
        'Sandbox Web Worker',
        `A fresh module Web Worker per run (${worker}) compiles learner code${sucrase} and runs it off the main thread, so infinite loops can be killed.`,
      ),
    v('next') &&
      node(
        'prerender',
        'backend',
        'compute',
        'Static generation',
        `At build time next build renders every public route (generateStaticParams) to static HTML${checked}.`,
      ),
    a.exists('src/app/sitemap.xml/route.ts') &&
      node(
        'sitemap',
        'backend',
        'compute',
        'Sitemap and robots',
        `Static route handlers in ${app.dir}src/app build sitemap.xml, per-subject sitemaps, robots.txt and llms.txt from the registry.`,
      ),
  ];
}

/** Hosting, CI and third-party services. */
function serviceNodes() {
  const cdn = v('@monaco-editor/react') && facts.monacoCdn(r);
  const host = facts.vercel(a);
  const ci = facts.workflows(r);
  const sonar = facts.sonar(r);
  const gsc = facts.searchConsole(a);
  const { wrangler, docker } = facts.otherInfra(r);
  const rewrites = when(host?.rewrites.length, ' and rewrites ' + list(host?.rewrites ?? []));
  const ciRuns = ci.map((w) => `${w.file} ("${w.name}", jobs: ${list(w.jobs)}) runs ${w.steps} steps on ${list(w.triggers)}`).join('; ');
  return [
    host &&
      node(
        'vercel',
        'external',
        'compute',
        'Vercel',
        `Serves the ${host.framework} build with ${host.redirects} redirect(s), ${host.headers} header rule(s)${rewrites}.`,
      ),
    wrangler && node('cloudflare', 'external', 'compute', 'Cloudflare Workers', `Deploys the worker "${wrangler.name}" configured in wrangler.`),
    docker && node('docker', 'backend', 'compute', 'Docker image', `Container built from ${docker.from} (Dockerfile).`),
    ...facts.services(a).map((f) => node(`service:${f}`, 'backend', 'compute', f.split('/').at(-1), `Service module ${f}.`)),
    ...facts.sdks(pkg).map((s) => node(`sdk:${s.name}`, 'external', 'compute', s.label, `${s.name} ${s.version} SDK, called from the app.`)),
    cdn &&
      node('cdn', 'external', 'compute', 'jsDelivr CDN', `${cdn.host} hosts ${cdn.pkg}, which @monaco-editor/loader downloads the first time an editor opens.`),
    ci.length && node('ci', 'external', 'compute', 'GitHub Actions', `${ciRuns}.`),
    sonar &&
      node(
        'sonar',
        'external',
        'compute',
        'SonarCloud',
        `Static analysis and coverage for ${sonar.project} (organization ${sonar.org}), configured in sonar-project.properties.`,
      ),
    gsc.length &&
      node('gsc', 'external', 'compute', 'Google Search Console', `Ownership verified by public/${gsc[0]}; crawls the prerendered pages and the sitemap.`),
  ];
}

/** Where progress and content live. */
function dataNodes() {
  const keys = union(facts.localStorageKeys);
  const idb = facts.indexedDb(a);
  const sync = facts.fileSync(a);
  const contentPkg = packages.find((p) => facts.content(p.r));
  const bank = contentPkg && { ...facts.content(contentPkg.r), at: contentPkg.dir };
  const manifest = when(bank?.manifest, ', indexed by a manifest generated at build time');
  return [
    keys.length && node('localStorage', 'data', 'data', 'localStorage', `Synchronous copy read before first paint, under the keys ${list(keys)}.`),
    idb &&
      node(
        'indexedDb',
        'data',
        'data',
        'IndexedDB',
        `Durable copy of progress in the "${idb.name}" database, object store "${idb.store}"; also keeps the synced file's handle.`,
      ),
    sync &&
      node(
        'fileSync',
        'data',
        'data',
        'File sync',
        `Optional File System Access sync of progress to ${sync.file} on disk, which survives clearing browser data.`,
      ),
    bank &&
      node(
        'content',
        'data',
        'data',
        'Content bank',
        `${bank.subjects.length} subjects in ${bank.at}${bank.dir} (${list(bank.subjects)}), each a lazily loaded chunk${manifest}.`,
      ),
  ];
}

/** Each candidate node; a falsy entry (its fact is missing) is dropped. */
const candidates = () => [...appNodes(), ...serviceNodes(), ...dataNodes()].filter(Boolean);

/** [source, target, label, options]: kept only when both ends exist. Two-way pairs bend apart. */
const EDGES = [
  ['vercel', 'spa', 'serves HTML and JS chunks', { animated: true }],
  ['spa', 'monaco', 'lazy-loads for code questions'],
  ['monaco', 'cdn', 'fetches Monaco on first use'],
  ['spa', 'sandbox', 'posts learner code', { animated: true, curvature: 0.5 }],
  ['sandbox', 'spa', 'returns logs and test results', { curvature: -0.5 }],
  ['spa', 'content', 'loads one subject chunk per page', { animated: true }],
  ['spa', 'localStorage', 'writes progress, profile, theme', { curvature: 0.5 }],
  ['localStorage', 'spa', 'hydrates before first paint', { curvature: -0.5 }],
  ['spa', 'indexedDb', 'saves progress', { curvature: 0.5 }],
  ['indexedDb', 'spa', 'restores progress', { curvature: -0.5 }],
  ['spa', 'fileSync', 'writes progress file'],
  ['fileSync', 'indexedDb', 'stores file handle'],
  ['prerender', 'content', 'renders every question'],
  ['prerender', 'vercel', 'static HTML pages'],
  ['sitemap', 'vercel', 'sitemap.xml and robots.txt'],
  ['ci', 'prerender', 'runs the production build'],
  ['ci', 'sonar', 'uploads coverage (lcov)'],
  ['gsc', 'vercel', 'crawls pages and sitemap'],
];

function build() {
  const raw = candidates();
  const ids = new Set(raw.map((n) => n.id));
  const nodes = TIERS.flatMap((tier, row) => {
    const inTier = raw.filter((n) => n.tier === tier);
    return inTier.map(({ id, type, label, description }, i) => ({
      id,
      type,
      tier,
      position: { x: (i - (inTier.length - 1) / 2) * X_GAP, y: row * Y_GAP },
      data: { label, description },
    }));
  });
  const generated = [
    ...facts.workspaces(r, rootPkg).flatMap((w) => w.deps.map((d) => [`pkg:${w.name}`, `pkg:${d}`, 'imports'])),
    ...facts.services(a).map((f) => ['spa', `service:${f}`, 'calls']),
    ...facts.sdks(pkg).map((s) => ['spa', `sdk:${s.name}`, 'reports to']),
  ];
  const edges = [...EDGES, ...generated]
    .filter(([s, t]) => ids.has(s) && ids.has(t))
    .map(([source, target, label, opts = {}]) => ({ id: `${source}->${target}`, source, target, label, ...opts }));
  const title = `${a.read('src/seo/site.ts')?.match(/SITE_NAME\s*=\s*'([^']+)'/)?.[1] ?? rootPkg?.name ?? 'App'} architecture`;
  const subtitle = `${nodes.length} parts and ${edges.length} connections, generated from the code by ${app.dir}scripts/generate-architecture.mjs.`;
  return { title, subtitle, nodes, edges };
}

/** JSON with sorted object keys and a trailing newline, so the output only changes when a fact does. */
function stable(value) {
  const sort = (x) => {
    if (Array.isArray(x)) return x.map(sort);
    if (x && typeof x === 'object')
      return Object.fromEntries(
        Object.keys(x)
          .sort((a, b) => a.localeCompare(b))
          .map((k) => [k, sort(x[k])]),
      );
    return x;
  };
  return `${JSON.stringify(sort(value), null, 2)}\n`;
}

const next = stable(build());
if (process.argv.includes('--check')) {
  let current = null;
  try {
    current = readFileSync(out, 'utf8');
  } catch {
    // Missing counts as stale.
  }
  if (current !== next) {
    console.error(`${out} is out of date with the code. Run \`npm run architecture\` and commit the result.`);
    process.exit(1);
  }
} else {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, next);
}
