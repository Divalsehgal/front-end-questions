// Head meta for the DSA pattern pages (/dsa/...), in the shape the rest of the site uses.
import { absoluteUrl, SITE_NAME } from './site';
import type { PageMeta } from './meta';

const PAGES: Record<string, { title: string; description: string; noindex?: boolean }> = {
  '/dsa/': {
    title: 'DSA patterns: the question tree',
    description: 'LeetCode questions grouped by pattern, from arrays and two pointers to graphs and dynamic programming. Tick off what you have solved.',
  },
  '/dsa/patterns/': {
    title: 'DSA patterns cheat sheet',
    description: 'Every DSA pattern on one page: when to spot it, the key idea, a code template and the questions that use it.',
  },
  '/dsa/drill/': {
    title: 'DSA pattern drill',
    description: 'Flashcards: see a LeetCode question, name its pattern, then reveal the answer.',
    noindex: true,
  },
  '/dsa/dry-run/': {
    title: 'DSA dry runs: step-by-step variable tables',
    description: 'Watch 45 DSA and JavaScript interview solutions run step by step, or paste your own code and trace every variable.',
  },
};

export function dsaMeta(path: keyof typeof PAGES): PageMeta {
  const page = PAGES[path];
  return {
    title: `${page.title} | ${SITE_NAME}`,
    description: page.description,
    canonical: page.noindex ? null : absoluteUrl(path),
    noindex: !!page.noindex,
    ogType: 'website',
    jsonLd: [],
  };
}
