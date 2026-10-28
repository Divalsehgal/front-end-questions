import { cn, focusItem, rovingIndex } from '../lib';
import type { KeyboardEvent, ReactNode } from 'react';

export type TabItem<T extends string> = { value: T; label: string; icon?: ReactNode };

export const tabId = (id: string, value: string) => `${id}-tab-${value}`;
export const panelId = (id: string) => `${id}-panel`;

/**
 * WAI-ARIA tabs with automatic activation: one tab stop, arrows / Home / End move and select.
 * Render the content in a <TabPanel id={sameId} value={value}> so the tab and panel are linked.
 */
export function Tabs<T extends string>({
  id,
  label,
  value,
  onChange,
  tabs,
  trailing,
}: {
  /** Shared with the matching TabPanel. */
  id: string;
  /** Accessible name for the tab list. */
  label: string;
  value: T;
  onChange: (v: T) => void;
  tabs: TabItem<T>[];
  trailing?: ReactNode;
}) {
  const current = Math.max(
    0,
    tabs.findIndex((t) => t.value === value),
  );
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = rovingIndex(e, current, tabs.length);
    if (next === null) return;
    onChange(tabs[next].value);
    focusItem(e, 'tab', next);
  };

  return (
    <div className="flex items-center gap-1 border-b border-line">
      <div role="tablist" aria-label={label} className="flex items-center gap-1">
        {tabs.map((t, i) => {
          const selected = i === current;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              onKeyDown={onKeyDown}
              id={tabId(id, t.value)}
              aria-selected={selected}
              aria-controls={panelId(id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(t.value)}
              className={cn(
                '-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                selected ? 'border-brand text-brand-strong' : 'border-transparent text-text-muted hover:text-text-main',
              )}
            >
              {t.icon && <span aria-hidden>{t.icon}</span>}
              {t.label}
            </button>
          );
        })}
      </div>
      {trailing && <div className="ml-auto flex items-center gap-2">{trailing}</div>}
    </div>
  );
}

export function TabPanel({ id, value, className, children }: { id: string; value: string; className?: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={panelId(id)} aria-labelledby={tabId(id, value)} className={className}>
      {children}
    </div>
  );
}
