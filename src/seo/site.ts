// Public identity of the site. SITE_URL comes from vite.config.ts (env SITE_URL at build time),
// so canonical URLs, the sitemap and Open Graph tags all follow a domain change automatically.
const FALLBACK = 'https://front-end-questions-lilac.vercel.app/';

/** Absolute site root, always ending in "/". */
export const SITE_URL = withSlash((import.meta.env.VITE_SITE_URL as string | undefined) ?? FALLBACK);
export const SITE_NAME = 'FE Grind';
export const AUTHOR = 'Dival Sehgal';
export const THEME_COLOR = '#0d2149';
export const OG_IMAGE = 'og-image.png';
export const SITE_DESCRIPTION =
  'Free frontend interview practice: JavaScript, TypeScript, React, Next.js, HTML, CSS, DSA, system design and more. Quizzes, output prediction, coding drills and machine coding. No login.';

/** Routes that only make sense with local progress; kept out of the index and the sitemap. */
export const NOINDEX_ROUTES = ['/review', '/mock', '/session', '/verify'];

function withSlash(url: string) {
  return url.endsWith('/') ? url : `${url}/`;
}

/** Router path (no base) with exactly one trailing slash: "/q/js/x" -> "/q/js/x/". "/" stays "/". */
export function normalizePath(path: string) {
  const clean = `/${path.split(/[?#]/)[0].replaceAll(/^\/+|\/+$/g, '')}`;
  return clean === '/' ? '/' : `${clean}/`;
}

/** Absolute URL for a router path, e.g. "/s/react" -> "https://…/s/react/". */
export const absoluteUrl = (path: string) => SITE_URL + normalizePath(path).slice(1);

export const isNoindex = (path: string) => NOINDEX_ROUTES.some((r) => normalizePath(path) === `${r}/`);
