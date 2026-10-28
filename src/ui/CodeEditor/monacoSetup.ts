import type { BeforeMount } from '@monaco-editor/react';

export type Monaco = Parameters<BeforeMount>[0];

// Just enough of React's types for machine-coding answers to type-check in the editor
// without shipping @types/react to the browser.
const REACT_SHIM = `
declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type Key = string | number;
  export type CSSProperties = Record<string, string | number>;
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactNode;
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prev: S) => S);
  export type RefObject<T> = { current: T };
  export type ChangeEvent<T = any> = { target: T & { value: string; checked: boolean; files: FileList | null } };
  export type FormEvent<T = any> = { preventDefault(): void; target: T; currentTarget: T };
  export type MouseEvent<T = any> = { preventDefault(): void; stopPropagation(): void; target: any; currentTarget: T; clientX: number; clientY: number };
  export type KeyboardEvent<T = any> = { key: string; preventDefault(): void; target: any; currentTarget: T; shiftKey: boolean; metaKey: boolean; ctrlKey: boolean };
  export type DragEvent<T = any> = MouseEvent<T> & { dataTransfer: DataTransfer };
  export function useState<S>(initial: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  export function useReducer<S, A>(reducer: (state: S, action: A) => S, initial: S): [S, Dispatch<A>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useRef<T>(initial: T): RefObject<T>;
  export function useRef<T>(initial: T | null): RefObject<T | null>;
  export function useRef<T = undefined>(): RefObject<T | undefined>;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: readonly unknown[]): T;
  export interface Context<T> { Provider: FC<{ value: T }>; Consumer: any }
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
  export function useId(): string;
  export function useTransition(): [boolean, (cb: () => void) => void];
  export function useDeferredValue<T>(value: T): T;
  export function useSyncExternalStore<T>(subscribe: (cb: () => void) => () => void, get: () => T): T;
  export function memo<T>(component: T): T;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => ReactNode): FC<P & { ref?: any }>;
  export function lazy<T>(load: () => Promise<{ default: T }>): T;
  export const Fragment: any;
  export const Suspense: FC<{ fallback?: ReactNode }>;
  const React: any;
  export default React;
}
declare module 'react/jsx-runtime' { export const jsx: any; export const jsxs: any; export const Fragment: any; }
declare module 'react-dom/client' { export function createRoot(el: Element): { render(node: any): void; unmount(): void }; }
// Any other package (lucide-react, dayjs, …) loads from esm.sh in the preview; type it loosely.
declare module '*';
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements { [element: string]: any }
  interface ElementChildrenAttribute { children: {} }
}
`;

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
  });
  ts.typescriptDefaults.addExtraLib(REACT_SHIM, 'file:///node_modules/@types/react/index.d.ts');
};

/** For tests: forget that Monaco was configured. */
export function resetMonacoConfig() {
  configured = false;
}
