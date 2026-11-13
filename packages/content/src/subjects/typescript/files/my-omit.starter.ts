// Re-implement Omit<T, K> without using Omit, Pick or Exclude.
export type MyOmit<T, K extends keyof any> = any;
