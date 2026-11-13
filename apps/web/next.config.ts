import type { NextConfig } from 'next';

// The one place the public URL lives. Override at build time (SITE_URL=https://example.com/ npm run build);
// the base path is derived from its pathname, so moving to a custom domain is a one-line change.
const DEFAULT_SITE_URL = 'https://front-end-grind.vercel.app/';
const siteUrl = new URL(process.env.SITE_URL || DEFAULT_SITE_URL);
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/';
const basePath = siteUrl.pathname.replace(/\/$/, '');

// Content regeneration while you edit is the content package's own `dev` task (turbo runs both).
export default function config(): NextConfig {
  return {
    basePath,
    // Every page lives at <path>/ as it always has, so old links never redirect.
    trailingSlash: true,
    env: { NEXT_PUBLIC_SITE_URL: siteUrl.href, NEXT_PUBLIC_BASE_PATH: basePath },
    // Workspace packages ship TypeScript source; Next compiles them with the app.
    transpilePackages: ['@fe-grind/content', '@fe-grind/dsa', '@fe-grind/runtime', '@fe-grind/ui'],
    reactStrictMode: true,
    poweredByHeader: false,
  };
}
