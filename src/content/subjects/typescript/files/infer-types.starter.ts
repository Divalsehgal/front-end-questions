// Use `infer` for all of these (and don't use the built-in ReturnType / Parameters / Awaited).
/** Element type of an array, otherwise T itself. Only one level: Flatten<boolean[][]> is boolean[]. */
export type Flatten<T> = any;
export type MyReturnType<F> = any;
export type MyParameters<F> = any;
/** Unwrap promises recursively: MyAwaited<Promise<Promise<number>>> is number. */
export type MyAwaited<T> = any;
