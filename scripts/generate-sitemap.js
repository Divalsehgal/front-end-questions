#!/usr/bin/env node
// Writes dist/sitemap.xml (a sitemap index), dist/sitemaps/<subject>.xml and dist/robots.txt from
// the registry (via the SSR bundle), so every question is listed automatically. <lastmod> is the
// last git commit touching the subject's folder, falling back to today's date.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const { buildSitemaps, robotsTxt, SITE_URL, SITEMAP_INDEX } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);

function lastCommitDate(slug) {
  try {
    // Sonar S4036 (PATH lookup) is suppressed below: a build script in the developer's or CI's trusted environment,
    // run with a fixed argv and no shell.
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', `src/content/subjects/${slug}`], { cwd: root, encoding: 'utf8' }).trim(); // NOSONAR
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
  } catch {
    return undefined; // no git (e.g. a tarball build)
  }
}

const today = new Date().toISOString().slice(0, 10);
const { files, urls } = buildSitemaps(lastCommitDate, today);
for (const [path, xml] of Object.entries(files)) {
  mkdirSync(dirname(join(dist, path)), { recursive: true });
  writeFileSync(join(dist, path), xml);
}
writeFileSync(join(dist, 'robots.txt'), robotsTxt());
console.warn(`Sitemap index ${SITE_URL}${SITEMAP_INDEX}: ${Object.keys(files).length - 1} sitemaps, ${urls.length} URLs`);
