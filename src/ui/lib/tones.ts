// Colour roles for status UI. Text colours here all clear 4.5:1 on their soft background
// (enforced by scripts/check-contrast.js), so any tone is safe for small text.
export const TONES = {
  neutral: { bg: 'bg-surface-muted', text: 'text-text-muted', border: 'border-line' },
  brand: { bg: 'bg-brand-soft', text: 'text-brand-strong', border: 'border-brand/40' },
  success: { bg: 'bg-success-soft', text: 'text-success', border: 'border-success/40' },
  warn: { bg: 'bg-warn-soft', text: 'text-warn', border: 'border-warn/40' },
  error: { bg: 'bg-error-soft', text: 'text-error', border: 'border-error/40' },
} as const;

export type Tone = keyof typeof TONES;
