import { describe, expect, it } from 'vitest';
import { fileNameError, parseProject, resolveImport, serializeProject, treeRows } from './project';

describe('project', () => {
  it('keeps a lone App.tsx as plain source and round-trips more files', () => {
    expect(serializeProject({ 'App.tsx': 'x' })).toBe('x');
    expect(parseProject('export default 1')).toEqual({ 'App.tsx': 'export default 1' });
    const files = { 'App.tsx': 'a', 'lib/util.ts': 'b' };
    expect(parseProject(serializeProject(files))).toEqual(files);
    expect(parseProject('{"files": broken')).toEqual({ 'App.tsx': '{"files": broken' });
  });

  it('resolves relative imports like TypeScript does', () => {
    const files = { 'App.tsx': '', 'components/Button.tsx': '', 'lib/index.ts': '', 'lib/math.ts': '' };
    expect(resolveImport('App.tsx', './components/Button', files)).toBe('components/Button.tsx');
    expect(resolveImport('components/Button.tsx', '../lib', files)).toBe('lib/index.ts');
    expect(resolveImport('lib/index.ts', './math.ts', files)).toBe('lib/math.ts');
    expect(resolveImport('App.tsx', './missing', files)).toBeUndefined();
  });

  it('only accepts new, well-formed .ts / .tsx paths', () => {
    expect(fileNameError('./components/Button.tsx', ['App.tsx'])).toBeNull();
    expect(fileNameError('styles.css', [])).toMatch(/\.ts or \.tsx/);
    expect(fileNameError('../evil.ts', [])).toMatch(/letters/);
    expect(fileNameError('a//b.ts', [])).toMatch(/letters/);
    expect(fileNameError('App.tsx', ['App.tsx'])).toMatch(/already exists/);
  });

  it('lists folders once, before files', () => {
    const rows = treeRows(['App.tsx', 'lib/util.ts', 'components/ui/Button.tsx', 'components/Card.tsx']);
    expect(rows.map((r) => `${'  '.repeat(r.depth)}${r.name}`)).toEqual(['components', '  ui', '    Button.tsx', '  Card.tsx', 'lib', '  util.ts', 'App.tsx']);
  });
});
