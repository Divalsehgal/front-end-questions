import { LayoutDashboard, Moon, PanelLeftClose, RotateCcw, Settings, Sun, Timer, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ALL, subjectHref, SUBJECTS } from '../../content/registry';
import { isDue, useProgress } from '../../state/progress';
import { setSidebarCollapsed, useSidebar } from '../../state/sidebar';
import { toggleTheme, useTheme } from '../../state/theme';
import { SubjectIcon } from '../icons';
import { cn, MOD } from '../lib';
import { SidebarResizer } from './SidebarResizer';
import type { CSSProperties } from 'react';

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-brand-soft text-brand-strong' : 'text-text-muted hover:bg-surface-muted hover:text-text-main',
  );

function ThemeToggle() {
  const dark = useTheme() === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-main"
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
    >
      {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
}

function SubjectLinks() {
  const progress = useProgress();
  return SUBJECTS.map((s) => {
    const keys = ALL.filter((e) => e.subject.slug === s.slug);
    const solved = keys.filter((e) => progress[e.key]?.status === 'correct').length;
    return (
      <NavLink key={s.slug} to={subjectHref(s.slug)} className={navClass}>
        <SubjectIcon name={s.icon} size={16} className="shrink-0" />
        <span className="truncate whitespace-nowrap">{s.title}</span>
        <span className="ml-auto hidden shrink-0 font-mono text-[11px] text-text-muted tabular-nums md:inline">
          {solved}/{keys.length}
          <span className="sr-only"> solved</span>
        </span>
      </NavLink>
    );
  });
}

export function Sidebar() {
  const progress = useProgress();
  const { width, collapsed } = useSidebar();
  const due = ALL.filter((e) => isDue(progress[e.key])).length;
  return (
    <header
      style={{ '--sidebar-w': `${width}px` } as CSSProperties}
      className={cn(
        'relative flex shrink-0 flex-col border-b border-line bg-surface md:sticky md:top-0 md:h-screen md:w-(--sidebar-w) md:border-r md:border-b-0',
        collapsed && 'md:hidden',
      )}
    >
      {/* Must fit SIDEBAR_MIN: the name gives way before the buttons cross the sidebar's edge. */}
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <NavLink to="/" className="flex min-w-0 items-center gap-2 text-base font-semibold">
          <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-md bg-linear-to-br from-brand to-secondary text-on-primary">
            <Zap size={16} />
          </span>
          <span className="truncate tracking-tight whitespace-nowrap">FE Grind</span>
        </NavLink>
        <div className="flex shrink-0 items-center gap-0.5">
          <NavLink
            to="/settings"
            aria-label="Settings and backups"
            title="Settings and backups"
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-main"
          >
            <Settings size={16} aria-hidden />
          </NavLink>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setSidebarCollapsed(true)}
            className="hidden rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-main md:block"
            aria-label="Hide sidebar"
            title={`Hide sidebar (${MOD}+B)`}
          >
            <PanelLeftClose size={16} aria-hidden />
          </button>
        </div>
      </div>

      <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] md:flex-col md:overflow-y-auto">
        <NavLink to="/" end className={navClass}>
          <LayoutDashboard size={16} aria-hidden /> <span className="whitespace-nowrap">Dashboard</span>
        </NavLink>
        <NavLink to="/review" className={navClass}>
          <RotateCcw size={16} aria-hidden /> <span className="whitespace-nowrap">Review</span>
          {due > 0 && (
            <span className="ml-auto rounded-full bg-error px-2 py-0.5 text-[11px] font-semibold text-on-status">
              {due}
              <span className="sr-only"> due</span>
            </span>
          )}
        </NavLink>
        <NavLink to="/mock" className={navClass}>
          <Timer size={16} aria-hidden /> <span className="whitespace-nowrap">Mock round</span>
        </NavLink>

        <p className="mt-5 mb-1 hidden px-3 font-mono text-[11px] font-medium tracking-widest text-text-muted uppercase md:block">Subjects</p>
        <SubjectLinks />
      </nav>
      <SidebarResizer />
    </header>
  );
}
