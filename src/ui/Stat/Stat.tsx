import { Card } from '../Card';
import type { ReactNode } from 'react';

export function Stat({ icon, value, label }: Readonly<{ icon: ReactNode; value: ReactNode; label: string }>) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-strong">
        {icon}
      </span>
      <div>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-xs text-text-muted">{label}</p>
      </div>
    </Card>
  );
}
