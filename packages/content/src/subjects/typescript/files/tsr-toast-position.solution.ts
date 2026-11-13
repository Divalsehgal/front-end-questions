export type Horizontal = 'left' | 'right' | 'center';
export type Vertical = 'top' | 'bottom' | 'center';

// A template literal over unions expands to their cross product; Exclude drops the redundant one.
export type ToastPosition = Exclude<`${Horizontal}-${Vertical}`, 'center-center'> | 'center';

// `${number}` matches any numeric string, so this checks the shape, not just "some string".
export type CssLength = `${number}${'px' | 'rem' | '%'}`;
