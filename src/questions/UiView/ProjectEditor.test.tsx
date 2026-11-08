import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fakeMonaco } from '../../test/setup';
import { ProjectEditor } from './ProjectEditor';

const root = 'file:///ui-test-models';
const project = (files: Record<string, string>) => JSON.stringify({ files });
const model = (name: string) => fakeMonaco.editor.getModel({ toString: () => `${root}/${name}` });

describe('ProjectEditor', () => {
  it('gives the editor a model for every file, kept in sync, so types flow across files', () => {
    const props = { onCode: () => undefined, root, label: 'Code', onRun: () => undefined };
    const { rerender } = render(<ProjectEditor code={project({ 'App.tsx': 'a', 'lib/x.ts': 'export const x = 1;' })} {...props} />);
    expect(model('lib/x.ts')?.getValue()).toBe('export const x = 1;');
    rerender(<ProjectEditor code={project({ 'App.tsx': 'a', 'lib/x.ts': 'export const x = 2;' })} {...props} />);
    expect(model('lib/x.ts')?.getValue()).toBe('export const x = 2;');
    rerender(<ProjectEditor code="a" {...props} />);
    expect(model('lib/x.ts')).toBeNull();
  });
});
