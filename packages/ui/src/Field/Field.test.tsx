import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioOption, TextField } from '.';

describe('TextField', () => {
  it('labels the input, including the hint, and passes props through', async () => {
    const onChange = vi.fn();
    render(<TextField label="Name" hint="(optional)" value="" onChange={onChange} maxLength={5} />);
    const input = screen.getByRole('textbox', { name: 'Name (optional)' });
    expect(input).toHaveAttribute('maxlength', '5');
    await userEvent.type(input, 'a');
    expect(onChange).toHaveBeenCalled();
  });
});

describe('RadioOption', () => {
  it('is a labelled radio with its hint', () => {
    render(<RadioOption name="g" value="a" title="Option A" hint="Details" defaultChecked />);
    expect(screen.getByRole('radio', { name: /Option A/ })).toBeChecked();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<RadioOption name="g" value="a" title="Option A" disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });
});
