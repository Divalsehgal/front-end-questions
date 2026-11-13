type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type __Expect<T extends true> = T;
const __cars = ['tesla', 'bmw'] as const;
type __1 = __Expect<__Equal<TupleToUnion<['a', 'b', 'c']>, 'a' | 'b' | 'c'>>;
type __2 = __Expect<__Equal<TupleToObject<typeof __cars>, { tesla: 'tesla'; bmw: 'bmw' }>>;
type __3 = __Expect<__Equal<Last<[1, 2, 3]>, 3>>;
type __4 = __Expect<__Equal<Last<[]>, never>>;
type __5 = __Expect<__Equal<Length<typeof __cars>, 2>>;
