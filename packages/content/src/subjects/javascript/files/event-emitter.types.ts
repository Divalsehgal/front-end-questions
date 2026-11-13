type _Events = { login: { userId: string }; logout: void; count: number };
const _e = new Emitter<_Events>();
_e.on('login', (p) => p.userId.toUpperCase());
// @ts-expect-error payload has no `id`
_e.emit('login', { id: 1 });
// @ts-expect-error login requires a payload
_e.emit('login');
// @ts-expect-error logout takes no payload
_e.emit('logout', 123);
// @ts-expect-error unknown event name
_e.on('nope', () => {});
// @ts-expect-error count's payload is a number, not a string
_e.on('count', (n: string) => {});
