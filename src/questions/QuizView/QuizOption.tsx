import { Check, X } from 'lucide-react';
import { cn, inline } from '../../ui';
import type { ReactNode } from 'react';

export type OptionState = 'idle' | 'picked' | 'right' | 'wrong';

const STYLES: Record<OptionState, string> = {
  idle: 'border-line bg-surface hover:border-brand',
  picked: 'border-brand bg-brand-soft',
  right: 'border-success bg-success-soft',
  wrong: 'border-error bg-error-soft',
};

const MARKS: Partial<Record<OptionState, ReactNode>> = {
  right: <Check size={14} className="text-success" />,
  wrong: <X size={14} className="text-error" />,
};

const VERDICT_LABEL: Partial<Record<OptionState, string>> = { right: 'correct answer', wrong: 'your answer, incorrect' };

/**
 * One answer: a native radio (single answer) or checkbox (select all that apply), visually hidden
 * inside a card-styled label. Once the question is locked the input stays focusable (aria-disabled,
 * not disabled) so the verdicts can still be read, but changes are ignored.
 */
export function QuizOption({
  name,
  index,
  text,
  state,
  checked,
  multi,
  disabled,
  onToggle,
}: Readonly<{
  name: string;
  index: number;
  text: string;
  state: OptionState;
  checked: boolean;
  multi: boolean;
  disabled: boolean;
  onToggle: () => void;
}>) {
  return (
    <label
      className={cn(
        'flex w-full cursor-pointer items-start gap-3 rounded-lg border p-4 text-left text-[15px] leading-6 transition-colors',
        'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--focus)',
        STYLES[state],
        disabled && 'cursor-default',
      )}
    >
      <input
        type={multi ? 'checkbox' : 'radio'}
        name={name}
        checked={checked}
        aria-disabled={disabled}
        onChange={() => {
          if (!disabled) onToggle();
        }}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'mt-0.5 grid size-6 shrink-0 place-items-center border border-line bg-surface font-mono text-xs text-text-muted',
          multi ? 'rounded-md' : 'rounded-full',
        )}
      >
        {MARKS[state] ?? index + 1}
      </span>
      <span>
        {inline(text)}
        {VERDICT_LABEL[state] && <span className="sr-only"> ({VERDICT_LABEL[state]})</span>}
      </span>
    </label>
  );
}
