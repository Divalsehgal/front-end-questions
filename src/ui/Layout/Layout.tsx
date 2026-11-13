'use client';
import { PanelLeftOpen } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { setSidebarCollapsed, toggleSidebar, useSidebar } from '../../state/sidebar';
import { cn, MOD } from '../lib';
import { Welcome } from '../Welcome';
import { SearchDialog, useSearchShortcut } from './Search';
import { Sidebar } from './Sidebar';
import type { MouseEvent, ReactNode } from 'react';

export const MAIN_ID = 'main-content';

// A plain fragment link (the router leaves hashes alone), plus an explicit focus move so
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

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const { collapsed } = useSidebar();
  const [searching, setSearching] = useState(false);
  const openSearch = useCallback(() => setSearching(true), []);
  useSidebarShortcut();
  useSearchShortcut(openSearch);
  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <a
        href={`#${MAIN_ID}`}
        onClick={skipToContent}
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Sidebar onSearch={openSearch} />
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
        {/* No Suspense here: the server HTML then carries each page inline, and client navigations
            (transitions) keep the current page up until the next one is ready. */}
        {children}
      </main>
      <Welcome />
      {searching && <SearchDialog onClose={() => setSearching(false)} />}
    </div>
  );
}
