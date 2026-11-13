import { cn } from '../lib';
import type { ButtonHTMLAttributes } from 'react';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Accessible name; also shown as a tooltip. Icon-only buttons must have one. */
  label: string;
};

/** IconButton's look, for icon-only links. */
export const ICON_BUTTON_CLASS =
  'rounded-lg border border-line bg-surface p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-main disabled:cursor-not-allowed disabled:opacity-50';

export function IconButton({ label, className, type = 'button', ...props }: IconButtonProps) {
  return <button type={type} aria-label={label} title={label} {...props} className={cn(ICON_BUTTON_CLASS, className)} />;
}
