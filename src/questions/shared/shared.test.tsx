import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadDraft } from '../../state/progress';
import { AnswerDisclosure, confirmReveal, DISCLOSURE_LABEL, isTyping, REVEAL_CONFIRM, shuffle, useDraft, useFirstVerdict, useShortcuts } from '.';

describe('useFirstVerdict', () => {
  it('reports only the first verdict, across re-renders', () => {
    const onResult = vi.fn();
    const { result, rerender } = renderHook(() => useFirstVerdict(onResult));
    result.current(false);
    rerender();
    result.current(true);
    result.current(true);
    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith(false);
  });
});

describe('confirmReveal', () => {
  it('skips the prompt once solved, otherwise asks', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    expect(confirmReveal(true)).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
    expect(confirmReveal(false)).toBe(false);
    expect(confirm).toHaveBeenCalledWith(REVEAL_CONFIRM);
  });
});

describe('shuffle', () => {
  it('returns a new permutation without touching the input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect(out).not.toBe(input);
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('uses Math.random (Fisher–Yates)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(shuffle([1, 2, 3])).toEqual([2, 3, 1]);
  });
});

describe('isTyping / useShortcuts', () => {
  it('fires for keys outside text fields only, using the latest handler', () => {
    const first = vi.fn();
    const latest = vi.fn();
    const { rerender, unmount, container } = render(<Probe handler={first} />);
    rerender(<Probe handler={latest} />);
    fireEvent.keyDown(window, { key: '1' });
    expect(latest).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    fireEvent.keyDown(container.querySelector('textarea')!, { key: '1' });
    fireEvent.keyDown(container.querySelector('input')!, { key: '1' });
    fireEvent.keyDown(container.querySelector('.monaco-editor span')!, { key: '1' });
    expect(latest).toHaveBeenCalledTimes(1);
    unmount();
    fireEvent.keyDown(window, { key: '1' });
    expect(latest).toHaveBeenCalledTimes(1);
  });

  it('treats contenteditable as typing', () => {
    const el = document.createElement('div');
    el.contentEditable = 'true';
    Object.defineProperty(el, 'isContentEditable', { value: true });
    expect(isTyping({ target: el } as unknown as KeyboardEvent)).toBe(true);
    expect(isTyping({ target: document.body } as unknown as KeyboardEvent)).toBe(false);
  });
});

function Probe({ handler }: { handler: (e: KeyboardEvent) => void }) {
  useShortcuts(handler);
  return (
    <div>
      <textarea aria-label="t" />
      <input aria-label="i" />
      <div className="monaco-editor">
        <span>code</span>
      </div>
    </div>
  );
}

describe('useDraft', () => {
  beforeEach(() => localStorage.clear());

  it('starts from the starter, persists edits and restores them', () => {
    const { result, unmount } = renderHook(() => useDraft('js:d1', 'starter'));
    expect(result.current.code).toBe('starter');
    act(() => result.current.setCode('edited'));
    expect(loadDraft('js:d1')).toBe('edited');
    unmount();
    expect(renderHook(() => useDraft('js:d1', 'starter')).result.current.code).toBe('edited');
  });

  it('asks before discarding work and resets when confirmed', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { result } = renderHook(() => useDraft('js:d2', 'starter'));
    act(() => result.current.setCode('mine'));
    let reset = true;
    act(() => {
      reset = result.current.reset('Discard?');
    });
    expect(reset).toBe(false);
    expect(result.current.code).toBe('mine');
    act(() => {
      reset = result.current.reset('Discard?');
    });
    expect(reset).toBe(true);
    expect(result.current.code).toBe('starter');
    expect(confirm).toHaveBeenCalledTimes(2);
  });

  it('resets without asking when nothing changed', () => {
    const confirm = vi.spyOn(window, 'confirm');
    const { result } = renderHook(() => useDraft('js:d3', 'starter'));
    act(() => {
      expect(result.current.reset('Discard?')).toBe(true);
    });
    expect(confirm).not.toHaveBeenCalled();
  });
});

describe('AnswerDisclosure', () => {
  it('renders its content in the HTML but collapsed, and snaps shut when the reveal is refused', async () => {
    const onOpen = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);
    render(
      <AnswerDisclosure onOpen={onOpen}>
        <p>The answer</p>
      </AnswerDisclosure>,
    );
    const details = screen.getByText(DISCLOSURE_LABEL).closest('details')!;
    expect(details.open).toBe(false);
    expect(details).toHaveTextContent('The answer');
    await userEvent.click(screen.getByText(DISCLOSURE_LABEL));
    await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(details.open).toBe(false));
    await userEvent.click(screen.getByText(DISCLOSURE_LABEL));
    await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(2));
    expect(details.open).toBe(true);
  });

  it('takes a custom label', () => {
    render(
      <AnswerDisclosure onOpen={() => true} label="Show reference solution">
        x
      </AnswerDisclosure>,
    );
    expect(screen.getByText('Show reference solution')).toBeInTheDocument();
  });
});
