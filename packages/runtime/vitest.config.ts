import { workspaceConfig } from '../../vitest.shared';

export default workspaceConfig({
  // The Web Worker entry only runs in a real browser worker (node/sandbox.ts mirrors it); node/* is test tooling.
  coverage: { include: ['src/**'], exclude: ['src/sandbox.worker.ts', 'src/node/**'] },
});
