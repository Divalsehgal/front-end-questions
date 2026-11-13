import { workspaceConfig } from '../../vitest.shared';

export default workspaceConfig({
  dom: ['src/test/setup.ts'],
  coverage: { include: ['src/**'], exclude: ['src/test/**', 'src/generated/**'] },
});
