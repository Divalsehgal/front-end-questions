// No React here: this map stands in for JSX.IntrinsicElements (tag -> its native props).
export interface IntrinsicProps {
  span: { title?: string };
  a: { href?: string; target?: '_blank' | '_self' };
  label: { htmlFor?: string };
  input: { size?: number; placeholder?: string };
}
export type Tag = keyof IntrinsicProps;

export type TextOwnProps = { size?: 'sm' | 'md' | 'lg'; tone?: 'primary' | 'secondary' };

// PolymorphicProps<E, Own>: your own props, an optional `as: E`, and the native props of E,
// where your own props (and `as`) REPLACE any native prop with the same name.
export type PolymorphicProps<E extends Tag, Own> = any;
