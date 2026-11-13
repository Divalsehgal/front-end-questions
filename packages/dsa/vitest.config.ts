import { workspaceConfig } from '../../vitest.shared';

export default workspaceConfig({
  // src/data is the question tree (data, like the content bank), checked by the app's DSA screen tests.
  coverage: { include: ['src/**'], exclude: ['src/data/**', 'src/generated/**', 'src/**/*.d.ts'] },
});
