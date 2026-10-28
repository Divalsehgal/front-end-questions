export type MyPartial<T> = { [P in keyof T]?: T[P] };
export type MyRequired<T> = { [P in keyof T]-?: T[P] }; // -? removes optionality
// Conditional types distribute over unions, so each member is tested on its own.
export type MyExclude<T, U> = T extends U ? never : T;
export type MyExtract<T, U> = T extends U ? T : never;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };
