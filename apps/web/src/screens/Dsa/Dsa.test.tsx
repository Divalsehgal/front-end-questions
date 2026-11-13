import { root } from '@fe-grind/dsa/data';
import { resetDone } from '@fe-grind/dsa/done';
import traces from '@fe-grind/dsa/traces';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setRoute } from '../../test/navigation';
import { DsaDrill, DsaDryRun, DsaNav, DsaPatterns, DsaTree, filterTree, toggleOpen } from '.';

beforeEach(() => {
  localStorage.clear();
  resetDone();
});
afterEach(() => localStorage.clear());

const category = root.children![0];
const pattern = category.children![0];
const question = pattern.children![0];

describe('tree helpers', () => {
  it('keeps one branch open: opening closes siblings, closing closes descendants', () => {
    let open = new Set(['DSA']);
    open = toggleOpen(open, 'DSA/A');
    open = toggleOpen(open, 'DSA/A/x');
    expect([...toggleOpen(open, 'DSA/B')]).toEqual(['DSA', 'DSA/B']);
    expect([...toggleOpen(open, 'DSA/A')]).toEqual(['DSA']);
  });

  it('filters to matching nodes and keeps the path to them', () => {
    const hit = filterTree(root, question.name.toLowerCase())!;
    expect(hit.children).toHaveLength(1);
    expect(hit.children![0].children![0].children).toContainEqual(question);
    expect(filterTree(root, 'zzz-no-match')).toBeNull();
  });
});

describe('DsaTree', () => {
  it('renders the same on the server as on the first client pass, ticks filled in after', () => {
    localStorage.setItem('dsa-done', JSON.stringify([question.name]));
    expect(renderToString(<DsaTree />)).toContain('0/');
  });

  it('opens one branch at a time and shows notes for the selected node', async () => {
    const user = userEvent.setup();
    render(<DsaTree />);
    await user.click(screen.getByRole('button', { name: new RegExp(`^${category.name}`) }));
    expect(screen.getByRole('button', { name: new RegExp(`^${category.name}`) })).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: new RegExp(`^${pattern.name}`) }));
    await user.click(screen.getByRole('button', { name: new RegExp(`^${question.name}`) }));
    const panel = screen.getByRole('complementary', { name: question.name });
    expect(within(panel).getByRole('link')).toHaveAttribute('href', question.url);
    await user.click(within(panel).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();

    const second = root.children![1].name;
    await user.click(screen.getByRole('button', { name: new RegExp(`^${second}`) }));
    expect(screen.queryByRole('button', { name: new RegExp(`^${pattern.name}`) })).not.toBeInTheDocument();
  });

  it('ticks a question off and remembers it', async () => {
    const user = userEvent.setup();
    render(<DsaTree />);
    await user.type(screen.getByRole('searchbox'), question.name);
    await user.click(screen.getByRole('checkbox', { name: `Solved ${question.name}` }));
    expect(JSON.parse(localStorage.getItem('dsa-done')!)).toEqual([question.name]);
    await user.click(screen.getByRole('checkbox', { name: `Solved ${question.name}` }));
    expect(JSON.parse(localStorage.getItem('dsa-done')!)).toEqual([]);
  });

  it('says so when nothing matches the filter', async () => {
    render(<DsaTree />);
    await userEvent.setup().type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByText(/Nothing matches/)).toBeInTheDocument();
  });
});

describe('DsaPatterns', () => {
  it('lists every pattern under its category', () => {
    render(<DsaPatterns />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(root.children!.length);
    expect(screen.getByRole('heading', { level: 3, name: pattern.name })).toBeInTheDocument();
  });
});

describe('DsaDrill', () => {
  it('reveals with Space and scores with 1 and 2', () => {
    render(<DsaDrill />);
    const left = () => screen.getByText('Left').nextSibling?.textContent;
    const total = Number(left());
    fireEvent.keyDown(window, { code: 'Space' });
    fireEvent.keyDown(window, { key: '2' });
    expect(screen.getByText('Got it').nextSibling).toHaveTextContent('1');
    expect(Number(left())).toBe(total - 1);
    fireEvent.click(screen.getByRole('button', { name: /Reveal/ }));
    fireEvent.click(screen.getByRole('button', { name: /Missed/ }));
    expect(screen.getByText('Missed').nextSibling).toHaveTextContent('1');
    expect(Number(left())).toBe(total - 1);
  });
});

describe('DsaDryRun', () => {
  it('shows a traced exercise and switches between them', async () => {
    const user = userEvent.setup();
    render(<DsaDryRun />);
    expect(screen.getByRole('heading', { name: new RegExp(traces[0].title) })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(traces[0].steps.length + 1);
    await user.click(screen.getByRole('button', { name: new RegExp(traces[1].title) }));
    expect(screen.getByRole('button', { name: new RegExp(traces[1].title) })).toHaveAttribute('aria-current', 'true');
  });

  it('traces your own code, with check() results and errors', async () => {
    const user = userEvent.setup();
    render(<DsaDryRun />);
    await user.click(screen.getByRole('button', { name: /Your code/ }));
    await user.click(screen.getByRole('button', { name: /Dry run/ }));
    await waitFor(() => expect(screen.getByText('[0, 1]')).toBeInTheDocument());
    expect(screen.getAllByRole('row').length).toBeGreaterThan(2);

    const editor = screen.getByRole('textbox', { name: 'Code to dry run' });
    fireEvent.change(editor, { target: { value: "check('adds', 1 + 1, 3);\ncheck('ok', 1, 1);" } });
    expect(localStorage.getItem('dsa-dryrun-code')).toContain('adds');
    fireEvent.keyDown(editor, { key: 'Enter', metaKey: true });
    await waitFor(() => expect(screen.getByText('FAIL')).toBeInTheDocument());
    expect(screen.getByText('expected 3, got 2')).toBeInTheDocument();
    expect(screen.getByText('PASS')).toBeInTheDocument();

    fireEvent.change(editor, { target: { value: 'let x = ;' } });
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /Dry run/ })));
    expect(await screen.findByRole('alert')).toHaveTextContent('Syntax error');

    await user.click(screen.getByRole('button', { name: 'Reset to example' }));
    expect((editor as HTMLTextAreaElement).value).toContain('twoSum');
  });
});

describe('DsaNav', () => {
  it('marks the current view', () => {
    setRoute('/dsa/patterns/');
    render(<DsaNav />);
    expect(screen.getByRole('link', { name: 'Patterns' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Tree' })).not.toHaveAttribute('aria-current');
  });
});
