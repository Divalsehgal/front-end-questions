import { cn, TONES, type Tone } from '../lib';
import type { ReactNode } from 'react';

/** Coloured panel for verdicts and explanations. Pass role="status" when it appears in response to an action. */
export function Callout({
  tone = 'brand',
  title,
  icon,
  role,
  children,
}: {
  tone?: Tone;
  title?: ReactNode;
  icon?: ReactNode;
  role?: 'status' | 'alert' | 'note';
  children: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <div role={role} className={cn('rounded-xl border p-4', t.border, t.bg)}>
      {title && (
        <p className={cn('mb-1 flex items-center gap-2 text-sm font-semibold', t.text)}>
          {icon}
          {title}
        </p>
      )}
      <div className="text-[15px] leading-7 text-text-main">{children}</div>
    </div>
  );
}
