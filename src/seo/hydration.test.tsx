// Prerendered HTML must hydrate without mismatches, even when the browser has progress, a session
// theme and drafts that the server could not know about (they fill in right after hydration).
import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { ALL, hrefOf, subjectHref } from '../content/registry';
import { basename, render } from '../entry-server';
import { record, resetProgress } from '../state/progress';
import type { Kind } from '../content/types';

const kinds: Kind[] = ['quiz', 'output', 'code', 'ui', 'flashcard', 'order'];
const paths = ['/', subjectHref(ALL[0].subject.slug), ...kinds.map((k) => hrefOf(ALL.find((e) => e.q.kind === k)!.key))];

afterEach(() => {
  resetProgress();
  document.body.innerHTML = '';
});

describe('hydration', () => {
  it.each(paths)('%s hydrates cleanly and then shows local progress', async (path) => {
    const container = document.createElement('div');
    container.innerHTML = render(path).html;
    document.body.append(container);
    expect(container.textContent).not.toMatch(/[1-9]\/\d+ solved/);
    // The visitor has history in this browser that the build server never saw.
    for (const e of ALL.slice(0, 3)) record(e.key, true);

    const onRecoverableError = vi.fn();
    const consoleError = vi.spyOn(console, 'error');
    const root = await act(async () =>
      hydrateRoot(
        container,
        <MemoryRouter basename={basename} initialEntries={[basename + path]}>
          <App />
        </MemoryRouter>,
        { onRecoverableError },
      ),
    );
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    // After hydration the client store takes over: the sidebar counts solved questions.
    expect(container.textContent).toMatch(/[1-3]\/\d+ solved/);
    act(() => root.unmount());
  });
});
