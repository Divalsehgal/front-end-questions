type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type __Expect<T extends true> = T;
const __s = new Stack<number>();
__s.push(1);
// @ts-expect-error only numbers can be pushed
__s.push('two');
const __top: number | undefined = __s.pop();
type __1 = __Expect<__Equal<ReturnType<typeof __s.peek>, number | undefined>>;
