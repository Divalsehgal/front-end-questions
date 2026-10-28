// Re-implement these built-ins without using them.
export type MyPartial<T> = any;
export type MyRequired<T> = any;
export type MyExclude<T, U> = any;
export type MyExtract<T, U> = any;
/** Make only the keys K optional, leave the rest as they are. */
export type PartialBy<T, K extends keyof T> = any;
