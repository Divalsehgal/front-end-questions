// Build one object type per key, then index with [K] to turn the map into a union.
// The other keys are `?: never`, so passing a second flag (any value but undefined) is an error.
export type ExclusiveFlags<K extends PropertyKey> = {
  [P in K]: { [Q in P]: boolean } & { [Q in Exclude<K, P>]?: never };
}[K];

export type SignProps = { value: number } & ExclusiveFlags<'isPositive' | 'isNegative' | 'isZero'>;
