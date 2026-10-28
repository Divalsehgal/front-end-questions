import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kbd } from '.';

describe('Kbd', () => {
  it('renders a <kbd> key hint', () => {
    render(<Kbd>Enter</Kbd>);
    expect(screen.getByText('Enter').tagName).toBe('KBD');
  });
});
