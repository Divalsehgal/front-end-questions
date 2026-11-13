import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fixture, mockReactFlowDom } from '../test/architecture';
import { ArchitectureDiagram, useCssColor } from './ArchitectureDiagram';

beforeAll(mockReactFlowDom);

describe('ArchitectureDiagram', () => {
  it('draws every node as a button, with its type and a read-only canvas', async () => {
    const { container } = render(<ArchitectureDiagram architecture={fixture} />);
    // Nodes show once React Flow has measured them.
    expect(await screen.findByRole('button', { name: 'React SPA: show details' })).toBeVisible();
    for (const n of fixture.nodes) expect(screen.getByRole('button', { name: `${n.data.label}: show details` })).toBeInTheDocument();
    const canvas = screen.getByTestId('architecture-canvas');
    expect(canvas).toHaveClass('h-[560px]');
    expect(canvas.querySelectorAll('[data-type]')).toHaveLength(fixture.nodes.length);
    expect(canvas.querySelector('[data-type="external"]')).toHaveTextContent('External service');
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeInTheDocument();
    // Edges, with closed arrowheads in the theme colour (the fallback here: jsdom has no stylesheet).
    expect(container.querySelectorAll('.react-flow__edge')).toHaveLength(fixture.edges.length);
    expect(container.querySelector('marker polyline.arrowclosed')).toHaveStyle({ fill: '#71717a' });
    expect(screen.getByText('posts code')).toBeInTheDocument();
  });

  it('opens the details of a clicked node and closes them again', async () => {
    // fireEvent, not userEvent: d3-zoom's mousedown handler needs a real `view` on the event.
    const { container } = render(<ArchitectureDiagram architecture={fixture} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Worker: show details' }));
    const panel = screen.getByRole('region', { name: 'Worker' });
    expect(screen.getByRole('button', { name: 'Worker: show details' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(panel).getByText('Runs code.')).toBeInTheDocument();
    expect(within(panel).getByText('Runs code')).toBeInTheDocument(); // type
    expect(within(panel).getByText('Compute and services')).toBeInTheDocument(); // tier
    expect(within(panel).getByRole('heading', { name: 'Receives from' }).nextElementSibling).toHaveTextContent('React SPA: posts code');
    expect(within(panel).getByRole('heading', { name: 'Sends to' }).nextElementSibling).toHaveTextContent('React SPA: returns results');

    fireEvent.click(within(panel).getByRole('button', { name: 'Close details' }));
    expect(screen.queryByRole('region')).not.toBeInTheDocument();

    // An edge without a label, then a node with nothing outgoing (switching straight from one to another).
    fireEvent.click(screen.getByRole('button', { name: 'React SPA: show details' }));
    const spa = screen.getByRole('region', { name: 'React SPA' });
    expect(within(spa).getByText('IndexedDB').parentElement).toHaveTextContent(/^→ IndexedDB$/);
    fireEvent.click(screen.getByRole('button', { name: 'CDN: show details' }));
    const cdn = screen.getByRole('region', { name: 'CDN' });
    expect(within(cdn).getByRole('heading', { name: 'Receives from' })).toBeInTheDocument();
    expect(within(cdn).queryByRole('heading', { name: 'Sends to' })).not.toBeInTheDocument();

    // Clicking the empty canvas closes the panel.
    fireEvent.click(container.querySelector('.react-flow__pane')!);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});

describe('useCssColor', () => {
  it('reads a custom property and re-reads it when the theme class changes', async () => {
    let value = '#111111';
    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({ getPropertyValue: () => ` ${value} ` }) as unknown as CSSStyleDeclaration);
    const { result } = renderHook(() => useCssColor('--text-muted', '#000'));
    expect(result.current).toBe('#111111');
    value = '#eeeeee';
    await act(async () => {
      document.documentElement.classList.add('dark');
      await Promise.resolve();
    });
    expect(result.current).toBe('#eeeeee');
    document.documentElement.classList.remove('dark');
  });

  it('falls back when the property is not set', () => {
    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({ getPropertyValue: () => '' }) as unknown as CSSStyleDeclaration);
    const { result } = renderHook(() => useCssColor('--missing', '#abcdef'));
    expect(result.current).toBe('#abcdef');
  });
});
