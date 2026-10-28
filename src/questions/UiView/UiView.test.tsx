import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UiView } from '.';
import type { UiQuestion } from '../../content/types';

vi.mock('../../ui/LivePreview/LivePreview', () => ({
  LivePreview: ({ title, code }: { title: string; code: string }) => <iframe title={title} data-code={code} />,
}));

const q: UiQuestion = {
  kind: 'ui',
  id: 'counter',
  title: 'Counter',
  difficulty: 'easy',
  prompt: 'Build a **counter**.',
  framework: 'react',
  requirements: ['Shows `0` initially', 'Increments on click'],
  starter: 'export default function App() {}',
  solution: 'export default function App() { return 1 }',
};

const setup = (question = q) => {
  const onResult = vi.fn();
  render(<UiView q={question} subject="react" onResult={onResult} />);
  return { onResult, user: userEvent.setup() };
};

beforeEach(() => localStorage.clear());

describe('UiView', () => {
  it('lists requirements as checkboxes and only allows "done" when all are ticked', async () => {
    const { user, onResult } = setup();
    expect(screen.getByText('React + TS')).toBeInTheDocument();
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(2);
    const done = screen.getByRole('button', { name: 'Mark as done' });
    expect(done).toBeDisabled();
    await user.click(screen.getByRole('checkbox', { name: 'Shows 0 initially' }));
    await user.click(boxes[0]);
    await user.click(boxes[0]);
    expect(screen.getByText(/Requirements · 1 \/ 2/)).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'Increments on click' }));
    await user.click(done);
    expect(onResult).toHaveBeenCalledWith(true);
    expect(screen.getByRole('status')).toHaveTextContent('Done.');
    expect(screen.getAllByRole('checkbox').every((b) => (b as HTMLInputElement).disabled)).toBe(true);
    // Submitting unlocks the reference in both panes.
    await user.click(screen.getByRole('tab', { name: 'Reference' }));
    expect(screen.getByRole('textbox', { name: 'Reference solution' })).toHaveValue(q.solution);
    expect(screen.getByTitle('Counter reference preview')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Solution' }));
    expect(screen.getByRole('tabpanel', { name: 'Solution' })).toHaveTextContent('reference implementation');
  });

  it('switches between code and preview, and Cmd/Ctrl+Enter opens the preview', async () => {
    const { user } = setup({ ...q, framework: 'vanilla', starter: '<p>hi</p>' });
    expect(screen.getByText('HTML / CSS / JS')).toBeInTheDocument();
    const editor = screen.getByRole('textbox', { name: 'Your code for Counter' });
    expect(editor).toHaveAttribute('data-path', 'file:///ui-react-counter.html');
    await user.type(editor, '{Control>}{Enter}{/Control}');
    expect(screen.getByTitle('Counter preview')).toHaveAttribute('data-code', '<p>hi</p>');
    await user.click(screen.getByRole('tab', { name: 'Code' }));
    expect(screen.getByRole('textbox', { name: 'Your code for Counter' })).toBeInTheDocument();
  });

  it('asks before revealing; confirming counts as a miss and opens the reference', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { user, onResult } = setup();
    await user.click(screen.getByRole('button', { name: 'Solution' }));
    expect(onResult).not.toHaveBeenCalled();
    expect(confirm).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Solution' }));
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.getByRole('tab', { name: 'Reference' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('button', { name: 'Solution' })).not.toBeInTheDocument();
    // Marking done afterwards can't turn the miss into a pass.
    await user.click(screen.getByRole('tab', { name: 'Problem' }));
    for (const box of screen.getAllByRole('checkbox')) await user.click(box);
    await user.click(screen.getByRole('button', { name: 'Mark as done' }));
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  it('starts fresh from the starter after confirming', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { user } = setup();
    const editor = screen.getByRole('textbox', { name: /Your code/ });
    await user.type(editor, 'x');
    await user.click(screen.getByRole('button', { name: 'Start fresh' }));
    expect(screen.getByRole('textbox', { name: /Your code/ })).toHaveValue(q.starter);
  });

  it('has the reference solution in a disclosure; opening it (confirmed) is a miss', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { onResult, user } = setup();
    const details = screen.getByText('Show reference solution').closest('details')!;
    expect(details).toHaveTextContent('return 1');
    await user.click(screen.getByText('Show reference solution'));
    await waitFor(() => expect(details.open).toBe(false));
    await user.click(screen.getByText('Show reference solution'));
    expect(await screen.findByRole('tab', { name: 'Reference' })).toHaveAttribute('aria-selected', 'true');
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.queryByText('Show reference solution')).not.toBeInTheDocument();
  });
});
