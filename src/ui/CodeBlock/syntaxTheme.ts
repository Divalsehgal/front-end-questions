import type { PrismTheme } from 'prism-react-renderer';

// Token colours point at CSS variables (src/index.css), so one theme serves light and dark
// and every colour is covered by the contrast check against --code-bg.
const v = (name: string) => `var(--syntax-${name})`;

export const syntaxTheme: PrismTheme = {
  plain: { color: v('plain'), backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: v('comment'), fontStyle: 'italic' } },
    { types: ['keyword', 'boolean', 'important', 'atrule', 'rule'], style: { color: v('keyword') } },
    { types: ['string', 'char', 'attr-value', 'regex', 'template-string', 'inserted', 'url'], style: { color: v('string') } },
    { types: ['number', 'constant', 'symbol', 'unit'], style: { color: v('number') } },
    { types: ['function', 'class-name', 'builtin', 'maybe-class-name', 'attr-name', 'selector'], style: { color: v('function') } },
    { types: ['tag', 'deleted', 'namespace', 'property'], style: { color: v('tag') } },
    { types: ['punctuation', 'operator'], style: { color: v('punctuation') } },
  ],
};
