type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type __Expect<T extends true> = T;
type __Events = { click: MouseEvent; keyDown: KeyboardEvent };
type __1 = __Expect<__Equal<HandlerProps<__Events>, { onClick?: (event: MouseEvent) => void; onKeyDown?: (event: KeyboardEvent) => void }>>;
type __2 = __Expect<__Equal<HandlerProps<{}>, {}>>;
const __ok: HandlerProps<__Events> = { onKeyDown: (e) => e.key };
// @ts-expect-error the raw event name is not a prop
const __bad: HandlerProps<__Events> = { click: (e: MouseEvent) => {} };
