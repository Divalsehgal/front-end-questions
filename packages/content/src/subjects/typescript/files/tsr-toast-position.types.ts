type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type __Expect<T extends true> = T;
type __1 = __Expect<
  __Equal<ToastPosition, 'left-top' | 'left-bottom' | 'left-center' | 'right-top' | 'right-bottom' | 'right-center' | 'center-top' | 'center-bottom' | 'center'>
>;
const __ok1: ToastPosition = 'right-bottom';
const __ok2: ToastPosition = 'center';
// @ts-expect-error the redundant combination is excluded
const __bad1: ToastPosition = 'center-center';
// @ts-expect-error horizontal comes first
const __bad2: ToastPosition = 'top-left';
const __len1: CssLength = '12px';
const __len2: CssLength = '1.5rem';
const __len3: CssLength = '50%';
// @ts-expect-error unknown unit
const __len4: CssLength = '12em';
// @ts-expect-error not a number
const __len5: CssLength = 'widepx';
