import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeMonaco } from '../../test/setup';
import { resetMonacoConfig, configureMonaco } from './monacoSetup';
import { CodeEditor, type Monaco } from '.';

// @monaco-editor/react is replaced by a textarea stand-in in src/test/setup.ts.
describe('CodeEditor', () => {
  beforeEach(() => resetMonacoConfig());

  it('renders a labelled editor and reports edits', async () => {
    const onChange = vi.fn();
    render(<CodeEditor path="file:///a.ts" value="" onChange={onChange} label="Your solution" />);
    const editor = screen.getByRole('textbox', { name: 'Your solution' });
    expect(editor).toHaveAttribute('data-path', 'file:///a.ts');
    await userEvent.type(editor, 'x');
    expect(onChange).toHaveBeenLastCalledWith('x');
  });

  it('binds Cmd/Ctrl+Enter to the latest onRun and hands Monaco to onMonaco', () => {
    const first = vi.fn();
    const latest = vi.fn();
    const onMonaco = vi.fn();
    const { rerender } = render(<CodeEditor path="file:///a.ts" value="" onRun={first} onMonaco={onMonaco} />);
    rerender(<CodeEditor path="file:///a.ts" value="" onRun={latest} onMonaco={onMonaco} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', metaKey: true });
    expect(latest).toHaveBeenCalled();
    expect(first).not.toHaveBeenCalled();
    expect(onMonaco).toHaveBeenCalledWith(fakeMonaco);
  });

  it('can be read-only', () => {
    render(<CodeEditor path="file:///a.html" value="<p>" readOnly />);
    expect(screen.getByRole('textbox', { name: 'Code editor' })).toHaveAttribute('readonly');
  });
});

describe('configureMonaco', () => {
  beforeEach(() => resetMonacoConfig());

  it('sets strict TS options and the React type shim once', () => {
    const ts = fakeMonaco.languages.typescript.typescriptDefaults;
    ts.setCompilerOptions.mockClear();
    ts.addExtraLib.mockClear();
    configureMonaco(fakeMonaco as unknown as Monaco);
    configureMonaco(fakeMonaco as unknown as Monaco);
    expect(ts.setCompilerOptions).toHaveBeenCalledTimes(1);
    expect(ts.setCompilerOptions).toHaveBeenCalledWith(expect.objectContaining({ strict: true, noEmit: true }));
    expect(ts.addExtraLib).toHaveBeenCalledWith(expect.stringContaining("declare module 'react'"), expect.stringContaining('@types/react'));
  });
});
