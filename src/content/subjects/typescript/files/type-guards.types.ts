type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type __Expect<T extends true> = T;
declare const __u: User;
if (isAdmin(__u)) {
  const __p: string[] = __u.privileges;
} else {
  const __d: Date = __u.startDate;
}
type __1 = __Expect<__Equal<ReturnType<typeof isAdmin> extends boolean ? true : false, true>>;
// @ts-expect-error assertNever only accepts never
assertNever('a string');
