// `& string` drops number/symbol keys so they can go into a template literal.
export type HandlerProps<Events> = {
  [K in keyof Events & string as `on${Capitalize<K>}`]?: (event: Events[K]) => void;
};
