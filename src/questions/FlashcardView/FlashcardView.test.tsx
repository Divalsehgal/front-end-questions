import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DISCLOSURE_LABEL } from '../shared';
import { FlashcardView } from '.';
import type { FlashcardQuestion } from '../../content/types';

const q: FlashcardQuestion = {
  kind: 'flashcard',
  id: 'f1',
  title: 'Closures',
  front: 'What is a **closure**?',
  back: 'A function plus:\n- its lexical scope',
  code: 'const f = () => x;',
};

const setup = (question = q) => {
  const onResult = vi.fn();
  render(<FlashcardView q={question} subject="js" onResult={onResult} />);
  return { onResult, user: userEvent.setup() };
};

describe('FlashcardView', () => {
  it('hides the answer until revealed', async () => {
    const { user } = setup();
    expect(screen.getByText('closure').tagName).toBe('STRONG');
    expect(document.querySelector('pre')).toHaveTextContent('const f = () => x;');
    expect(screen.queryByRole('region', { name: 'Answer' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reveal answer' }));
    expect(screen.getByRole('region', { name: 'Answer' })).toHaveTextContent('its lexical scope');
  });

  it('reveals with Space and rates with 1 (knew it)', async () => {
    const { onResult, user } = setup({ ...q, code: undefined });
    await user.keyboard('1');
    expect(onResult).not.toHaveBeenCalled();
    await user.keyboard(' ');
    expect(screen.getByRole('region', { name: 'Answer' })).toBeInTheDocument();
    await user.keyboard('1');
    expect(onResult).toHaveBeenCalledWith(true);
    expect(screen.getByRole('status')).toHaveTextContent('Nice.');
    await user.keyboard('2');
    expect(onResult).toHaveBeenCalledTimes(1);
  });

  it('reveals with Enter and rates with 2 (not really)', async () => {
    const { onResult, user } = setup();
    await user.keyboard('{Enter}');
    await user.keyboard('2');
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('come back in Review');
  });

  it('rates with the buttons', async () => {
    const { onResult, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Reveal answer' }));
    await user.click(screen.getByRole('button', { name: 'Not really' }));
    expect(onResult).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('button', { name: 'I knew it' })).not.toBeInTheDocument();
  });

  it('rates "I knew it" with its button', async () => {
    const { onResult, user } = setup();
    await user.keyboard(' ');
    await user.click(screen.getByRole('button', { name: 'I knew it' }));
    expect(onResult).toHaveBeenCalledWith(true);
  });

  it('has the back of the card in a disclosure that reveals like the button', async () => {
    const { onResult, user } = setup();
    expect(screen.getByText(DISCLOSURE_LABEL).closest('details')).toHaveTextContent(/./);
    await user.click(screen.getByText(DISCLOSURE_LABEL));
    expect(await screen.findByRole('region', { name: 'Answer' })).toBeInTheDocument();
    expect(screen.queryByText(DISCLOSURE_LABEL)).not.toBeInTheDocument();
    expect(onResult).not.toHaveBeenCalled();
  });
});
