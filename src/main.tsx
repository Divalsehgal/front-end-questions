import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { legacyRedirectTarget } from './legacyRedirect';
import { preloadRoute } from './preload';
import { hydrateStorage } from './state/sync';
import { applyTheme } from './state/theme';
import './index.css';

const base = import.meta.env.BASE_URL;

// Links from the HashRouter days (…/#/q/react/x) load the real, prerendered page instead
// (same-origin, safe app paths only: see legacyRedirect.ts).
const legacy = legacyRedirectTarget(location.hash, location.origin, base);
if (legacy) location.replace(legacy);
else mount();

function mount() {
  applyTheme();
  // Merge the durable IndexedDB copy (and a synced file) into the localStorage mirror loaded at import.
  hydrateStorage().catch((err: unknown) => console.error(err));
  const root = document.getElementById('root');
  if (!root) throw new Error('index.html is missing <div id="root">');
  const app = (
    <StrictMode>
      <BrowserRouter basename={base.replace(/\/$/, '') || undefined}>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
  // Prerendered pages already contain this route's markup: adopt it. The 404.html shell (and dev) start
  // empty; a server that answers unknown paths with some other page's HTML gets a fresh render.
  if (!root.firstElementChild || !isPrerenderedHere()) return createRoot(root).render(app);
  // Lazy chunks this page shows (modulepreloaded by the prerender) must be in before hydrating,
  // so the first client render matches the HTML exactly.
  const path = '/' + location.pathname.slice(base.length);
  preloadRoute(path)
    .catch((err: unknown) => console.error(err))
    .finally(() => hydrateRoot(root, app));
}

/** The prerendered page's canonical URL names the path it was rendered for. */
function isPrerenderedHere() {
  const href = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  const slash = (p: string) => p.replace(/\/?$/, '/');
  return !!href && slash(new URL(href).pathname) === slash(location.pathname);
}
