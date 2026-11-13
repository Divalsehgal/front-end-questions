import { spawn } from 'node:child_process';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import type { NextConfig } from 'next';

// The one place the public URL lives. Override at build time (SITE_URL=https://example.com/ npm run build);
// the base path is derived from its pathname, so moving to a custom domain is a one-line change.
const DEFAULT_SITE_URL = 'https://front-end-grind.vercel.app/';
const siteUrl = new URL(process.env.SITE_URL || DEFAULT_SITE_URL);
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/';
const basePath = siteUrl.pathname.replace(/\/$/, '');

export default function config(phase: string): NextConfig {
  // Editing content in dev regenerates src/generated (fixtures, manifest). Once per dev server:
  // Next loads this file in more than one process, and the children inherit the flag.
  if (phase === PHASE_DEVELOPMENT_SERVER && !process.env.CONTENT_WATCH) {
    process.env.CONTENT_WATCH = '1';
    spawn(process.execPath, ['scripts/generate-content.mjs', '--watch'], { stdio: 'inherit' }).unref();
  }
  return {
    basePath,
    // Every page lives at <path>/ as it always has, so old links never redirect.
    trailingSlash: true,
    env: { NEXT_PUBLIC_SITE_URL: siteUrl.href, NEXT_PUBLIC_BASE_PATH: basePath },
    reactStrictMode: true,
    poweredByHeader: false,
  };
}
