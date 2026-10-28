import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KIND_ORDER, KINDS, preloadView, QuestionView } from './registry';
import type { FlashcardQuestion } from '../content/types';

describe('question registry', () => {
  it('describes every kind once, in display order', () => {
    expect([...KIND_ORDER].sort()).toEqual(Object.keys(KINDS).sort());
    for (const k of KIND_ORDER)
      expect(KINDS[k]).toEqual(expect.objectContaining({ label: expect.any(String), plural: expect.any(String), View: expect.any(Function) }));
  });

  it('renders the view registered for a question kind', async () => {
    await preloadView('flashcard');
    const q: FlashcardQuestion = { kind: 'flashcard', id: 'f', title: 'T', front: 'Front side', back: 'Back' };
    render(<QuestionView q={q} subject="js" onResult={vi.fn()} />);
    expect(screen.getByText('Front side')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reveal answer' })).toBeInTheDocument();
  });
});

describe('lazy views', () => {
  it('suspend until loaded, then render', async () => {
    const { lazyComponent } = await import('../ui/lib');
    const { Suspense } = await import('react');
    let resolve!: (c: () => React.ReactNode) => void;
    const Lazy = lazyComponent(() => new Promise<() => React.ReactNode>((r) => (resolve = r)));
    render(
      <Suspense fallback={<p>loading</p>}>
        <Lazy />
      </Suspense>,
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
    await act(async () => resolve(() => <p>ready</p>));
    expect(await screen.findByText('ready')).toBeInTheDocument();
  });

  it('retry after a failed load', async () => {
    const { lazyComponent } = await import('../ui/lib');
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(() => null);
    const Lazy = lazyComponent(load);
    await expect(Lazy.preload()).rejects.toThrow('offline');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Lazy />)).toThrow('offline');
    await Lazy.preload();
    expect(render(<Lazy />).container.innerHTML).toBe('');
    expect(load).toHaveBeenCalledTimes(2);
  });
});
