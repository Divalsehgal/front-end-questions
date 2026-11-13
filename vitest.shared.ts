import { defineConfig } from 'vitest/config';

type Options = {
  /** Setup files for logic tests (*.test.ts, node). */
  node?: string[];
  /** Setup files for component tests (*.test.tsx, jsdom). */
  dom?: string[];
  /** What this workspace's coverage gate measures (test files and barrels are always left out). */
  coverage: { include: string[]; exclude?: string[] };
};

// One test setup for every workspace, so each package's vitest.config.ts only says what is its own.
// Logic tests run in node unless a file opts into jsdom with a `// @vitest-environment jsdom` docblock;
// component tests always run in jsdom. Tests run on Vite (Vitest); the app itself builds with Next.
export function workspaceConfig({ node = [], dom = [], coverage }: Options) {
  return defineConfig({
    // Next's automatic JSX runtime, without a React plugin.
    esbuild: { jsx: 'automatic' },
    test: {
      testTimeout: 30_000,
      passWithNoTests: true,
      projects: [
        { extends: true, test: { name: 'node', environment: 'node', include: ['src/**/*.test.ts'], setupFiles: node } },
        { extends: true, test: { name: 'dom', environment: 'jsdom', include: ['src/**/*.test.tsx'], setupFiles: dom } },
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text-summary', 'lcov'],
        include: coverage.include,
        exclude: ['**/*.test.{ts,tsx}', '**/index.ts', ...(coverage.exclude ?? [])],
        thresholds: { lines: 90, statements: 90, functions: 90, branches: 85 },
      },
    },
  });
}
