#!/usr/bin/env node
// Writes src/generated/architecture.json, the architecture diagram shown at /architecture, from facts
// read out of the code (package.json, the ROUTES table, storage modules, vercel.json, CI config...).
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
const root = resolve(arg('--root') ?? join(dirname(fileURLToPath(import.meta.url)), '..'));
const out = resolve(root, arg('--out') ?? 'src/generated/architecture.json');

const r = facts.createReader(root);
const pkg = r.json('package.json');
const v = (name) => facts.depVersion(pkg, name);
const list = (items) => items.join(', ');

/** Each candidate node: its fact (falsy drops it) and how to describe it from that fact. */
function candidates() {
  const routes = facts.routes(r);
  const env = facts.envVars(r);
  const keys = facts.localStorageKeys(r);
  const idb = facts.indexedDb(r);
  const sync = facts.fileSync(r);
  const cdn = v('@monaco-editor/react') && facts.monacoCdn(r);
  const bank = facts.content(r);
  const host = facts.vercel(r);
  const ci = facts.workflows(r);
  const sonar = facts.sonar(r);
  const gsc = facts.searchConsole(r);
  const { wrangler, docker } = facts.otherInfra(r);
  const node = (id, type, tier, label, description) => ({ id, type, tier, label, description });

  return [
    v('react') &&
      r.exists('src/App.tsx') &&
      node(
        'spa',
        'frontend',
        'client',
        'React SPA',
        `React ${v('react')} app routed by react-router-dom ${v('react-router-dom') ?? '?'} across ${routes.length} routes (${list(routes)})` +
          `${env.length ? `, configured by ${list(env)}` : ''}; every page is its own lazily loaded chunk.`,
      ),
    v('@monaco-editor/react') &&
      node(
        'monaco',
        'frontend',
        'client',
        'Monaco editor',
        `@monaco-editor/react ${v('@monaco-editor/react')} code editor, loaded on demand for coding questions.`,
      ),
    ...facts
      .workspaces(r, pkg)
      .map((w) =>
        node(`pkg:${w.name}`, 'frontend', 'client', w.name, `Workspace package in ${w.dir}${w.deps.length ? ` that depends on ${list(w.deps)}` : ''}.`),
      ),
    r.exists('src/runtime/sandbox.worker.ts') &&
      node(
        'sandbox',
        'backend',
        'compute',
        'Sandbox Web Worker',
        `A fresh module Web Worker per run (src/runtime/sandbox.worker.ts) compiles learner code${v('sucrase') ? ` with sucrase ${v('sucrase')}` : ''} and runs it off the main thread, so infinite loops can be killed.`,
      ),
    r.exists('scripts/prerender.js') &&
      r.exists('src/entry-server.tsx') &&
      node(
        'prerender',
        'backend',
        'compute',
        'Static prerender',
        'At build time scripts/prerender.js renders every public route through the SSR bundle of src/entry-server.tsx into static HTML in dist/.',
      ),
    r.exists('scripts/generate-sitemap.js') &&
      node(
        'sitemap',
        'backend',
        'compute',
        'Sitemap generator',
        'scripts/generate-sitemap.js writes sitemap.xml, per-subject sitemaps and robots.txt from the registry.',
      ),
    host &&
      node(
        'vercel',
        'external',
        'compute',
        'Vercel',
        `Serves the static ${host.output}/ build (framework: ${host.framework}) with ${host.redirects} redirect(s), ${host.headers} header rule(s)` +
          `${host.rewrites.length ? ` and rewrites ${list(host.rewrites)}` : ''}.`,
      ),
    wrangler && node('cloudflare', 'external', 'compute', 'Cloudflare Workers', `Deploys the worker "${wrangler.name}" configured in wrangler.`),
    docker && node('docker', 'backend', 'compute', 'Docker image', `Container built from ${docker.from} (Dockerfile).`),
    ...facts
      .viteProxies(r)
      .map((p) => node(`proxy:${p.path}`, 'backend', 'compute', `API ${p.path}`, `Dev server proxies ${p.path} to ${p.target} (vite.config).`)),
    ...facts.services(r).map((f) => node(`service:${f}`, 'backend', 'compute', f.split('/').at(-1), `Service module ${f}.`)),
    ...facts.sdks(pkg).map((s) => node(`sdk:${s.name}`, 'external', 'compute', s.label, `${s.name} ${s.version} SDK, called from the app.`)),
    cdn &&
      node('cdn', 'external', 'compute', 'jsDelivr CDN', `${cdn.host} hosts ${cdn.pkg}, which @monaco-editor/loader downloads the first time an editor opens.`),
    ci.length &&
      node(
        'ci',
        'external',
        'compute',
        'GitHub Actions',
        `${ci.map((w) => `${w.file} ("${w.name}", jobs: ${list(w.jobs)}) runs ${w.steps} steps on ${list(w.triggers)}`).join('; ')}.`,
      ),
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
        `${bank.subjects.length} subjects in src/content/subjects (${list(bank.subjects)}), each a lazily loaded chunk` +
          `${bank.manifest ? ', indexed by the virtual:content-manifest Vite plugin' : ''}.`,
      ),
  ].filter(Boolean);
}

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
  ['prerender', 'vercel', 'static pages in dist/'],
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
    ...facts.workspaces(r, pkg).flatMap((w) => w.deps.map((d) => [`pkg:${w.name}`, `pkg:${d}`, 'imports'])),
    ...facts.viteProxies(r).map((p) => ['spa', `proxy:${p.path}`, `fetch ${p.path}`]),
    ...facts.services(r).map((f) => ['spa', `service:${f}`, 'calls']),
    ...facts.sdks(pkg).map((s) => ['spa', `sdk:${s.name}`, 'reports to']),
  ];
  const edges = [...EDGES, ...generated]
    .filter(([s, t]) => ids.has(s) && ids.has(t))
    .map(([source, target, label, opts = {}]) => ({ id: `${source}->${target}`, source, target, label, ...opts }));
  const title = `${r.read('src/seo/site.ts')?.match(/SITE_NAME\s*=\s*'([^']+)'/)?.[1] ?? pkg?.name ?? 'App'} architecture`;
  const subtitle = `${nodes.length} parts and ${edges.length} connections, generated from the code by scripts/generate-architecture.mjs.`;
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
