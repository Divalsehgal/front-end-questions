import type { BeforeMount } from '@monaco-editor/react';

export type Monaco = Parameters<BeforeMount>[0];

// React's real type definitions (the versions this repo installs), so the editor knows every export
// (ComponentProps, ReactNode, …) and can suggest them. Loaded on demand: about 1 MB, mostly CSS types.
const loadTypeFiles = () => import('../../generated/monaco-types.json').then((m) => m.default as Record<string, string>);

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
  loadTypeFiles()
    .then((files) => {
      for (const [path, text] of Object.entries(files)) ts.typescriptDefaults.addExtraLib(text, path);
    })
    .catch(() => {
      // Offline or a failed chunk: React imports just stay loosely typed.
    });
};

/** For tests: forget that Monaco was configured. */
export function resetMonacoConfig() {
  configured = false;
}
