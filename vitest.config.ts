import { defineConfig } from 'vitest/config';

// Tests run on Vite (Vitest); the app itself builds with Next (next.config.ts).
export default defineConfig({
  // Next's automatic JSX runtime, without a React plugin.
  esbuild: { jsx: 'automatic' },
  test: {
    testTimeout: 30_000,
    // Two projects: logic tests (*.test.ts) run in node unless a file opts into jsdom with a
    // `// @vitest-environment jsdom` docblock; component tests (*.test.tsx) always run in jsdom
    // with jest-dom matchers, RTL cleanup and a Monaco stub (src/test/setup.ts).
    projects: [
      // Both start with the whole question bank loaded (src/content/bank.ts), as the server routes do.
      { extends: true, test: { name: 'node', environment: 'node', include: ['src/**/*.test.ts'], setupFiles: ['src/content/bank.ts', 'src/test/next.ts'] } },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['src/content/bank.ts', 'src/test/next.ts', 'src/test/setup.ts'],
        },
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
        'src/content/useSubject.ts',
        'src/content/manifest.ts',
        'src/content/files.ts',
        'src/ui/**',
        'src/questions/**',
        'src/screens/**',
        'src/architecture/**',
      ],
      exclude: [
        '**/*.test.{ts,tsx}',
        'src/test/**',
        // Web Worker entry: only runs inside a real browser worker; src/test/sandbox.ts mirrors it for node.
        'src/runtime/sandbox.worker.ts',
        // Barrels: re-exports only.
        'src/**/index.ts',
        // Next route files: thin wiring of screens, metadata and server-only build steps.
        'src/app/**',
      ],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 85 },
    },
  },
});
