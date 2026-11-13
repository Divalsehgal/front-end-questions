// Key remapping with `as`: mapping a key to `never` drops it.
export type MyOmit<T, K extends keyof any> = { [P in keyof T as P extends K ? never : P]: T[P] };
