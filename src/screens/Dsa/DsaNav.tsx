'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../ui/lib';

export const DSA_VIEWS = [
  { href: '/dsa/', label: 'Tree' },
  { href: '/dsa/patterns/', label: 'Patterns' },
  { href: '/dsa/drill/', label: 'Drill' },
  { href: '/dsa/dry-run/', label: 'Dry run' },
];

const slash = (p: string) => (p.endsWith('/') ? p : `${p}/`);

/** The four DSA views as links: same place on every view, so switching never moves the page. */
export function DsaNav() {
  const path = slash(usePathname());
  return (
    <nav aria-label="DSA views" className="flex w-fit gap-0.5 rounded-lg bg-surface-muted p-1">
      {DSA_VIEWS.map((v) => {
        const on = path === v.href;
        return (
          <Link
            key={v.href}
            href={v.href}
            aria-current={on ? 'page' : undefined}
            className={cn(
              'rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
              on ? 'bg-surface text-text-main shadow-sm' : 'text-text-muted hover:text-text-main',
            )}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
