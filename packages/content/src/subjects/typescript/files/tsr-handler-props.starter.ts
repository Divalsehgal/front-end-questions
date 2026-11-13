// Turn an event map into optional React-style handler props:
// { click: MouseEvent; keyDown: KeyboardEvent } -> { onClick?: (e: MouseEvent) => void; onKeyDown?: (e: KeyboardEvent) => void }
// Hint: key remapping with `as` plus a template literal and the built-in Capitalize.
export type HandlerProps<Events> = { [K in keyof Events]: Events[K] };
