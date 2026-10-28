import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusDot } from '.';
import type { Attempt } from '../../state/progress';

const attempt = (status: Attempt['status']): Attempt => ({ status, attempts: 1, firstTry: true, box: 1, due: 0, updated: 0 });

describe('StatusDot', () => {
  it.each([
    [undefined, 'Not attempted', 'border-line-strong'],
    [attempt('correct'), 'Solved', 'bg-success'],
    [attempt('wrong'), 'Needs review', 'bg-error'],
  ])('labels %o as "%s"', (a, label, cls) => {
    render(<StatusDot attempt={a} />);
    const dot = screen.getByRole('img', { name: label });
    expect(dot).toHaveAttribute('title', label);
    expect(dot).toHaveClass(cls);
  });
});
