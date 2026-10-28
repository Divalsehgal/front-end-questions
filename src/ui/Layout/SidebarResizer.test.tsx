import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetSidebarWidth, setSidebarCollapsed, SIDEBAR_DEFAULT, SIDEBAR_MAX, SIDEBAR_MIN, useSidebar } from '../../state/sidebar';
import { Layout } from '.';

function Probe() {
  const { width, collapsed } = useSidebar();
  return <output data-testid="sidebar">{`${width}|${String(collapsed)}`}</output>;
}

function renderLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<Probe />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

// jsdom has no PointerEvent: a MouseEvent carries the same button / clientX fields.
globalThis.PointerEvent ??= MouseEvent as unknown as typeof PointerEvent;

const sidebar = () => screen.getByTestId('sidebar').textContent;
const separator = () => screen.getByRole('separator', { name: 'Resize sidebar' });

beforeEach(() => act(() => resetSidebarWidth()));
afterEach(() => act(() => resetSidebarWidth()));

describe('sidebar resize and hide', () => {
  it('is a keyboard-operable splitter reporting its width', async () => {
    renderLayout();
    const sep = separator();
    expect(sep).toHaveAttribute('aria-valuenow', String(SIDEBAR_DEFAULT));
    sep.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(sidebar()).toBe(`${SIDEBAR_DEFAULT + 16}|false`);
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(sidebar()).toBe(`${SIDEBAR_DEFAULT - 16}|false`);
    await userEvent.keyboard('{End}');
    expect(sidebar()).toBe(`${SIDEBAR_MAX}|false`);
    await userEvent.keyboard('{Home}{ArrowLeft}');
    expect(sidebar()).toBe(`${SIDEBAR_MIN}|false`);
    await userEvent.keyboard('a');
    await userEvent.keyboard('{Enter}');
    expect(sidebar()).toBe(`${SIDEBAR_MIN}|true`);
  });

  it('resizes by dragging, hides when dragged far left, and double-click resets', () => {
    renderLayout();
    const sep = separator();
    fireEvent.pointerDown(sep, { button: 2, clientX: 256 });
    fireEvent.pointerMove(window, { clientX: 300 });
    expect(sidebar()).toBe(`${SIDEBAR_DEFAULT}|false`); // right button: no drag

    fireEvent.pointerDown(sep, { button: 0, clientX: 256 });
    expect(document.body).toHaveClass('cursor-col-resize');
    fireEvent.pointerMove(window, { clientX: 320 });
    expect(sidebar()).toBe('320|false');
    fireEvent.pointerMove(window, { clientX: 40 });
    expect(sidebar()).toBe('320|true');
    fireEvent.pointerMove(window, { clientX: 300 });
    expect(sidebar()).toBe('300|false');
    fireEvent.pointerUp(window);
    expect(document.body).not.toHaveClass('cursor-col-resize');
    fireEvent.pointerMove(window, { clientX: 380 });
    expect(sidebar()).toBe('300|false');

    fireEvent.doubleClick(separator());
    expect(sidebar()).toBe(`${SIDEBAR_DEFAULT}|false`);
  });

  it('hides and shows with buttons', async () => {
    renderLayout();
    expect(screen.queryByRole('button', { name: 'Show sidebar' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Hide sidebar' }));
    expect(screen.getByRole('banner')).toHaveClass('md:hidden');
    await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
    expect(screen.getByRole('banner')).not.toHaveClass('md:hidden');
  });

  it('toggles with Cmd/Ctrl+B, but not while typing or with other modifiers', () => {
    renderLayout();
    fireEvent.keyDown(window, { key: 'b', metaKey: true });
    expect(sidebar()).toMatch(/\|true$/);
    fireEvent.keyDown(window, { key: 'B', ctrlKey: true });
    expect(sidebar()).toMatch(/\|false$/);
    fireEvent.keyDown(window, { key: 'b' });
    fireEvent.keyDown(window, { key: 'b', metaKey: true, shiftKey: true });
    fireEvent.keyDown(window, { key: 'x', metaKey: true });
    expect(sidebar()).toMatch(/\|false$/);
    const input = document.createElement('input');
    document.body.append(input);
    fireEvent.keyDown(input, { key: 'b', metaKey: true });
    expect(sidebar()).toMatch(/\|false$/);
    input.remove();
    act(() => setSidebarCollapsed(false));
  });
});
