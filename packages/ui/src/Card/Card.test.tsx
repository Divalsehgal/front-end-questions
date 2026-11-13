import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, List } from '.';

describe('Card', () => {
  it('renders a surface with optional hover affordance', () => {
    const { container, rerender } = render(<Card className="p-4">Body</Card>);
    const card = container.firstElementChild!;
    expect(card).toHaveTextContent('Body');
    expect(card).toHaveClass('bg-surface', 'border-line', 'p-4');
    expect(card).not.toHaveClass('hover:border-brand');
    rerender(<Card interactive>Body</Card>);
    expect(container.firstElementChild).toHaveClass('hover:border-brand');
  });
});

describe('List', () => {
  it('renders a labelled list with dividers', () => {
    render(
      <List label="Due questions">
        <li>One</li>
        <li>Two</li>
      </List>,
    );
    const list = screen.getByRole('list', { name: 'Due questions' });
    expect(list).toHaveClass('divide-y');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
