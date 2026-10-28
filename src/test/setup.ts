// Setup for component tests (the "dom" vitest project): jest-dom matchers, DOM cleanup
// between tests, and a lightweight stand-in for Monaco, which can't run in jsdom.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, vi } from 'vitest';
import { preloadEditor } from '../ui/CodeEditor';

// jsdom doesn't implement layout: give the scrolling APIs harmless stand-ins.
Element.prototype.scrollIntoView = function scrollIntoView() {};
window.scrollTo = (() => {}) as typeof window.scrollTo;

// Lazily loaded UI renders synchronously once preloaded, as it does after main.tsx's preload.
await preloadEditor();

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

type EditorProps = {
  value?: string;
  path?: string;
  onChange?: (v: string | undefined) => void;
  onMount?: (editor: unknown, monaco: unknown) => void;
  beforeMount?: (monaco: unknown) => void;
  options?: { readOnly?: boolean; ariaLabel?: string };
};

/** Minimal fake of the monaco namespace: enough for configureMonaco and Cmd/Ctrl+Enter bindings. */
export const fakeMonaco = {
  KeyMod: { CtrlCmd: 2048 },
  KeyCode: { Enter: 3 },
  languages: {
    typescript: {
      ScriptTarget: { ESNext: 99 },
      ModuleKind: { ESNext: 99 },
      ModuleResolutionKind: { NodeJs: 2 },
      JsxEmit: { ReactJSX: 4 },
      typescriptDefaults: { setCompilerOptions: vi.fn(), addExtraLib: vi.fn() },
    },
  },
};

vi.mock('@monaco-editor/react', () => ({
  // A textarea that behaves like the editor: Cmd/Ctrl+Enter runs the bound command.
  default: function FakeEditor({ value, path, onChange, onMount, beforeMount, options }: EditorProps) {
    const commands: (() => void)[] = [];
    beforeMount?.(fakeMonaco);
    onMount?.({ addCommand: (_key: number, run: () => void) => commands.push(run) }, fakeMonaco);
    return createElement('textarea', {
      'aria-label': options?.ariaLabel ?? 'Code editor',
      'data-path': path,
      className: 'monaco-editor',
      readOnly: options?.readOnly,
      value: value ?? '',
      onChange: (e: { target: { value: string } }) => onChange?.(e.target.value),
      onKeyDown: (e: { key: string; metaKey: boolean; ctrlKey: boolean }) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commands.forEach((run) => run());
      },
    });
  },
  loader: { init: vi.fn(() => Promise.resolve(fakeMonaco)) },
}));
