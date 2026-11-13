import { workspaceConfig } from '../../vitest.shared';

// Both projects start with the whole question bank loaded and Next's router swapped for a memory router.
const base = ['src/test/bank.ts', 'src/test/next.ts'];

export default workspaceConfig({
  node: base,
  dom: [...base, 'src/test/dom.ts'],
  coverage: {
    include: ['src/**'],
    // Next route files are thin wiring of screens, metadata and build-time steps; src/test is tooling.
    exclude: ['src/app/**', 'src/test/**', 'src/generated/**', 'src/assets/**'],
  },
});
