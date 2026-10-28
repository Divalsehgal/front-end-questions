import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from '.';

describe('ProgressBar', () => {
  it('exposes progress to assistive tech', () => {
    render(<ProgressBar value={3} total={4} label="CSS progress" />);
    const bar = screen.getByRole('progressbar', { name: 'CSS progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '75');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuetext', '3 of 4');
    expect(bar.firstElementChild).toHaveStyle({ transform: 'scaleX(0.75)' });
  });

  it('handles an empty total and has a default name', () => {
    render(<ProgressBar value={0} total={0} />);
    expect(screen.getByRole('progressbar', { name: 'Progress' })).toHaveAttribute('aria-valuenow', '0');
  });
});
