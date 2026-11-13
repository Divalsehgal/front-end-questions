type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type __Expect<T extends true> = T;
type __U = { id: number; name?: string };
type __1 = __Expect<__Equal<MyPartial<__U>, { id?: number; name?: string }>>;
type __2 = __Expect<__Equal<MyRequired<__U>, { id: number; name: string }>>;
type __3 = __Expect<__Equal<MyExclude<'a' | 'b' | 'c', 'a'>, 'b' | 'c'>>;
type __4 = __Expect<__Equal<MyExtract<'success' | 'error' | 'loading', 'success' | 'other'>, 'success'>>;
type __5 = __Expect<__Equal<MyExclude<string | number | (() => void), Function>, string | number>>;
const __p: PartialBy<{ a: string; b: number; c: boolean }, 'b' | 'c'> = { a: 'only a is required' };
// @ts-expect-error a is still required
const __q: PartialBy<{ a: string; b: number }, 'b'> = { b: 1 };
