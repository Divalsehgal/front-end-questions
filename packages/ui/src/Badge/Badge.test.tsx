import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TONES } from '../lib';
import { Badge, DIFFICULTY_TONE, DifficultyBadge } from '.';

describe('Badge', () => {
  it('defaults to the neutral tone', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveClass(TONES.neutral.bg, TONES.neutral.text);
  });

  it.each(Object.keys(TONES) as (keyof typeof TONES)[])('applies the %s tone', (tone) => {
    render(<Badge tone={tone}>x</Badge>);
    expect(screen.getByText('x')).toHaveClass(TONES[tone].bg, TONES[tone].text);
  });
});

describe('DifficultyBadge', () => {
  it('renders nothing without a difficulty', () => {
    const { container } = render(<DifficultyBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each(['easy', 'medium', 'hard'] as const)('labels %s for screen readers and colours it', (d) => {
    render(<DifficultyBadge difficulty={d} />);
    const badge = screen.getByText(d);
    expect(badge).toHaveTextContent(`Difficulty: ${d}`);
    expect(badge).toHaveClass(TONES[DIFFICULTY_TONE[d]].bg);
  });
});
