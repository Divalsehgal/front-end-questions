/** ['a', 'b'] → 'a' | 'b' */
export type TupleToUnion<T extends readonly unknown[]> = any;
/** ['tesla', 'bmw'] → { tesla: 'tesla'; bmw: 'bmw' } */
export type TupleToObject<T extends readonly PropertyKey[]> = any;
/** Last element of a tuple, never for an empty one. */
export type Last<T extends readonly unknown[]> = any;
/** Length of a tuple as a number literal. */
export type Length<T extends readonly unknown[]> = any;
