import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { contentManifest } from './vite-plugins/content-manifest';
import type { Plugin } from 'vite';

// The one place the public URL lives. Override at build time (SITE_URL=https://example.com/ npm run build);
// Vite's `base` is derived from its pathname, so moving to a custom domain is a one-line change.
const DEFAULT_SITE_URL = 'https://front-end-grind.vercel.app/';
const siteUrl = new URL(process.env.SITE_URL || DEFAULT_SITE_URL);
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/';

// Search Console ownership tag, set from the GOOGLE_SITE_VERIFICATION env var (a repo variable in CI) so
// verifying needs no code change. Every prerendered page inherits it from index.html.
const googleVerification = (process.env.GOOGLE_SITE_VERIFICATION ?? '').trim();
const siteVerification: Plugin = {
  name: 'site-verification',
  transformIndexHtml: () =>
    googleVerification ? [{ tag: 'meta', attrs: { name: 'google-site-verification', content: googleVerification }, injectTo: 'head' }] : [],
};

export default defineConfig({
  base: siteUrl.pathname,
  define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl.href) },
  plugins: [react(), tailwindcss(), contentManifest(), siteVerification],
  worker: { format: 'es' },
  test: {
    testTimeout: 30_000,
    // Two projects: logic tests (*.test.ts) run in node unless a file opts into jsdom with a
    // `// @vitest-environment jsdom` docblock; component tests (*.test.tsx) always run in jsdom
    // with jest-dom matchers, RTL cleanup and a Monaco stub (src/test/setup.ts).
    projects: [
      // Both start with the whole question bank loaded (src/content/bank.ts), as the prerender does.
      { extends: true, test: { name: 'node', environment: 'node', include: ['src/**/*.test.ts'], setupFiles: ['src/content/bank.ts'] } },
      {
        extends: true,
        test: { name: 'dom', environment: 'jsdom', include: ['src/**/*.test.tsx'], setupFiles: ['src/content/bank.ts', 'src/test/setup.ts'] },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
      include: [
        'src/seo/**',
        'src/runtime/**',
        'src/state/**',
        'src/content/registry.ts',
        'src/content/loader.ts',
        'src/content/manifest.ts',
        'src/content/files.ts',
        'src/ui/**',
        'src/questions/**',
        'src/pages/**',
        'src/architecture/**',
      ],
      exclude: [
        '**/*.test.{ts,tsx}',
        'src/test/**',
        // Web Worker entry: only runs inside a real browser worker; src/test/sandbox.ts mirrors it for node.
        'src/runtime/sandbox.worker.ts',
        // Barrels: re-exports only.
        'src/**/index.ts',
      ],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 85 },
    },
  },
  build: {
    // Each subject's questions are their own lazily loaded chunk (src/content/loader.ts), and code
    // that only runs on demand (sucrase, Monaco, the sandbox) is dynamically imported, so no manual
    // chunking: Rollup's default split keeps each page's initial JS to what it renders.
    // The manifest lets scripts/prerender.js modulepreload a question page's subject chunk.
    manifest: true,
    rollupOptions: {
      // prism-react-renderer declares side effects, but it only builds its own Prism instance (no
      // globals): treating it as pure keeps it out of chunks that never highlight code.
      treeshake: { moduleSideEffects: (id) => !id.includes('/node_modules/prism-react-renderer/') },
      output: {
        // The small shared building blocks (ui kit minus the code components, state, kind labels) as
        // one chunk instead of a dozen sub-kilobyte ones: fewer requests per page.
        manualChunks: (id) => (/\/src\/(ui\/(?!CodeBlock|CodeEditor|LivePreview|Prose|code\.ts)|state\/|questions\/kinds)/.test(id) ? 'ui' : undefined),
      },
    },
  },
});
