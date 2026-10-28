import { cn } from '../lib';
import type { ReactNode } from 'react';

const WIDTHS = { narrow: 'max-w-3xl', default: 'max-w-5xl', wide: 'max-w-7xl' } as const;

export function Page({ children, width = 'default' }: { children: ReactNode; width?: keyof typeof WIDTHS }) {
  return <div className={cn('mx-auto px-4 py-8 sm:px-8', WIDTHS[width])}>{children}</div>;
}

export function PageHeader({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <div className="mt-1 max-w-2xl text-text-muted">{description}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children, icon, id }: { children: ReactNode; icon?: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-10 mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-text-muted uppercase">
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </h2>
  );
}
