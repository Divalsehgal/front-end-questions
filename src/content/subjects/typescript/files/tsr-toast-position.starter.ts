export type Horizontal = 'left' | 'right' | 'center';
export type Vertical = 'top' | 'bottom' | 'center';

// 1. Every `${Horizontal}-${Vertical}` combination, except 'center-center', plus the shorthand 'center'.
export type ToastPosition = string;

// 2. A CSS length like '12px', '1.5rem' or '50%' (any number followed by one of those units).
export type CssLength = string;
