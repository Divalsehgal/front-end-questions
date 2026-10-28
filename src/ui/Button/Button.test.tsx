import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonClass, BUTTON_VARIANTS } from '.';

describe('Button', () => {
  it('defaults to a primary, non-submitting button', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('bg-primary', 'text-on-primary', 'px-4');
  });

  it.each(Object.keys(BUTTON_VARIANTS) as (keyof typeof BUTTON_VARIANTS)[])('applies the %s variant', (variant) => {
    render(<Button variant={variant}>Go</Button>);
    for (const cls of BUTTON_VARIANTS[variant].split(' ')) expect(screen.getByRole('button')).toHaveClass(cls);
  });

  it('supports the small size, extra classes and submit type', () => {
    render(
      <Button size="sm" type="submit" className="ml-auto">
        Send
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('px-3', 'text-xs', 'ml-auto');
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('calls onClick, but not when disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('exposes the same styling for links via buttonClass', () => {
    expect(buttonClass('secondary')).toContain('border-line');
    expect(buttonClass()).toContain('bg-primary');
    expect(buttonClass('ghost', 'sm', 'w-full')).toMatch(/px-3.*text-text-muted.*w-full/);
  });
});
