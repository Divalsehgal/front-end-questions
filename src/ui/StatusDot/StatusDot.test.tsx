import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusDot } from '.';
import type { Attempt } from '../../state/progress';

const attempt = (status: Attempt['status']): Attempt => ({ status, attempts: 1, firstTry: true, box: 1, due: 0, updated: 0 });

describe('StatusDot', () => {
  it.each([
    [undefined, 'Not attempted', 'text-line-strong'],
    [attempt('correct'), 'Solved', 'text-success'],
    [attempt('wrong'), 'Needs review', 'text-error'],
  ])('labels %o as "%s"', (a, label, cls) => {
    render(<StatusDot attempt={a} />);
    const dot = screen.getByText(label).parentElement;
    expect(dot).toHaveAttribute('title', label);
    expect(dot).toHaveClass(cls);
    expect(screen.getByText(label)).toHaveClass('sr-only');
  });

  it('shows the label as text with withLabel, without a duplicate tooltip', () => {
    render(<StatusDot attempt={attempt('correct')} withLabel />);
    const label = screen.getByText('Solved');
    expect(label).not.toHaveClass('sr-only');
    expect(label.parentElement).not.toHaveAttribute('title');
  });
});
