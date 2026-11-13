#!/usr/bin/env node
// After `next build`: every public page (home, subjects, questions) must be in the static HTML in
// full, with its <h1>, and not streamed into a hidden <div> (a Suspense boundary around the page
// does that, and crawlers that don't run JS would see an empty page).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const app = join(import.meta.dirname, '../.next/server/app');
// On Vercel the build adapter keeps prerendered pages in its own output, not here. CI (and every local
// build) runs this check on the same commit, so Vercel skips it rather than fail on a missing file.
if (process.env.VERCEL) {
  console.warn('Static HTML check: skipped on Vercel (CI runs it)');
  process.exit(0);
}
// Cache Components also emits fallback shells for param routes (s/[subject].html); those aren't pages.
const pages = ['index.html', ...readdirSync(app, { recursive: true, encoding: 'utf8' }).filter((f) => /^[sq]\/.+\.html$/.test(f) && !f.includes('['))];
const bad = pages.filter((f) => {
  const html = readFileSync(join(app, f), 'utf8');
  return !html.includes('<h1') || html.includes('<template id="B:');
});
if (pages.length < 100 || bad.length) {
  console.error(`Static HTML check failed (${pages.length} pages): ${bad.slice(0, 10).join(', ') || 'too few pages'}`);
  process.exit(1);
}
console.warn(`Static HTML check: ${pages.length} pages, each with its <h1> inline`);
