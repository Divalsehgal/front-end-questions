// No React here: this map stands in for JSX.IntrinsicElements (tag -> its native props).
export interface IntrinsicProps {
  span: { title?: string };
  a: { href?: string; target?: '_blank' | '_self' };
  label: { htmlFor?: string };
  input: { size?: number; placeholder?: string };
}
export type Tag = keyof IntrinsicProps;

export type TextOwnProps = { size?: 'sm' | 'md' | 'lg'; tone?: 'primary' | 'secondary' };

// Omit first: intersecting would intersect clashing props (input's `size: number` & 'sm' = never).
// In React: Own & { as?: E } & Omit<ComponentPropsWithoutRef<E>, keyof Own | 'as'>.
export type PolymorphicProps<E extends Tag, Own> = Own & { as?: E } & Omit<IntrinsicProps[E], keyof Own | 'as'>;
