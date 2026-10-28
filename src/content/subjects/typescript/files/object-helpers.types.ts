type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type __Expect<T extends true> = T;
const __user = { name: 'Alice', age: 30 };
type __1 = __Expect<__Equal<ReturnType<typeof getProperty<typeof __user, 'name'>>, string>>;
const __n: number = getProperty(__user, 'age');
// @ts-expect-error 'email' is not a key of user
getProperty(__user, 'email');
// @ts-expect-error age must be a number
update(__user, { age: '29' });
// @ts-expect-error unknown keys are rejected
update(__user, { nickname: 'Al' });
const __p: [string, number] = pair('hello', 42);
