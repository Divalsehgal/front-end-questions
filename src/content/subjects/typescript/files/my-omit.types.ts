type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type __Expect<T extends true> = T;
interface __Person { name: string; age: number; email: string }
type __1 = __Expect<__Equal<MyOmit<__Person, 'email'>, { name: string; age: number }>>;
type __2 = __Expect<__Equal<MyOmit<__Person, 'email' | 'age'>, { name: string }>>;
type __3 = __Expect<__Equal<MyOmit<__Person, 'nope'>, { name: string; age: number; email: string }>>;
