import { useId } from 'react';
import { cn } from '../lib';
import type { InputHTMLAttributes, ReactNode } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'>;

/** A labelled single-line text input. */
export function TextField({ label, hint, ...props }: Readonly<InputProps & { label: ReactNode; hint?: ReactNode }>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {hint && <span className="ml-1 font-normal text-text-muted">{hint}</span>}
      </label>
      <input
        id={id}
        type="text"
        {...props}
        className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted"
      />
    </div>
  );
}

/** One option of a radio group (wrap several in a <fieldset> with a <legend>), with a title and a hint line. */
export function RadioOption({ title, hint, disabled, ...props }: Readonly<InputProps & { title: ReactNode; hint?: ReactNode }>) {
  return (
    <label
      className={cn(
        'flex gap-3 rounded-lg border border-line p-3 text-sm has-checked:border-brand has-checked:bg-brand-soft',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-surface-muted',
      )}
    >
      <input type="radio" disabled={disabled} {...props} className="mt-1 accent-primary" />
      <span>
        <span className="block font-medium">{title}</span>
        {hint && <span className="block text-text-muted">{hint}</span>}
      </span>
    </label>
  );
}
