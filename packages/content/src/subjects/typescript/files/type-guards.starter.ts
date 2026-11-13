export type Admin = { name: string; privileges: string[] };
export type Employee = { name: string; startDate: Date };
export type User = Admin | Employee;

/** A type guard: when it returns true, TypeScript must narrow `user` to Admin. */
export function isAdmin(user: User) {
  // your code
}

export type Shape = { kind: 'circle'; r: number } | { kind: 'square'; size: number } | { kind: 'rect'; w: number; h: number };

/** Area of any shape. Must be exhaustive: adding a new Shape kind should become a compile error here. */
export function area(shape: Shape): number {
  // your code
}

/** Throws at runtime; typed so the compiler proves it is never reached. */
export function assertNever(value: never): never {
  // your code
}
