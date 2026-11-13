export type Flatten<T> = T extends Array<infer Item> ? Item : T;
export type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;
export type MyParameters<F> = F extends (...args: infer P) => any ? P : never;
export type MyAwaited<T> = T extends PromiseLike<infer V> ? MyAwaited<V> : T;
