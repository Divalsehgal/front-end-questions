import { cn, focusItem, rovingIndex } from '../lib';
import type { KeyboardEvent, ReactNode } from 'react';

const CHIP = 'inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium transition-colors';
const chipState = (on: boolean) => (on ? 'border-brand bg-brand-soft text-brand-strong' : 'border-line text-text-muted hover:text-text-main');

type Labelled = { label?: string; labelledBy?: string };

/** Single-choice pills (a radio group): one tab stop, arrows / Home / End move and select. */
export function Chips<T extends string>({
  value,
  onChange,
  options,
  label,
  labelledBy,
}: Labelled & { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[] }) {
  const current = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = rovingIndex(e, current, options.length);
    if (next === null) return;
    onChange(options[next].value);
    focusItem(e, 'radio', next);
  };
  return (
    <div role="radiogroup" aria-label={label} aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {options.map((o, i) => {
        const on = i === current;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            onKeyDown={onKeyDown}
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(CHIP, chipState(on))}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select pills: each is a toggle button (aria-pressed) with its own tab stop. */
export function ToggleChips<T extends string>({
  selected,
  onChange,
  options,
  label,
  labelledBy,
}: Labelled & { selected: readonly T[]; onChange: (v: T[]) => void; options: { value: T; label: ReactNode }[] }) {
  return (
    <fieldset aria-labelledby={labelledBy} className="flex min-w-0 flex-wrap gap-2">
      {label && <legend className="sr-only">{label}</legend>}
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? selected.filter((x) => x !== o.value) : [...selected, o.value])}
            className={cn(CHIP, chipState(on))}
          >
            {o.label}
          </button>
        );
      })}
    </fieldset>
  );
}
