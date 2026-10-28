export type ClassValue = string | false | null | undefined | 0;

/** Joins class names, skipping falsy values: cn('a', cond && 'b'). */
export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ');
