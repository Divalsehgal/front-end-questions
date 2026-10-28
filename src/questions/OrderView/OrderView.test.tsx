import { createEvent, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DISCLOSURE_LABEL } from '../shared';
import { initialOrder, OrderView } from '.';
import type { OrderQuestion } from '../../content/types';

const q: OrderQuestion = {
  kind: 'order',
  id: 'o1',
  title: 'Event loop',
  prompt: 'Order the **phases**',
  items: ['sync', 'microtasks', 'render', 'macrotask'],
  why: 'Sync code first:\n- then `microtasks`',
};

// Math.random → ~1 makes shuffle() the identity, so initialOrder() falls back to the reversed list.
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.9999);
});

const rows = () =>
  within(screen.getByRole('list', { name: 'Steps' }))
    .getAllByRole('listitem')
    .map((li) => li.textContent?.replace(/^\d/, ''));

const setup = () => {
  const onResult = vi.fn();
  render(<OrderView q={q} subject="js" onResult={onResult} />);
  return { onResult, user: userEvent.setup() };
};

describe('initialOrder', () => {
  it('never starts solved', () => {
    expect(initialOrder(q.items)).toEqual([...q.items].reverse());
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(initialOrder(q.items)).not.toEqual(q.items);
  });
});

describe('OrderView', () => {
  it('reorders with the move buttons and reports a correct order', async () => {
    const { onResult, user } = setup();
    expect(rows()).toEqual(['macrotask', 'render', 'microtasks', 'sync']);
    expect(screen.getByRole('button', { name: 'Move "macrotask" up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move "sync" down' })).toBeDisabled();
    // reverse → correct: move sync to top, microtasks up twice, render up once.
    for (const name of ['sync', 'sync', 'sync', 'microtasks', 'microtasks', 'render'])
      await user.click(screen.getByRole('button', { name: `Move "${name}" up` }));
    expect(rows()).toEqual(q.items);
    await user.click(screen.getByRole('button', { name: 'Check order' }));
    expect(onResult).toHaveBeenCalledWith(true);
    expect(screen.getByRole('status')).toHaveTextContent('Correct order');
    expect(screen.getByRole('status').querySelector('ul li')).toHaveTextContent('then microtasks');
    expect(screen.queryByRole('button', { name: /Move/ })).not.toBeInTheDocument();
  });

  it('reports a wrong order, marks rows and shows the right one', async () => {
    const { onResult, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Move "render" down' }));
    await user.click(screen.getByRole('button', { name: 'Check order' }));
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('Some steps are out of place');
    expect(screen.getAllByText(/out of place\)/).length).toBeGreaterThan(0);
    expect(screen.getByText('Correct order')).toBeInTheDocument();
  });

  it('reorders by dragging', () => {
    setup();
    const items = within(screen.getByRole('list', { name: 'Steps' })).getAllByRole('listitem');
    fireEvent.dragStart(items[3]);
    const over = createEvent.dragOver(items[0]);
    fireEvent(items[0], over);
    expect(over.defaultPrevented).toBe(true);
    fireEvent.dragEnd(items[0]);
    expect(rows()).toEqual(['sync', 'macrotask', 'render', 'microtasks']);
    // Dragging over itself or without a drag in progress does nothing.
    fireEvent.dragOver(items[1]);
    expect(rows()).toEqual(['sync', 'macrotask', 'render', 'microtasks']);
  });

  it('has the correct order and explanation in a disclosure; opening it (confirmed) is a miss', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { onResult, user } = setup();
    const details = screen.getByText(DISCLOSURE_LABEL).closest('details')!;
    expect(details).toHaveTextContent(/Correct order:\s*syncmicrotasksrendermacrotask/);
    await user.click(screen.getByText(DISCLOSURE_LABEL));
    await waitFor(() => expect(details.open).toBe(false));
    await user.click(screen.getByText(DISCLOSURE_LABEL));
    expect(await screen.findByRole('status')).toHaveTextContent('Answer revealed');
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.queryByText(DISCLOSURE_LABEL)).not.toBeInTheDocument();
  });
});
