// The sitemaps, built from the registry with <lastmod> from git (see buildSitemaps), in a Cache Components
// cache: reading git and today's date is only allowed inside one, and the result is reused until the content
// changes. Content ships with the deploy, so that is 'max'; CONTENT_TAG lets a future content source refresh it
// with revalidateTag(CONTENT_TAG) instead of a rebuild.
import { execFileSync } from 'node:child_process';
import { cacheLife, cacheTag } from 'next/cache';
import { buildSitemaps } from '../../seo';

function lastCommitDate(slug: string) {
  try {
    // The last real edit: paths from the repo root (:(top)), the pre-monorepo path for older history, and
    // renames skipped (-M with no R in --diff-filter), so moving the files is not an update.
    const paths = [`:(top)packages/content/src/subjects/${slug}`, `:(top)src/content/subjects/${slug}`];
    // Sonar S4036 (PATH lookup): a build step in the developer's or CI's trusted environment, fixed argv, no shell.
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--diff-filter=ACDM', '-M', '--', ...paths], { encoding: 'utf8' }).trim(); // NOSONAR
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
  } catch {
    return undefined; // no git (e.g. a tarball build)
  }
}

export const CONTENT_TAG = 'content';

/** Every sitemap file by name (the index plus one per subject and one for pages). */
// eslint-disable-next-line require-await -- 'use cache' functions must be async
export async function sitemaps() {
  'use cache';
  cacheLife('max');
  cacheTag(CONTENT_TAG);
  return buildSitemaps(lastCommitDate, new Date().toISOString().slice(0, 10)).files;
}

export const xml = (body: string) => new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
export const text = (body: string) => new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
