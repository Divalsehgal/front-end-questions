import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout } from '.';

describe('Callout', () => {
  it('renders title, icon and body in the brand tone by default', () => {
    const { container } = render(
      <Callout title="Why" icon={<svg data-testid="icon" />}>
        Because.
      </Callout>,
    );
    expect(screen.getByText('Why')).toHaveClass('text-brand-strong');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Because.')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('bg-brand-soft');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('can be a live status region in other tones, without a title', () => {
    render(
      <Callout tone="error" role="status">
        Wrong
      </Callout>,
    );
    const region = screen.getByRole('status');
    expect(region).toHaveClass('bg-error-soft', 'border-error/40');
    expect(region).toHaveTextContent('Wrong');
    expect(region.querySelector('p')).toBeNull();
  });
});
