import { render } from '@testing-library/react';
import { Atom, Code2 } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { SubjectIcon, subjectIcon } from '.';

describe('subject icons', () => {
  it('maps names to lucide icons with a fallback', () => {
    expect(subjectIcon('atom')).toBe(Atom);
    expect(subjectIcon('nope')).toBe(Code2);
  });

  it('renders a decorative icon by name', () => {
    const { container } = render(<SubjectIcon name="braces" size={12} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '12');
  });
});
