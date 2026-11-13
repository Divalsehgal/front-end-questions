import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ARCHITECTURE } from '../../architecture';
import { renderWithRouter } from '../../test/render';
import { Architecture } from '.';

describe('Architecture page', () => {
  it('titles the page and lists every part by tier before the canvas loads', () => {
    const { container } = renderWithRouter(<Architecture />, { route: '/architecture' });
    expect(screen.getByRole('heading', { level: 1, name: ARCHITECTURE.title })).toBeInTheDocument();
    expect(screen.getByText(ARCHITECTURE.subtitle)).toBeInTheDocument();
    // jsdom has no matchMedia: the page stays on the stacked tiers, as on a phone.
    expect(container.querySelectorAll('details')).toHaveLength(new Set(ARCHITECTURE.nodes.map((n) => n.tier)).size);
    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(headings).toHaveLength(ARCHITECTURE.nodes.length);
    ARCHITECTURE.nodes.forEach((n, i) => expect(headings[i]?.startsWith(n.data.label)).toBe(true));
    expect(screen.queryByTestId('architecture-canvas')).not.toBeInTheDocument();
  });
});
