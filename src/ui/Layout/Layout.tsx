import { PanelLeftOpen } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { setSidebarCollapsed, toggleSidebar, useSidebar } from '../../state/sidebar';
import { cn, MOD } from '../lib';
import { Welcome } from '../Welcome';
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

/** Cmd/Ctrl+B shows or hides the sidebar, except while typing (editors keep their own shortcuts). */
function useSidebarShortcut() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'b' || !(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor')) return;
      e.preventDefault();
      toggleSidebar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

export function Layout() {
  const { collapsed } = useSidebar();
  useSidebarShortcut();
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
      {collapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          className="fixed top-3 left-3 z-30 hidden rounded-lg border border-line bg-surface p-2 text-text-muted shadow-sm hover:text-text-main md:block"
          aria-label="Show sidebar"
          title={`Show sidebar (${MOD}+B)`}
        >
          <PanelLeftOpen size={16} aria-hidden />
        </button>
      )}
      {/* With the sidebar hidden, leave room for the floating "show sidebar" button. */}
      <main id={MAIN_ID} tabIndex={-1} className={cn('min-w-0 flex-1', collapsed && 'md:pl-12')}>
        {/* Pages are lazy chunks: keep the sidebar up while the first one loads. */}
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Welcome />
    </div>
  );
}
