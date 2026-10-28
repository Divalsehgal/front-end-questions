// Renders a machine-coding answer in a sandboxed iframe. React answers are a single
// TSX module whose default export is the component; vanilla answers are an HTML document.
const REACT_VERSION = '19.0.0';
const IMPORT_MAP = {
  imports: {
    react: `https://esm.sh/react@${REACT_VERSION}`,
    'react/': `https://esm.sh/react@${REACT_VERSION}/`,
    'react-dom': `https://esm.sh/react-dom@${REACT_VERSION}?deps=react@${REACT_VERSION}`,
    'react-dom/client': `https://esm.sh/react-dom@${REACT_VERSION}/client?deps=react@${REACT_VERSION}`,
  },
};

// Versions the original machine-coding app used; other packages resolve to latest on esm.sh.
const PINNED: Record<string, string> = {
  'lucide-react': '1.8.0',
  '@base-ui/react': '1.4.0',
  dayjs: '1.11.13',
  clsx: '2.1.1',
  'tailwind-merge': '3.5.0',
};

/** Rewrites bare imports (other than React) to esm.sh, sharing our single React instance. */
export function rewriteImports(code: string) {
  return code.replaceAll(/(\bfrom\s*|\bimport\s*\(?\s*)(['"])([^'"./][^'"]*)\2/g, (match, lead: string, q: string, spec: string) => {
    if (/^(react|react-dom)(\/|$)/.test(spec) || spec.startsWith('http')) return match;
    const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
    const sub = spec.slice(name.length);
    const version = PINNED[name] ? `@${PINNED[name]}` : '';
    return `${lead}${q}https://esm.sh/${name}${version}${sub}?external=react,react-dom${q}`;
  });
}

// Design tokens from the original machine-coding app, so its Tailwind classes (bg-surface,
// text-text-muted, border-border-subtle, …) render the same here.
const TAILWIND_THEME = `
@theme {
  --color-brand-50: oklch(0.97 0.01 250); --color-brand-100: oklch(0.92 0.03 250); --color-brand-200: oklch(0.85 0.08 250);
  --color-brand-300: oklch(0.75 0.15 250); --color-brand-400: oklch(0.65 0.22 250); --color-brand-500: oklch(0.55 0.25 250);
  --color-brand-600: oklch(0.48 0.23 250); --color-brand-700: oklch(0.40 0.20 250); --color-brand-800: oklch(0.32 0.17 250);
  --color-brand-900: oklch(0.25 0.14 250);
  --color-surface: #ffffff; --color-canvas: #f8fafc; --color-muted: #f1f5f9;
  --color-text-main: #0f172a; --color-text-muted: #64748b; --color-text-inverted: #ffffff;
  --color-border-subtle: #e2e8f0; --color-border-strong: #cbd5e1;
  --color-success: oklch(0.65 0.2 150); --color-error: oklch(0.6 0.2 25); --color-warning: oklch(0.8 0.15 85);
  --shadow-soft: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-hard: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --color-error-50: #fef2f2; --color-error-100: #fee2e2; --color-error-500: #ef4444; --color-error-600: #dc2626; --color-error-700: #b91c1c;
  --color-success-50: #f0fdf4; --color-success-100: #dcfce7; --color-success-500: #22c55e; --color-success-600: #16a34a; --color-success-700: #15803d;
  --color-warning-50: #fffbeb; --color-warning-100: #fef3c7; --color-warning-500: #f59e0b; --color-warning-600: #d97706; --color-warning-700: #b45309;
  --color-subtle: #e2e8f0; --color-strong: #cbd5e1; --color-surface-muted: #f1f5f9; --color-surface-sunken: #f1f5f9;
  --text-tiny: 0.625rem;
  --shadow-inner-soft: inset 0 2px 4px 0 rgb(0 0 0 / 0.06);
  --font-display: Inter, system-ui, sans-serif;
  --ease-spring: cubic-bezier(0.4, 0, 0.2, 1.2);
  --animate-shake: shake 0.4s ease-in-out;
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
}

/* A small stand-in for the tailwindcss-animate plugin: animate-in + fade-in / zoom-in-N / slide-in-from-*-N. */
@keyframes enter {
  from {
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(var(--tw-enter-x, 0), var(--tw-enter-y, 0), 0) scale(var(--tw-enter-scale, 1));
  }
}
@utility animate-in { animation: enter 0.2s ease-out; }
@utility fade-in { --tw-enter-opacity: 0; }
@utility zoom-in { --tw-enter-scale: 0.95; }
@utility zoom-in-* { --tw-enter-scale: calc(--value(integer) * 1%); }
@utility slide-in-from-bottom-* { --tw-enter-y: calc(--value(integer) * var(--spacing)); }
@utility slide-in-from-top-* { --tw-enter-y: calc(--value(integer) * var(--spacing) * -1); }
@utility slide-in-from-left-* { --tw-enter-x: calc(--value(integer) * var(--spacing) * -1); }
@utility slide-in-from-right-* { --tw-enter-x: calc(--value(integer) * var(--spacing)); }
@media (prefers-reduced-motion: reduce) { * { animation-duration: 1ms !important; } }
`;

const BASE_CSS = `
  :root { color-scheme: light; font-family: Inter, system-ui, sans-serif; }
  body { margin: 0; padding: 16px; color: #16181d; background: #fff; }
  #__error { display: none; position: fixed; inset: auto 0 0 0; margin: 0; padding: 12px 16px; background: #fdecec; color: #c4312b; font: 12px/1.5 ui-monospace, monospace; white-space: pre-wrap; border-top: 1px solid #f5c2c0; }
`;

// Shows uncaught errors inside the preview instead of a blank frame. The iframe is sandboxed
// without allow-same-origin (so previews can't touch the app's own storage), which makes
// localStorage/sessionStorage throw; swap in per-preview in-memory versions instead.
const ERROR_HOOK = `
  for (const name of ['localStorage', 'sessionStorage']) {
    try { window[name].getItem('probe'); } catch {
      const m = new Map();
      Object.defineProperty(window, name, { configurable: true, value: {
        getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)),
        removeItem: (k) => m.delete(k), clear: () => m.clear(), key: (i) => [...m.keys()][i] ?? null,
        get length() { return m.size; },
      } });
    }
  }
  // Errors and readiness are also posted to the parent, so the dev-only /verify page can check previews.
  const report = (type, message) => parent.postMessage({ source: 'fe-grind-preview', type, message }, '*');
  const show = (msg) => { const el = document.getElementById('__error'); if (el) { el.textContent = msg; el.style.display = 'block'; } report('error', String(msg)); };
  // React previews report readiness after rendering; plain HTML ones after load.
  if (!document.documentElement.hasAttribute('data-react')) window.addEventListener('load', () => setTimeout(() => report('ready'), 1500));
  window.addEventListener('error', (e) => show(e.message));
  window.addEventListener('unhandledrejection', (e) => show(String(e.reason?.message ?? e.reason)));
`;

// IndexedDB also needs a real origin; give previews that use it an in-memory implementation.
const INDEXED_DB_SHIM = `
  const fake = await import('https://cdn.jsdelivr.net/npm/fake-indexeddb@6.0.0/+esm'); // esm.sh's build of it is broken
  Object.defineProperty(window, 'indexedDB', { configurable: true, value: fake.indexedDB });
  Object.defineProperty(window, 'IDBKeyRange', { configurable: true, value: fake.IDBKeyRange });
`;

export async function reactDocument(source: string) {
  const { transform } = await import('sucrase');
  const compiled = transform(source, {
    transforms: ['typescript', 'jsx'],
    jsxRuntime: 'automatic',
    production: true,
  }).code;
  const withImports = rewriteImports(compiled);
  return `<!doctype html><html data-react><head><meta charset="utf-8">
<script type="importmap">${JSON.stringify(IMPORT_MAP)}</script>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.4"></script>
<style type="text/tailwindcss">${TAILWIND_THEME}</style>
<style>${BASE_CSS}</style></head>
<body><div id="root"><p style="color:#888;font:14px system-ui">Loading preview… (first run downloads React and packages)</p></div><pre id="__error"></pre>
<script>${ERROR_HOOK}</script>
<script type="module">
  const source = ${JSON.stringify(withImports)};
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  ${/indexedDB/.test(source) ? INDEXED_DB_SHIM : ''}
  const [{ createRoot }, mod] = await Promise.all([import('react-dom/client'), import(url)]);
  const { jsx } = await import('react/jsx-runtime');
  if (typeof mod.default !== 'function') throw new Error('Export your component as the default export: export default function App() { ... }');
  createRoot(document.getElementById('root')).render(jsx(mod.default, {}));
  setTimeout(() => report('ready'), 1500);
</script></body></html>`;
}

export function vanillaDocument(source: string) {
  // Inject the error hook first so mistakes in the user's script are visible.
  const hook = `<style>${BASE_CSS}</style><pre id="__error"></pre><script>${ERROR_HOOK}</script>`;
  return /<head[^>]*>/i.test(source) ? source.replace(/<head[^>]*>/i, (m) => m + hook) : hook + source;
}
