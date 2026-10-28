const _d = debounce((id: string, n: number) => {}, 10);
_d('a', 1);
// @ts-expect-error wrong argument type must be rejected
_d(1, 1);
_d.cancel();
_d.flush();
