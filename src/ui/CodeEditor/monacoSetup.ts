import type { BeforeMount } from '@monaco-editor/react';

export type Monaco = Parameters<BeforeMount>[0];

// React's real type definitions (the versions this repo installs), so the editor knows every export
// (ComponentProps, ReactNode, …) and can suggest them. Loaded on demand: about 1 MB, mostly CSS types.
const TYPE_FILES: Record<string, () => Promise<{ default: string }>> = {
  'file:///node_modules/@types/react/index.d.ts': () => import('/node_modules/@types/react/index.d.ts?raw'),
  'file:///node_modules/@types/react/global.d.ts': () => import('/node_modules/@types/react/global.d.ts?raw'),
  'file:///node_modules/@types/react/jsx-runtime.d.ts': () => import('/node_modules/@types/react/jsx-runtime.d.ts?raw'),
  'file:///node_modules/@types/react/jsx-dev-runtime.d.ts': () => import('/node_modules/@types/react/jsx-dev-runtime.d.ts?raw'),
  'file:///node_modules/@types/react-dom/index.d.ts': () => import('/node_modules/@types/react-dom/index.d.ts?raw'),
  'file:///node_modules/@types/react-dom/client.d.ts': () => import('/node_modules/@types/react-dom/client.d.ts?raw'),
  'file:///node_modules/csstype/index.d.ts': () => import('/node_modules/csstype/index.d.ts?raw'),
};

// Any other package (lucide-react, dayjs, …) loads from esm.sh in the preview; type it loosely.
// A pattern like this is only a fallback, so React still resolves to its real types above.
export const LOOSE_MODULES = "declare module '*';";

let configured = false;
export const configureMonaco: BeforeMount = (monaco) => {
  if (configured) return;
  configured = true;
  const ts = monaco.languages.typescript;
  ts.typescriptDefaults.setCompilerOptions({
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    noEmit: true,
    allowNonTsExtensions: true,
    esModuleInterop: true, // import React from 'react'
  });
  ts.typescriptDefaults.addExtraLib(LOOSE_MODULES, 'file:///node_modules/@types/loose/index.d.ts');
  for (const [path, load] of Object.entries(TYPE_FILES)) {
    load()
      .then((m) => ts.typescriptDefaults.addExtraLib(m.default, path))
      .catch(() => {
        // Offline or a failed chunk: React imports just stay loosely typed.
      });
  }
};

/** For tests: forget that Monaco was configured. */
export function resetMonacoConfig() {
  configured = false;
}
