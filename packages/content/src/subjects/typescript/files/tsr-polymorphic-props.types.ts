declare function Text<E extends Tag = 'span'>(props: PolymorphicProps<E, TextOwnProps>): void;
Text({ size: 'sm', title: 'hint' });
Text({ as: 'a', href: '/home', target: '_blank', tone: 'primary' });
Text({ as: 'label', htmlFor: 'email' });
Text({ as: 'input', size: 'lg', placeholder: 'Email' });
// @ts-expect-error href is not a label prop
Text({ as: 'label', href: '/home' });
// @ts-expect-error 'p1' is not a tag
Text({ as: 'p1' });
// @ts-expect-error own size replaces input's numeric size
Text({ as: 'input', size: 20 });
// @ts-expect-error tone is still checked
Text({ as: 'a', tone: 'danger' });
