import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DISCLOSURE_LABEL, REVEAL_CONFIRM } from '../shared';
import { QuizView } from '.';
import type { QuizQuestion } from '../../content/types';

const single: QuizQuestion = {
  kind: 'quiz',
  id: 'q1',
  title: 'Specificity',
  prompt: 'Which selector **wins**?',
  code: '#a .b {}',
  options: ['`#nav a`', '`.a.b.c`', '`div p`'],
  answer: 0,
  why: '**Not B:** classes lose to an id.\n- ids beat classes\n- classes beat elements',
};
const multi: QuizQuestion = { ...single, id: 'q2', prompt: 'Pick the hooks', options: ['useMemo', 'useFoo', 'useRef'], answer: [0, 2], why: 'Both exist.' };

// Math.random → ~1 makes shuffle() the identity, so option n is the n-th written option.
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.9999);
});

const setup = (q: QuizQuestion) => {
  const onResult = vi.fn();
  const user = userEvent.setup();
  render(<QuizView q={q} subject="css" onResult={onResult} />);
  return { onResult, user };
};

describe('QuizView', () => {
  it('renders the prompt, code and a group of radios named by the prompt', () => {
    setup(single);
    expect(screen.getByText('wins').tagName).toBe('STRONG');
    expect(document.querySelector('pre')).toHaveTextContent('#a .b {}');
    const group = screen.getByRole('group', { name: /Which selector/ });
    expect(group.tagName).toBe('FIELDSET');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getAllByRole('radio').every((r) => r.getAttribute('name') === 'q1-answer')).toBe(true);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('marks a correct answer and renders the explanation through Prose', async () => {
    const { onResult, user } = setup(single);
    await user.click(screen.getByRole('radio', { name: '#nav a' }));
    expect(screen.getByRole('radio', { name: '#nav a' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onResult).toHaveBeenCalledWith(true);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Correct');
    expect(screen.getByText('Not B:').tagName).toBe('STRONG');
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['ids beat classes', 'classes beat elements']);
    expect(screen.getByRole('radio', { name: /#nav a.*correct answer/ })).toHaveAttribute('aria-disabled', 'true');
  });

  it('marks a wrong answer and shows which was right', async () => {
    const { onResult, user } = setup(single);
    await user.click(screen.getByRole('radio', { name: '.a.b.c' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('Not this one');
    expect(screen.getByRole('radio', { name: /\.a\.b\.c.*incorrect/ })).toBeInTheDocument();
    // Locked after submitting: clicking again changes nothing and reports nothing.
    await user.click(screen.getByRole('radio', { name: /#nav a/ }));
    expect(screen.getByRole('radio', { name: /#nav a/ })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: /\.a\.b\.c/ })).toBeChecked();
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  it('supports 1–n to choose and Enter to submit', async () => {
    const { onResult, user } = setup(single);
    await user.keyboard('{Enter}');
    expect(onResult).not.toHaveBeenCalled();
    await user.keyboard('3');
    expect(screen.getByRole('radio', { name: 'div p' })).toBeChecked();
    await user.keyboard('1');
    expect(screen.getByRole('radio', { name: 'div p' })).not.toBeChecked();
    await user.keyboard('9{Enter}');
    expect(onResult).toHaveBeenCalledWith(true);
    await user.keyboard('2{Enter}');
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  it('keeps 1–n and Enter working while an option has focus', async () => {
    const { onResult, user } = setup(single);
    await user.click(screen.getByRole('radio', { name: '.a.b.c' }));
    expect(screen.getByRole('radio', { name: '.a.b.c' })).toHaveFocus();
    await user.keyboard('1{Enter}');
    expect(screen.getByRole('radio', { name: /#nav a/ })).toBeChecked();
    expect(onResult).toHaveBeenCalledWith(true);
  });

  it('handles select-all-that-apply questions', async () => {
    const { onResult, user } = setup(multi);
    expect(screen.getByText('Select all that apply.')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Pick the hooks' })).toBeInTheDocument();
    await user.keyboard('1');
    await user.keyboard('2');
    await user.keyboard('2');
    await user.keyboard('3');
    expect(screen.getAllByRole('checkbox').map((c) => (c as HTMLInputElement).checked)).toEqual([true, false, true]);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onResult).toHaveBeenCalledWith(true);
  });

  it('says "not quite" for a partial multi-select answer', async () => {
    const { onResult, user } = setup(multi);
    await user.click(screen.getByRole('checkbox', { name: 'useMemo' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('Not quite: the green ones are right');
  });

  it('has the answer and explanation in a collapsed disclosure; opening it is a confirmed miss', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { onResult, user } = setup(single);
    const details = screen.getByText(DISCLOSURE_LABEL).closest('details')!;
    expect(details).toHaveTextContent('Correct answer:');
    expect(details).toHaveTextContent('classes lose to an id');
    await user.click(screen.getByText(DISCLOSURE_LABEL));
    await waitFor(() => expect(details.open).toBe(false));
    expect(onResult).not.toHaveBeenCalled();
    await user.click(screen.getByText(DISCLOSURE_LABEL));
    expect(await screen.findByRole('status')).toHaveTextContent('Answer revealed: the green one is right');
    expect(confirm).toHaveBeenCalledWith(REVEAL_CONFIRM);
    expect(onResult).toHaveBeenCalledWith(false);
    // The explanation now shows once, in the result; the disclosure is gone.
    expect(screen.queryByText(DISCLOSURE_LABEL)).not.toBeInTheDocument();
    expect(screen.getAllByText(/classes lose to an id/)).toHaveLength(1);
  });

  it('lists every correct answer for select-all questions', () => {
    setup(multi);
    expect(screen.getByText(DISCLOSURE_LABEL).closest('details')).toHaveTextContent(/Correct answers:\s*useMemouseRef/);
  });
});
