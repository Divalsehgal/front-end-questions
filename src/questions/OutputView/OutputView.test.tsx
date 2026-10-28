import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { expectedOutput } from '../../runtime/sandbox';
import { DISCLOSURE_LABEL } from '../shared';
import { allLinesMatch, OutputView, toLines } from '.';
import type { OutputQuestion } from '../../content/types';

vi.mock('../../runtime/sandbox', () => ({ expectedOutput: vi.fn() }));

const q: OutputQuestion = {
  kind: 'output',
  id: 'o1',
  title: 'Hoisting',
  code: 'console.log(1)',
  why: '**Hoisting:** `var` is hoisted.\n- declarations move up',
};

const setup = (question = q) => {
  const onResult = vi.fn();
  render(<OutputView q={question} subject="js" onResult={onResult} />);
  return { onResult, user: userEvent.setup(), box: screen.getByRole('textbox', { name: /What does it log/ }) };
};

beforeEach(() => {
  vi.mocked(expectedOutput).mockReset().mockResolvedValue(['1', 'outer undefined']);
});

describe('lines helpers', () => {
  it('drops trailing whitespace and blank lines', () => {
    expect(toLines('a  \nb\n\n  \n')).toEqual(['a', 'b']);
    expect(allLinesMatch(['a'], ['a', 'b'])).toBe(false);
    expect(allLinesMatch(["'x'"], ['"x"'])).toBe(true);
  });
});

describe('OutputView', () => {
  it('has a labelled, described answer box that is not auto-focused', () => {
    const { box } = setup();
    expect(box).toHaveAccessibleDescription(/quote style don’t matter/);
    expect(box).not.toHaveFocus();
    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled();
  });

  it('marks a correct answer and explains why through Prose', async () => {
    const { onResult, user, box } = setup();
    await user.type(box, '1\nouter undefined');
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(onResult).toHaveBeenCalledWith(true);
    expect(screen.getByRole('status')).toHaveTextContent('Correct!');
    expect(screen.getByText('Hoisting:').tagName).toBe('STRONG');
    expect(screen.getByText('declarations move up').tagName).toBe('LI');
    expect(screen.queryByRole('button', { name: /re-check/ })).not.toBeInTheDocument();
  });

  it('diffs a wrong answer line by line, and a retry never turns it into a pass', async () => {
    const { onResult, user, box } = setup();
    await user.type(box, '1\nouter null\nextra');
    await user.keyboard('{Meta>}{Enter}{/Meta}');
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('Not quite');
    const lines = screen.getByRole('list', { name: 'Output, line by line' });
    expect(lines.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByText('null').tagName).toBe('MARK');
    expect(screen.getByText('(nothing more is logged)')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Edit my answer and re-check/ }));
    const again = screen.getByRole('textbox', { name: /What does it log/ });
    expect((again as HTMLTextAreaElement).value).toMatch(/^1\nouter null\nextra\n?$/);
    await user.clear(again);
    await user.type(again, '1\nouter undefined');
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('Correct!');
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  it('shows missing lines and empty real lines', async () => {
    vi.mocked(expectedOutput).mockResolvedValue(['a', '']);
    const { user, box } = setup({ ...q, lang: 'ts' });
    await user.type(box, 'a');
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(screen.getByText('(missing)')).toBeInTheDocument();
    expect(screen.getByText('(empty line)')).toBeInTheDocument();
    expect(expectedOutput).toHaveBeenCalledWith('console.log(1)', 'ts');
  });

  it('gives a line-count hint', async () => {
    vi.mocked(expectedOutput).mockResolvedValue(['only']);
    const { user, onResult } = setup();
    await user.click(screen.getByRole('button', { name: 'Hint' }));
    expect(await screen.findByRole('button', { name: 'It logs 1 line' })).toBeDisabled();
    vi.mocked(expectedOutput).mockResolvedValue(['a', 'b']);
    expect(onResult).not.toHaveBeenCalled();
  });

  it('pluralises the hint', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Hint' }));
    expect(await screen.findByRole('button', { name: 'It logs 2 lines' })).toBeInTheDocument();
  });

  it('counts "Show answer" as a miss and shows the real output', async () => {
    const { onResult, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Show answer' }));
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('Here is the real output');
    expect(screen.queryByText('You')).not.toBeInTheDocument();
    expect(screen.getByText('outer undefined')).toBeInTheDocument();
  });

  it('has the explanation in a disclosure; opening it (confirmed) gives up and shows the output', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { onResult, user } = setup();
    const details = screen.getByText(DISCLOSURE_LABEL).closest('details')!;
    expect(details).toHaveTextContent('var is hoisted');
    await user.click(screen.getByText(DISCLOSURE_LABEL));
    await waitFor(() => expect(details.open).toBe(false));
    expect(onResult).not.toHaveBeenCalled();
    await user.click(screen.getByText(DISCLOSURE_LABEL));
    expect(await screen.findByRole('status')).toHaveTextContent('Here is the real output');
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.queryByText(DISCLOSURE_LABEL)).not.toBeInTheDocument();
  });
});
