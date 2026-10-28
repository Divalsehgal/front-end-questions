// Split out of CodeEditor so @monaco-editor/react loads on demand (see the lazy import there).
import Editor, { type EditorProps } from '@monaco-editor/react';
import { configureMonaco } from './monacoSetup';

export default function MonacoEditor(props: EditorProps) {
  return <Editor beforeMount={configureMonaco} {...props} />;
}
