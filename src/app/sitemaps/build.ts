// The sitemaps, built once per build from the registry with <lastmod> from git (see buildSitemaps).
import { execFileSync } from 'node:child_process';
import { buildSitemaps } from '../../seo';

function lastCommitDate(slug: string) {
  try {
    // Sonar S4036 (PATH lookup): a build step in the developer's or CI's trusted environment, fixed argv, no shell.
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', `src/content/subjects/${slug}`], { encoding: 'utf8' }).trim(); // NOSONAR
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
  } catch {
    return undefined; // no git (e.g. a tarball build)
  }
}

let built: ReturnType<typeof buildSitemaps> | undefined;
export const sitemaps = () => (built ??= buildSitemaps(lastCommitDate, new Date().toISOString().slice(0, 10)));

export const xml = (body: string) => new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
export const text = (body: string) => new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
