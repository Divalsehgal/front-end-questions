import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CodeBlock, syntaxTheme } from '.';

describe('CodeBlock', () => {
  it('numbers lines with CSS counters, so the text is exactly the source', () => {
    const { container } = render(<CodeBlock code={'const a = 1;\nconsole.log(a);'} lang="js" />);
    const pre = container.querySelector('pre')!;
    expect(pre).toHaveClass('bg-code');
    const code = pre.querySelector('code')!;
    expect(code).toHaveClass('[counter-reset:line]');
    const rows = [...code.children];
    expect(rows.map((r) => r.textContent)).toEqual(['const a = 1;', 'console.log(a);']);
    for (const r of rows) expect(r.className).toMatch(/before:\[counter-increment:line\]/);
  });

  it('colours tokens from the --syntax-* CSS variables so both themes are covered', () => {
    const { container } = render(<CodeBlock code="// note" lang="js" />);
    const comment = [...container.querySelectorAll('span')].find((s) => s.textContent === '// note' && s.style.color);
    expect(comment?.style.color).toBe('var(--syntax-comment)');
    expect(syntaxTheme.plain.color).toBe('var(--syntax-plain)');
    for (const s of syntaxTheme.styles) expect(String(s.style.color)).toMatch(/^var\(--syntax-/);
  });
});
