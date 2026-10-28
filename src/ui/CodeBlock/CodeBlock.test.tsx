import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CodeBlock, syntaxTheme } from '.';

describe('CodeBlock', () => {
  it('renders each line with a decorative line number', () => {
    const { container } = render(<CodeBlock code={'const a = 1;\nconsole.log(a);'} lang="js" />);
    const pre = container.querySelector('pre')!;
    expect(pre).toHaveClass('bg-code');
    expect(pre.querySelector('code')).toBeInTheDocument();
    const numbers = [...pre.querySelectorAll('[aria-hidden="true"]')].map((n) => n.textContent);
    expect(numbers).toEqual(['1', '2']);
    expect(pre).toHaveTextContent('const a = 1;');
  });

  it('colours tokens from the --syntax-* CSS variables so both themes are covered', () => {
    const { container } = render(<CodeBlock code="// note" lang="js" />);
    const comment = [...container.querySelectorAll('span')].find((s) => s.textContent === '// note' && s.style.color);
    expect(comment?.style.color).toBe('var(--syntax-comment)');
    expect(syntaxTheme.plain.color).toBe('var(--syntax-plain)');
    for (const s of syntaxTheme.styles) expect(String(s.style.color)).toMatch(/^var\(--syntax-/);
  });
});
