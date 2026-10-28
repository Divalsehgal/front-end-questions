const __a: SignProps = { value: 3, isPositive: true };
const __b: SignProps = { value: -3, isNegative: true };
const __c: SignProps = { value: 0, isZero: true };
// @ts-expect-error two flags at once
const __d: SignProps = { value: 1, isPositive: true, isZero: true };
// @ts-expect-error one flag is required
const __e: SignProps = { value: 1 };
// @ts-expect-error value is still required
const __f: SignProps = { isPositive: true };
type __Pair = ExclusiveFlags<'a' | 'b'>;
const __g: __Pair = { a: false };
// @ts-expect-error a and b together
const __h: __Pair = { a: true, b: false };
