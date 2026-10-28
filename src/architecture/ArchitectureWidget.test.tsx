import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { location, renderWithRouter } from '../test/render';
import { ArchitectureWidget } from './ArchitectureWidget';

describe('ArchitectureWidget', () => {
  it('is a named link to /architecture with a decorative, animated thumbnail', async () => {
    const { user, container } = renderWithRouter(<ArchitectureWidget />);
    const link = screen.getByRole('link', { name: /How FE Grind is built/ });
    expect(link).toHaveAttribute('href', '/architecture');

    const svg = container.querySelector('svg[viewBox]')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg.querySelectorAll('circle')).toHaveLength(6);
    const pulses = svg.querySelectorAll('.arch-pulse');
    expect(pulses.length).toBeGreaterThan(0);
    for (const p of pulses) expect(p).toHaveAttribute('pathLength', '1');
    expect(new Set([...pulses].map((p) => (p as SVGElement).style.animationDelay)).size).toBe(pulses.length);
    expect(svg.querySelector('style')?.textContent).toContain('prefers-reduced-motion: no-preference');

    await user.click(link);
    expect(location()).toBe('/architecture');
  });
});
