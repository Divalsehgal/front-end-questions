import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import type { MouseEvent } from 'react';

export const MAIN_ID = 'main-content';

// A plain fragment link (BrowserRouter leaves hashes alone), plus an explicit focus move so
// every browser lands keyboard focus in <main> (focusable via tabIndex={-1}), not just scrolls.
function skipToContent(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const main = document.getElementById(MAIN_ID);
  main?.focus();
  main?.scrollIntoView();
}

export function Layout() {
  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <a
        href={`#${MAIN_ID}`}
        onClick={skipToContent}
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Sidebar />
      <main id={MAIN_ID} tabIndex={-1} className="min-w-0 flex-1">
        {/* Pages are lazy chunks: keep the sidebar up while the first one loads. */}
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
