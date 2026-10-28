import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { inline, parseBlocks, Prose } from '.';

describe('inline', () => {
  it('renders `code` and **bold**, leaving the rest as text', () => {
    render(<p data-testid="p">{inline('Use `useMemo` for **expensive** work, not * or ``.')}</p>);
    const p = screen.getByTestId('p');
    expect(within(p).getByText('useMemo').tagName).toBe('CODE');
    expect(within(p).getByText('expensive').tagName).toBe('STRONG');
    expect(p).toHaveTextContent('Use useMemo for expensive work, not * or ``.');
  });
});

describe('parseBlocks', () => {
  it('splits paragraphs, bullets, tables and fences', () => {
    const text = ['Intro line', '', '- one', '- two', '', '| a | b |', '| - | - |', '| 1 | 2 |', '', '```ts', 'const x = 1;', '```', 'After'].join('\n');
    expect(parseBlocks(text)).toEqual([
      { type: 'paragraph', text: 'Intro line' },
      { type: 'list', items: ['one', 'two'] },
      { type: 'table', head: ['a', 'b'], rows: [['1', '2']] },
      { type: 'code', code: 'const x = 1;', lang: 'ts' },
      { type: 'paragraph', text: 'After' },
    ]);
  });

  it('splits a lead-in sentence from the bullets that follow it', () => {
    expect(parseBlocks('Reasons:\n- fast\n* small\nThat is all.')).toEqual([
      { type: 'paragraph', text: 'Reasons:' },
      { type: 'list', items: ['fast', 'small'] },
      { type: 'paragraph', text: 'That is all.' },
    ]);
  });

  it('handles several and unclosed fences', () => {
    expect(parseBlocks('```\na\n```\nmid\n```js\nb')).toEqual([
      { type: 'code', code: 'a', lang: undefined },
      { type: 'paragraph', text: 'mid' },
      { type: 'code', code: 'b', lang: 'js' },
    ]);
  });

  it('returns nothing for empty text', () => {
    expect(parseBlocks('  \n\n ')).toEqual([]);
  });
});

describe('Prose', () => {
  it('renders an existing single-paragraph explanation with bold labels and code', () => {
    const why = '`em` compounds: 24 × 1.5 = 36. **Not 36px vs 24px:** that forgets the second step. **Not 24px vs 24px:** that treats `em` like `rem`.';
    const { container } = render(<Prose text={why} />);
    expect(container.querySelectorAll('p')).toHaveLength(1);
    expect(screen.getByText('Not 36px vs 24px:').tagName).toBe('STRONG');
    expect(screen.getAllByText('em').every((n) => n.tagName === 'CODE')).toBe(true);
    expect(container.querySelector('ul')).toBeNull();
  });

  it('renders bullets as a list', () => {
    render(<Prose text={'Two reasons:\n- **stable** identity\n- fewer renders'} />);
    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText('stable').tagName).toBe('STRONG');
    expect(screen.getByText('Two reasons:').tagName).toBe('P');
  });

  it('renders tables with column headers', () => {
    render(<Prose text={'| Hook | Runs |\n|---|---|\n| `useEffect` | after paint |\n| `useLayoutEffect` | before paint |'} />);
    const table = screen.getByRole('table');
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((h) => h.textContent),
    ).toEqual(['Hook', 'Runs']);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText('useEffect').tagName).toBe('CODE');
  });

  it('renders fenced code as a highlighted block and accepts a className', () => {
    const { container } = render(<Prose className="extra" text={'Example:\n\n```js\nconsole.log(1)\n```'} />);
    expect(container.firstElementChild).toHaveClass('extra', 'space-y-3');
    expect(container.querySelector('pre')).toHaveTextContent('console.log(1)');
  });
});
