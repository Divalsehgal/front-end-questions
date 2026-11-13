// A whole page as the Next routes in src/app put it together (layout shell around a screen), for
// server render and hydration tests.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { Dashboard } from '../screens/Dashboard';
import { QuestionPage } from '../screens/QuestionPage';
import { SubjectPage } from '../screens/SubjectPage';
import { pageMeta } from '../seo';
import { Layout } from '../ui/Layout';
import { setRoute } from './navigation';

const SCREENS = [
  { path: '/q/:subject/:id', Screen: QuestionPage },
  { path: '/s/:subject', Screen: SubjectPage },
  { path: '/', Screen: Dashboard },
];

/** The page at a router path; also points the test router there. */
export function appAt(path: string) {
  const depth = path.split('/').filter(Boolean).length;
  const { path: pattern, Screen } = SCREENS.find((s) => s.path.split('/').filter(Boolean).length === depth) ?? SCREENS[2];
  setRoute(path, pattern);
  return (
    <StrictMode>
      <Layout>
        <Screen />
      </Layout>
    </StrictMode>
  );
}

/** Server HTML of a page plus its head meta, as the build renders it. */
export const renderPage = (path: string) => ({ html: renderToString(appAt(path)), meta: pageMeta(path) });
