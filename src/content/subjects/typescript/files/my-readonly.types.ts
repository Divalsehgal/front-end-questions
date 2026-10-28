type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type __Expect<T extends true> = T;
type __Cfg = { a: string; nested: { b: number; list: { c: boolean }[] }; fn: () => void };
type __1 = __Expect<__Equal<MyReadonly<{ a: string; b: number }>, { readonly a: string; readonly b: number }>>;
declare const __ro: MyReadonly<{ a: string }>;
// @ts-expect-error cannot assign to a readonly property
__ro.a = 'x';
declare const __deep: DeepReadonly<__Cfg>;
// @ts-expect-error nested objects are readonly too
__deep.nested.b = 1;
// @ts-expect-error arrays become readonly arrays
__deep.nested.list.push({ c: true });
// @ts-expect-error items inside arrays are readonly
__deep.nested.list[0].c = false;
__deep.fn();
type __2 = __Expect<__Equal<DeepReadonly<string>, string>>;
