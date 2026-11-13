type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type __Expect<T extends true> = T;
interface __Todo { title: string; description: string; completed: boolean }
type __1 = __Expect<__Equal<MyPick<__Todo, 'title'>, { title: string }>>;
type __2 = __Expect<__Equal<MyPick<__Todo, 'title' | 'completed'>, { title: string; completed: boolean }>>;
// @ts-expect-error 'invalid' is not a key of Todo
type __3 = MyPick<__Todo, 'title' | 'invalid'>;
