import { workspaceConfig } from '../../vitest.shared';

// Tests start with the whole question bank loaded (src/bank.ts), as the server routes do.
export default workspaceConfig({
  node: ['src/bank.ts'],
  // The bank's data (subjects) is checked by the content gate (content.test.ts), not measured as code.
  coverage: { include: ['src/registry.ts', 'src/loader.ts', 'src/manifest.ts', 'src/files.ts', 'src/dates.ts'] },
});
