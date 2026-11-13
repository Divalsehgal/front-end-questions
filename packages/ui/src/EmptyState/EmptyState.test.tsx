import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from '.';

describe('EmptyState', () => {
  it('renders title and optional description', () => {
    const { rerender } = render(
      <EmptyState icon={<svg />} title="All caught up">
        Nothing is due.
      </EmptyState>,
    );
    expect(screen.getByText('All caught up')).toBeInTheDocument();
    expect(screen.getByText('Nothing is due.')).toBeInTheDocument();
    rerender(<EmptyState icon={<svg />} title="Empty" />);
    expect(screen.getByText('Empty').nextElementSibling).toBeNull();
  });
});
