import { lazy, Suspense } from 'react';
import { matchRoutes, Navigate, Route, Routes } from 'react-router-dom';
import { Seo } from './seo';
import { Layout } from './ui/Layout';
import { lazyComponent } from './ui/lib';

// Each page is its own chunk, so a page downloads only its own code (the dashboard never loads
// the question views, syntax highlighter or editor). main.tsx preloads the current route's page
// before hydrating; the prerender loads them all (src/entry-server.tsx).
const PAGES = {
  dashboard: lazyComponent(() => import('./pages/Dashboard').then((m) => m.Dashboard)),
  subject: lazyComponent(() => import('./pages/SubjectPage').then((m) => m.SubjectPage)),
  question: lazyComponent(() => import('./pages/QuestionPage').then((m) => m.QuestionPage)),
  review: lazyComponent(() => import('./pages/Review').then((m) => m.Review)),
  mock: lazyComponent(() => import('./pages/MockSetup').then((m) => m.MockSetup)),
  session: lazyComponent(() => import('./pages/SessionSummary').then((m) => m.SessionSummary)),
};

const ROUTES: { path?: string; index?: true; page: keyof typeof PAGES }[] = [
  { index: true, page: 'dashboard' },
  { path: 's/:subject', page: 'subject' },
  { path: 'q/:subject/:id', page: 'question' },
  { path: 'review', page: 'review' },
  { path: 'mock', page: 'mock' },
  { path: 'session', page: 'session' },
];

/** Which page a router path (without the deploy base) renders. */
export const pageFor = (pathname: string) =>
  (matchRoutes([{ path: '/', children: ROUTES }], pathname)?.at(-1)?.route as (typeof ROUTES)[number] | undefined)?.page;

/** Loads the page component a router path renders. */
export function preloadPage(pathname: string) {
  const page = pageFor(pathname);
  return page ? PAGES[page].preload() : Promise.resolve();
}

/** Source module of each page, for the prerender's per-page <link rel="modulepreload">s. */
export const pageModule = (page: keyof typeof PAGES) => `src/pages/${PAGE_DIRS[page]}/index.ts`;
const PAGE_DIRS: Record<keyof typeof PAGES, string> = {
  dashboard: 'Dashboard',
  subject: 'SubjectPage',
  question: 'QuestionPage',
  review: 'Review',
  mock: 'MockSetup',
  session: 'SessionSummary',
};

export const preloadAllPages = () => Promise.all(Object.values(PAGES).map((p) => p.preload()));

// Dev-only content health check: runs every question's checks (see src/pages/Verify).
const Verify = import.meta.env.DEV ? lazy(() => import('./pages/Verify')) : null;

export function App() {
  return (
    <>
      <Seo />
      <Routes>
        <Route element={<Layout />}>
          {ROUTES.map(({ path, index, page }) => {
            const Page = PAGES[page];
            return index ? <Route key={page} index element={<Page />} /> : <Route key={page} path={path} element={<Page />} />;
          })}
          {Verify && (
            <Route
              path="verify"
              element={
                <Suspense fallback={null}>
                  <Verify />
                </Suspense>
              }
            />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
