import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from '.';

describe('IconButton', () => {
  it('uses the label as accessible name and tooltip', async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Previous question" onClick={onClick}>
        <svg aria-hidden />
      </IconButton>,
    );
    const btn = screen.getByRole('button', { name: 'Previous question' });
    expect(btn).toHaveAttribute('title', 'Previous question');
    expect(btn).toHaveAttribute('type', 'button');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });

  it('can be disabled and styled', () => {
    render(<IconButton label="Next" disabled className="extra" />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('extra', 'border-line');
  });
});
