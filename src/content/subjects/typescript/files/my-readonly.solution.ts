export type MyReadonly<T> = { readonly [P in keyof T]: T[P] };

export type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T // leave functions callable
  : T extends object
    ? { readonly [P in keyof T]: DeepReadonly<T[P]> } // arrays map to readonly arrays too
    : T;
