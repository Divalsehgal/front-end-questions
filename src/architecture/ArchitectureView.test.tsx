import { act, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fixture } from '../test/architecture';
import { ArchitectureView, WIDE_QUERY } from './ArchitectureView';
import { nodesByTier } from './model';
import { TierList } from './TierList';

// The canvas itself is tested in ArchitectureDiagram.test.tsx; here only whether it is mounted.
vi.mock('./ArchitectureDiagram', () => ({ ArchitectureDiagram: () => <div data-testid="architecture-canvas" /> }));

let wide = false;
const mqListeners = new Set<() => void>();
let intersect: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
const observe = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
  wide = false;
  intersect = undefined;
  mqListeners.clear();
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query === WIDE_QUERY && wide;
    },
    addEventListener: (_: string, l: () => void) => mqListeners.add(l),
    removeEventListener: (_: string, l: () => void) => mqListeners.delete(l),
  }));
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: typeof intersect) {
        intersect = cb;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

const setWide = (value: boolean) =>
  act(() => {
    wide = value;
    mqListeners.forEach((l) => l());
  });

describe('ArchitectureView', () => {
  it('keeps phones on the stacked tiers, even once in view', () => {
    render(<ArchitectureView architecture={fixture} />);
    act(() => intersect?.([{ isIntersecting: true }]));
    expect(screen.getByTestId('architecture-tiers')).toBeInTheDocument();
    expect(screen.queryByTestId('architecture-canvas')).not.toBeInTheDocument();
  });

  it('mounts the canvas on a wide screen only once it scrolls into view', async () => {
    wide = true;
    const { unmount } = render(<ArchitectureView architecture={fixture} />);
    expect(observe).toHaveBeenCalled();
    act(() => intersect?.([{ isIntersecting: false }]));
    expect(screen.getByTestId('architecture-tiers')).toBeInTheDocument();
    act(() => intersect?.([{ isIntersecting: true }]));
    expect(await screen.findByTestId('architecture-canvas')).toBeInTheDocument();
    expect(screen.queryByTestId('architecture-tiers')).not.toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();

    // Narrowing the window goes back to the tiers.
    setWide(false);
    expect(screen.getByTestId('architecture-tiers')).toBeInTheDocument();
    unmount();
    expect(mqListeners.size).toBe(0);
  });

  it('shows the canvas straight away where IntersectionObserver is missing', async () => {
    wide = true;
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<ArchitectureView architecture={fixture} />);
    expect(await screen.findByTestId('architecture-canvas')).toBeInTheDocument();
  });

  it('stays on the tiers without matchMedia (as in the prerender)', () => {
    vi.stubGlobal('matchMedia', undefined);
    render(<ArchitectureView architecture={fixture} />);
    act(() => intersect?.([{ isIntersecting: true }]));
    expect(screen.getByTestId('architecture-tiers')).toBeInTheDocument();
  });
});

describe('TierList', () => {
  it('groups nodes by tier, in order, with their outgoing edges', () => {
    expect(nodesByTier(fixture).map((t) => [t.tier, t.nodes.map((n) => n.id)])).toEqual([
      ['client', ['spa']],
      ['compute', ['worker', 'cdn']],
      ['data', ['db']],
    ]);
    expect(nodesByTier({ ...fixture, nodes: fixture.nodes.filter((n) => n.tier !== 'compute'), edges: [] }).map((t) => t.tier)).toEqual(['client', 'data']);

    const { container } = render(<TierList architecture={fixture} />);
    const tiers = container.querySelectorAll('details');
    expect([...tiers].map((d) => d.querySelector('summary')?.firstChild?.textContent)).toEqual(['Client', 'Compute and services', 'Data']);
    expect(tiers[1]).toHaveAttribute('open');

    const compute = within(screen.getByRole('list', { name: 'Compute and services parts' }));
    expect(compute.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['WorkerRuns code', 'CDNExternal service']);
    expect(screen.getByRole('list', { name: 'React SPA connects to' })).toHaveTextContent('→ Worker: posts code→ IndexedDB→ CDN: fetches');
    expect(screen.getByRole('list', { name: 'Worker connects to' })).toHaveTextContent('→ React SPA: returns results');
    // Nodes with nothing outgoing list nothing.
    expect(screen.queryByRole('list', { name: 'CDN connects to' })).not.toBeInTheDocument();
  });
});
