export type TupleToUnion<T extends readonly unknown[]> = T[number]; // index with number = every element
export type TupleToObject<T extends readonly PropertyKey[]> = { [K in T[number]]: K };
export type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : never;
export type Length<T extends readonly unknown[]> = T['length'];
