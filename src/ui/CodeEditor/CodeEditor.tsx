import { Loader2 } from 'lucide-react';
import { Suspense, useEffect, useRef } from 'react';
import { useTheme } from '../../state/theme';
import { lazyComponent, useHydrated } from '../lib';
import type { Monaco } from './monacoSetup';
import type { OnMount } from '@monaco-editor/react';

// Monaco's React wrapper (and its CDN loader) is only fetched once an editor is on screen.
const MonacoEditor = lazyComponent(() => import('./MonacoEditor').then((m) => m.default));
export const preloadEditor = MonacoEditor.preload;

export function CodeEditor({
  path,
  value,
  onChange,
  onRun,
  onMonaco,
  readOnly,
  label = 'Code editor',
  className = 'h-[70vh] min-h-96',
}: Readonly<{
  /** Determines the language: .ts / .tsx / .html */
  path: string;
  value: string;
  onChange?: (v: string) => void;
  /** Bound to Cmd/Ctrl+Enter. */
  onRun?: () => void;
  onMonaco?: (monaco: Monaco) => void;
  readOnly?: boolean;
  /** Accessible name of the editor's text area. */
  label?: string;
  className?: string;
}>) {
  const theme = useTheme();
  // Monaco loads from a CDN in the browser only; prerendered pages show the loading state until hydrated.
  const hydrated = useHydrated();
  // Keep the keybinding pointing at the latest handler (synced after render, not during it).
  const runRef = useRef(onRun);
  useEffect(() => {
    runRef.current = onRun;
  });
  const onMount: OnMount = (editor, monaco) => {
    onMonaco?.(monaco);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current?.());
  };
  const language = path.endsWith('.html') ? 'html' : 'typescript';
  const loading = (
    <output className="flex items-center gap-2 text-sm text-text-muted">
      <Loader2 aria-hidden className="animate-spin" /> Loading editor…
    </output>
  );
  if (!hydrated) return <div className={className}>{loading}</div>;

  return (
    <div className={className}>
      <Suspense fallback={loading}>
        <MonacoEditor
          path={path}
          language={language}
          value={value}
          onChange={(v) => onChange?.(v ?? '')}
          onMount={onMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          loading={loading}
          options={{
            readOnly,
            ariaLabel: label,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12 },
          }}
        />
      </Suspense>
    </div>
  );
}
