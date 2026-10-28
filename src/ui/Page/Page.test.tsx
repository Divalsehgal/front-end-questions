import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Page, PageHeader, SectionTitle } from '.';

describe('Page', () => {
  it.each([
    ['narrow', 'max-w-3xl'],
    ['default', 'max-w-5xl'],
    ['wide', 'max-w-7xl'],
  ] as const)('constrains %s pages to %s', (width, cls) => {
    const { container } = render(<Page width={width}>x</Page>);
    expect(container.firstElementChild).toHaveClass(cls);
  });
});

describe('PageHeader', () => {
  it('renders an h1 with optional description and actions', () => {
    const { rerender } = render(<PageHeader title="Review" description="Spaced repetition" actions={<button type="button">Go</button>} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Review' })).toBeInTheDocument();
    expect(screen.getByText('Spaced repetition')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
    rerender(<PageHeader title="Bare" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('SectionTitle', () => {
  it('renders an h2 with a decorative icon and id', () => {
    render(
      <SectionTitle id="s" icon={<svg data-testid="i" />}>
        Subjects
      </SectionTitle>,
    );
    const h2 = screen.getByRole('heading', { level: 2, name: 'Subjects' });
    expect(h2).toHaveAttribute('id', 's');
    expect(screen.getByTestId('i').parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});
