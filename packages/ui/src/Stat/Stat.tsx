import { Card } from '../Card';
import type { ReactNode } from 'react';

export function Stat({ icon, value, label }: Readonly<{ icon: ReactNode; value: ReactNode; label: string }>) {
  return (
    <Card className="p-4">
      <p className="flex items-center justify-between text-xs text-text-muted">
        {label}
        <span aria-hidden className="text-text-muted">
          {icon}
        </span>
      </p>
      <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">{value}</p>
    </Card>
  );
}
