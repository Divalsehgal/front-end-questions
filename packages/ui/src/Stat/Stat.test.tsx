import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stat } from '.';

describe('Stat', () => {
  it('shows a value with its label and hides the decorative icon', () => {
    render(<Stat icon={<svg data-testid="icon" />} value="3 / 10" label="Solved" />);
    expect(screen.getByText('3 / 10')).toBeInTheDocument();
    expect(screen.getByText('Solved')).toHaveClass('text-text-muted');
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});
