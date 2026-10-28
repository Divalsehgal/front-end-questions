import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SplitPane } from '.';

const setup = (value = 50) => {
  const onChange = vi.fn();
  const onReset = vi.fn();
  render(<SplitPane label="Resize" value={value} min={25} max={75} onChange={onChange} onReset={onReset} left={<p>left</p>} right={<p>right</p>} />);
  return { onChange, onReset, sep: screen.getByRole('separator', { name: 'Resize' }) };
};

describe('SplitPane', () => {
  it('renders both sides around a focusable splitter with its value', () => {
    const { sep } = setup(40);
    expect(screen.getByText('left')).toBeInTheDocument();
    expect(screen.getByText('right')).toBeInTheDocument();
    expect(sep).toHaveAttribute('aria-valuenow', '40');
    expect(sep).toHaveAttribute('tabindex', '0');
  });

  it('resizes from the keyboard', () => {
    const { sep, onChange } = setup(50);
    fireEvent.keyDown(sep, { key: 'ArrowLeft' });
    fireEvent.keyDown(sep, { key: 'ArrowRight' });
    fireEvent.keyDown(sep, { key: 'Home' });
    fireEvent.keyDown(sep, { key: 'End' });
    fireEvent.keyDown(sep, { key: 'a' });
    expect(onChange.mock.calls).toEqual([[48], [52], [25], [75]]);
  });

  it('resets on double-click', () => {
    const { sep, onReset } = setup();
    fireEvent.doubleClick(sep);
    expect(onReset).toHaveBeenCalledOnce();
  });
});
