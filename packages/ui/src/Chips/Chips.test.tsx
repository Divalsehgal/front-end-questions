import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Chips, ToggleChips } from '.';

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'quiz', label: 'Quizzes' },
  { value: 'code', label: 'Code' },
];

function Single() {
  const [v, setV] = useState('all');
  return (
    <>
      <Chips label="Filter" value={v} onChange={setV} options={OPTIONS} />
      <output>{v}</output>
    </>
  );
}

function Multi() {
  const [v, setV] = useState<string[]>(['quiz']);
  return (
    <>
      <span id="lbl">Kinds</span>
      <ToggleChips labelledBy="lbl" selected={v} onChange={setV} options={OPTIONS} />
      <output>{v.join(',')}</output>
    </>
  );
}

describe('Chips (single choice)', () => {
  it('is a labelled radio group with one checked option', () => {
    render(<Single />);
    expect(screen.getByRole('radiogroup', { name: 'Filter' })).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
    expect(radios.map((r) => r.tabIndex)).toEqual([0, -1, -1]);
    expect(radios[0]).toHaveClass('text-brand-strong');
  });

  it('selects on click', async () => {
    render(<Single />);
    await userEvent.click(screen.getByRole('radio', { name: 'Code' }));
    expect(screen.getByRole('status')).toHaveTextContent('code');
    expect(screen.getByRole('radio', { name: 'Code' })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves selection and focus with arrow keys, Home and End', async () => {
    const user = userEvent.setup();
    render(<Single />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Quizzes' })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('quiz');
    await user.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Code' })).toHaveFocus();
    await user.keyboard('{Home}{ArrowUp}');
    expect(screen.getByRole('status')).toHaveTextContent('code');
  });
});

describe('ToggleChips (multi select)', () => {
  it('toggles options on and off with aria-pressed', async () => {
    const user = userEvent.setup();
    render(<Multi />);
    expect(screen.getByRole('group', { name: 'Kinds' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quizzes' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Code' }));
    expect(screen.getByRole('status')).toHaveTextContent('quiz,code');
    // Each toggle is its own tab stop and works with the keyboard.
    screen.getByRole('button', { name: 'Quizzes' }).focus();
    await user.keyboard(' ');
    expect(screen.getByRole('status')).toHaveTextContent(/^code$/);
    expect(screen.getByRole('button', { name: 'Quizzes' })).toHaveAttribute('aria-pressed', 'false');
  });
});
