#!/usr/bin/env node
// Build-time static rendering: writes dist/<route>/index.html with full HTML and per-page <head>
// for every route that has content (home, each subject, each question), plus the SPA fallback
// 404.html (the app shell vercel.json rewrites client-only routes to) and .nojekyll. Runs after `vite build` (client) and
// `vite build --ssr src/entry-server.tsx --outDir dist-ssr` (see "build" in package.json).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const started = performance.now();

const { render, renderHead, pageMeta, prerenderPaths, preloadModules, basename } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);
const template = readFileSync(join(dist, 'index.html'), 'utf8');

const HEAD = /<title>[\s\S]*?<\/title>\s*<!--app-head-->/;
const BODY = '<!--app-html-->';
if (!HEAD.test(template) || !template.includes(BODY)) throw new Error('dist/index.html is missing the <!--app-head--> / <!--app-html--> placeholders');

// Vite's build manifest maps source modules to chunks. index.html already preloads the entry's
// imports; each page adds its own lazy chunks (page component, subject content) and their imports,
// so they download in parallel with the entry instead of after it.
const manifestFile = join(dist, '.vite/manifest.json');
const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
const chunksOf = (key, seen = new Set()) => {
  if (!manifest[key]) throw new Error(`${key} is not in the Vite manifest`);
  if (!seen.has(key)) {
    seen.add(key);
    for (const dep of manifest[key].imports ?? []) chunksOf(dep, seen);
  }
  return seen;
};
const inEntry = chunksOf('index.html');
const preloadLinks = (path) => {
  const keys = new Set(preloadModules(path).flatMap((key) => [...chunksOf(key)]));
  return [...keys]
    .filter((key) => !inEntry.has(key))
    .map((key) => `<link rel="modulepreload" crossorigin href="${basename}/${manifest[key].file}">`)
    .join('\n    ');
};

// Function replacers: page HTML contains code with "$&" / "$1", which string replacements would expand.
const page = (head, html) => template.replace(HEAD, () => head).replace(BODY, () => html);

const write = (path, contents) => {
  const file = join(dist, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
};

const paths = prerenderPaths();
let bytes = 0;
for (const path of paths) {
  const { html, head } = render(path);
  if (!html.includes('<h1')) throw new Error(`Prerendered ${path} has no <h1>: did the route redirect?`);
  const out = page(`${head}\n    ${preloadLinks(path)}`, html);
  bytes += out.length;
  write(path === '/' ? 'index.html' : join(path, 'index.html'), out);
}

// 404.html: an empty, noindexed shell the client router
// fills in, so /review, /mock and /session (and stale links) still work.
write('404.html', page(renderHead(pageMeta('/404')), ''));
write('.nojekyll', '');
// Build metadata only: not part of the site.
rmSync(join(dist, '.vite'), { recursive: true, force: true });

const ms = Math.round(performance.now() - started);
console.warn(`Prerendered ${paths.length} pages (avg ${Math.round(bytes / paths.length / 1024)} KB) + 404.html in ${ms} ms`);
