// 1. Re-implement Readonly<T>.
export type MyReadonly<T> = any;

// 2. DeepReadonly: readonly all the way down through objects and arrays (functions stay as they are).
export type DeepReadonly<T> = any;
