import { cn } from '../lib';
import type { ButtonHTMLAttributes } from 'react';

export const BUTTON_VARIANTS = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'border border-line bg-surface text-text-main hover:bg-surface-muted',
  ghost: 'text-text-muted hover:bg-surface-muted hover:text-text-main',
  success: 'bg-success text-on-status hover:bg-success/90',
  danger: 'bg-error text-on-status hover:bg-error/90',
} as const;

export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

const BASE = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

/** Button styling as a class string, so router <Link>s can look like buttons. */
export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) =>
  cn(BASE, BUTTON_SIZES[size], BUTTON_VARIANTS[variant], className);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize };

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} {...props} className={buttonClass(variant, size, className)} />;
}
