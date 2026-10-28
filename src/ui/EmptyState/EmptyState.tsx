import { Card } from '../Card';
import type { ReactNode } from 'react';

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span aria-hidden className="shrink-0 text-brand-strong">
        {icon}
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        {children && <p className="text-sm text-text-muted">{children}</p>}
      </div>
    </Card>
  );
}
