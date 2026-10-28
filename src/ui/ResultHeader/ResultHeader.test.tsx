import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResultHeader } from '.';

describe('ResultHeader', () => {
  it('announces a pass in the success tone', () => {
    render(<ResultHeader ok>All passed</ResultHeader>);
    expect(screen.getByRole('status')).toHaveClass('bg-success-soft', 'text-success');
  });

  it('shows a failure in the error tone with its icon', () => {
    render(
      <ResultHeader ok={false} icon={<svg data-testid="x" />}>
        2 / 5 passed
      </ResultHeader>,
    );
    expect(screen.getByRole('status')).toHaveClass('bg-error-soft', 'text-error');
    expect(screen.getByRole('status')).toHaveTextContent('2 / 5 passed');
    expect(screen.getByTestId('x')).toBeInTheDocument();
  });
});
