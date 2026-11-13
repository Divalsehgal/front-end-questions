export type Admin = { name: string; privileges: string[] };
export type Employee = { name: string; startDate: Date };
export type User = Admin | Employee;

// `user is Admin` is a type predicate: a promise TS trusts, so keep the check honest.
export function isAdmin(user: User): user is Admin {
  return 'privileges' in user;
}

export type Shape = { kind: 'circle'; r: number } | { kind: 'square'; size: number } | { kind: 'rect'; w: number; h: number };

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.r ** 2;
    case 'square':
      return shape.size ** 2;
    case 'rect':
      return shape.w * shape.h;
    default:
      return assertNever(shape); // a new kind makes `shape` not-never → compile error
  }
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}
