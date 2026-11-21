import { Card } from '../Card';
import type { ReactNode } from 'react';

export function Stat({ value, label }: Readonly<{ value: ReactNode; label: string }>) {
  return (
    <Card className="p-4">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">{value}</p>
    </Card>
  );
}
