// What a prerendered route needs loaded before it can hydrate: its page chunk and, for a question
// page, the question's subject (content) and view (UI for its kind). main.tsx awaits these; the
// prerender emits <link rel="modulepreload"> for the same modules so they download in parallel.
import { pageFor, pageModule, preloadPage } from './App';
import { preloadPath, subjectForPath, subjectModule } from './content/loader';
import { getEntry, keyOf } from './content/registry';
import { preloadView, viewModule } from './questions/registry';

const kindFor = (path: string) => {
  const subject = subjectForPath(path);
  return subject ? getEntry(keyOf(subject, path.split('/')[3]))?.q.kind : undefined;
};

export function preloadRoute(path: string) {
  const kind = kindFor(path);
  return Promise.all([preloadPage(path), preloadPath(path), kind && preloadView(kind)]);
}

/** Source modules (Vite manifest keys) behind preloadRoute(path). */
export function routeModules(path: string) {
  const page = pageFor(path);
  const subject = subjectForPath(path);
  const kind = kindFor(path);
  return [page && pageModule(page), subject && subjectModule(subject), kind && viewModule(kind)].filter((m): m is string => !!m);
}
