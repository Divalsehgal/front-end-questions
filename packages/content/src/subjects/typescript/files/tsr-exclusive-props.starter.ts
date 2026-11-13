// Props for <Sign value={n} isPositive />: exactly ONE of the flags may be passed.
// Build ExclusiveFlags<K>: a union with one member per key in K, where that key is a
// required boolean and every other key in K is forbidden (hint: `?: never`).
export type ExclusiveFlags<K extends PropertyKey> = { [P in K]?: boolean };

export type SignProps = { value: number } & ExclusiveFlags<'isPositive' | 'isNegative' | 'isZero'>;
