import { Check, X } from 'lucide-react';
import { cn, inline } from '../../ui';

export type OptionState = 'idle' | 'picked' | 'right' | 'wrong';

const STYLES: Record<OptionState, string> = {
  idle: 'border-line bg-surface hover:border-brand',
  picked: 'border-brand bg-brand-soft',
  right: 'border-success bg-success-soft',
  wrong: 'border-error bg-error-soft',
};

const VERDICT_LABEL: Partial<Record<OptionState, string>> = { right: 'correct answer', wrong: 'your answer, incorrect' };

export function QuizOption({
  index,
  text,
  state,
  checked,
  multi,
  disabled,
  onToggle,
}: {
  index: number;
  text: string;
  state: OptionState;
  checked: boolean;
  multi: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onToggle}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border p-4 text-left text-[15px] leading-6 transition-colors',
        STYLES[state],
        disabled && 'cursor-default',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 grid size-6 shrink-0 place-items-center border border-line bg-surface font-mono text-xs text-text-muted',
          multi ? 'rounded-md' : 'rounded-full',
        )}
      >
        {state === 'right' ? <Check size={14} className="text-success" /> : state === 'wrong' ? <X size={14} className="text-error" /> : index + 1}
      </span>
      <span>
        {inline(text)}
        {VERDICT_LABEL[state] && <span className="sr-only"> ({VERDICT_LABEL[state]})</span>}
      </span>
    </button>
  );
}
