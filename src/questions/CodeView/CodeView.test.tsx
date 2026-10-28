import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runCodeTests } from '../../runtime/sandbox';
import { checkTypes } from '../../runtime/typecheck';
import { REVEAL_CONFIRM } from '../shared';
import { CodeView } from '.';
import type { CodeQuestion } from '../../content/types';

vi.mock('../../runtime/sandbox', () => ({ runCodeTests: vi.fn() }));
vi.mock('../../runtime/typecheck', () => ({ checkTypes: vi.fn() }));

const drill: CodeQuestion = {
  kind: 'code',
  id: 'debounce',
  title: 'Debounce',
  difficulty: 'medium',
  prompt: 'Implement **debounce**.',
  starter: 'export function debounce() {}',
  tests: "test('waits', () => {})",
  typeTests: 'type T = 1;',
  solution: 'export function debounce(fn) { return fn }',
};
const typeChallenge: CodeQuestion = { ...drill, id: 'deep-readonly', tests: undefined, typeTests: '// @ts-expect-error\nconst x: 1 = 2;' };

const PASS = { kind: 'code' as const, results: [{ name: 'waits', ok: true, ms: 1 }], logs: ['log line'] };
const FAIL = {
  kind: 'code' as const,
  results: [
    { name: 'waits', ok: true, ms: 1 },
    { name: 'cancels', ok: false, error: 'expected 1', ms: 1 },
  ],
  logs: [],
};

const setup = (q = drill) => {
  const onResult = vi.fn();
  render(<CodeView q={q} subject="js" onResult={onResult} />);
  return { onResult, user: userEvent.setup() };
};

beforeEach(() => {
  localStorage.clear();
  vi.mocked(runCodeTests).mockReset();
  vi.mocked(checkTypes).mockReset();
});

describe('CodeView', () => {
  it('shows the problem, a labelled editor and tests tab', async () => {
    const { user } = setup();
    expect(screen.getByRole('tabpanel', { name: 'Problem' })).toHaveTextContent('Implement debounce.');
    expect(screen.getByRole('textbox', { name: 'Your solution for Debounce' })).toHaveValue(drill.starter);
    expect(screen.queryByRole('tab', { name: 'Solution' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Tests' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent("test('waits'");
  });

  it('reports a pass once, even if run again', async () => {
    vi.mocked(runCodeTests).mockResolvedValue(PASS);
    const { onResult, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Run tests' }));
    expect(await screen.findByText('All 1 tests passed')).toBeInTheDocument();
    expect(screen.getByText('log line')).toBeInTheDocument();
    expect(onResult).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole('button', { name: 'Run tests' }));
    expect(onResult).toHaveBeenCalledTimes(1);
    // Solving unlocks the reference without a confirmation.
    await user.click(screen.getByRole('button', { name: /Compare with the reference solution/ }));
    expect(screen.getByRole('tab', { name: 'Solution' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('return fn');
  });

  it('shows failing tests without reporting a verdict', async () => {
    vi.mocked(runCodeTests).mockResolvedValue(FAIL);
    const { onResult } = setup();
    fireEvent.keyDown(screen.getByRole('textbox', { name: /Your solution/ }), { key: 'Enter', ctrlKey: true });
    expect(await screen.findByText('1 / 2 tests passed')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Failed' })).toBeInTheDocument();
    expect(screen.getByText('expected 1')).toBeInTheDocument();
    expect(onResult).not.toHaveBeenCalled();
  });

  it('shows a fatal error', async () => {
    vi.mocked(runCodeTests).mockResolvedValue({ kind: 'code', results: [], logs: [], fatal: 'SyntaxError' });
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Run tests' }));
    expect(await screen.findByText('Could not run')).toBeInTheDocument();
    expect(screen.getByText('SyntaxError')).toBeInTheDocument();
  });

  it('checks types separately for drills with type tests', async () => {
    vi.mocked(checkTypes).mockResolvedValue([{ inTypeTests: false, line: 3, source: 'let a: string = 1', message: 'Type number is not assignable' }]);
    const { user, onResult } = setup();
    await user.click(screen.getByRole('button', { name: 'Check types' }));
    expect(await screen.findByText('1 type problem')).toBeInTheDocument();
    expect(screen.getByText('Your code, line 3')).toBeInTheDocument();
    expect(onResult).not.toHaveBeenCalled();
  });

  it('judges a pure type challenge by the type checker', async () => {
    vi.mocked(checkTypes)
      .mockResolvedValueOnce([
        { inTypeTests: true, line: 1, source: 'const x: 1 = 2;', message: '', shouldFail: 'expected error' },
        { inTypeTests: true, line: 2, source: 'y', message: 'boom' },
      ])
      .mockResolvedValueOnce([]);
    const { user, onResult } = setup(typeChallenge);
    expect(screen.getByRole('tab', { name: 'Type tests' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check types' }));
    expect(await screen.findByText('2 type problems')).toBeInTheDocument();
    expect(screen.getByText(/should be a compile error/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check types' }));
    expect(await screen.findByText('All type tests pass')).toBeInTheDocument();
    expect(onResult).toHaveBeenCalledWith(true);
    expect(runCodeTests).not.toHaveBeenCalled();
  });

  it('asks before revealing the solution; confirming counts as a miss', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    vi.mocked(runCodeTests).mockResolvedValue(PASS);
    const { user, onResult } = setup();
    await user.click(screen.getByRole('button', { name: 'Solution' }));
    expect(confirm).toHaveBeenCalledWith(REVEAL_CONFIRM);
    expect(screen.queryByRole('tab', { name: 'Solution' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Solution' }));
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.getByRole('tab', { name: 'Solution' })).toHaveAttribute('aria-selected', 'true');
    // Passing afterwards doesn't overwrite the miss.
    await user.click(screen.getByRole('button', { name: 'Run tests' }));
    await screen.findByText('All 1 tests passed');
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  it('keeps a draft and can start fresh', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(runCodeTests).mockResolvedValue(FAIL);
    const { user } = setup();
    const editor = screen.getByRole('textbox', { name: /Your solution/ });
    await user.type(editor, '//x');
    expect(localStorage.getItem('grind:draft:js:debounce')).toContain('//x');
    await user.click(screen.getByRole('button', { name: 'Run tests' }));
    await screen.findByText('1 / 2 tests passed');
    await user.click(screen.getByRole('button', { name: 'Start fresh' }));
    expect(screen.getByRole('textbox', { name: /Your solution/ })).toHaveValue(drill.starter);
    expect(screen.queryByText('1 / 2 tests passed')).not.toBeInTheDocument();
  });

  it('has the reference solution in a disclosure; opening it (confirmed) is a miss and opens the Solution tab', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { onResult, user } = setup();
    const details = screen.getByText('Show reference solution').closest('details')!;
    expect(details).toHaveTextContent('return fn');
    await user.click(screen.getByText('Show reference solution'));
    await waitFor(() => expect(details.open).toBe(false));
    expect(onResult).not.toHaveBeenCalled();
    await user.click(screen.getByText('Show reference solution'));
    expect(await screen.findByRole('tab', { name: 'Solution' })).toHaveAttribute('aria-selected', 'true');
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.queryByText('Show reference solution')).not.toBeInTheDocument();
  });
});
