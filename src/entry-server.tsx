// Server entry for the build-time prerender (scripts/prerender.js). Built with `vite build --ssr`,
// so it shares the registry and components with the client and every route renders the same way.
// The prerender has every subject in full, synchronously (the client loads them per page).
import './content/bank';
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { App, preloadAllPages } from './App';
import { preloadAllViews } from './questions/registry';
import { pageMeta, renderHead } from './seo';

// Every page chunk up front, so render() stays synchronous.
await Promise.all([preloadAllPages(), preloadAllViews()]);

/** The deploy base without its trailing slash ("/jspractice"), or "" at a domain root. */
export const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Renders a router path (e.g. "/q/react/use-effect-cleanup/") to body HTML plus its <head> tags. */
export function render(path: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={basename + path} basename={basename || undefined}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, head: renderHead(pageMeta(path)) };
}

export { pageMeta, renderHead };
export { routeModules as preloadModules } from './preload';
export { buildSitemaps, prerenderPaths, robotsTxt, SITEMAP_INDEX } from './seo/sitemap';
export { LLMS_FULL_TXT, LLMS_TXT, llmsFullTxt, llmsTxt } from './seo/llms';
export { SITE_URL } from './seo/site';
export { SUBJECTS } from './content/registry';
