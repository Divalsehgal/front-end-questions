import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileTree } from './FileTree';

const setup = () => {
  const props = { onOpen: vi.fn(), onCreate: vi.fn(), onDelete: vi.fn() };
  render(<FileTree files={['App.tsx', 'components/Button.tsx']} active="App.tsx" {...props} />);
  return props;
};

describe('FileTree', () => {
  it('shows folders and files, and opens a file', () => {
    const { onOpen } = setup();
    const tree = screen.getByRole('navigation', { name: 'Files' });
    expect(tree).toHaveTextContent('components');
    expect(screen.getByRole('button', { name: 'App.tsx' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: 'Button.tsx' }));
    expect(onOpen).toHaveBeenCalledWith('components/Button.tsx');
  });

  it('creates .ts / .tsx files only, inside a folder when started from one', () => {
    const { onCreate } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'New file' }));
    const input = screen.getByRole('textbox', { name: 'New file path' });
    fireEvent.change(input, { target: { value: 'styles.css' } });
    fireEvent.submit(input);
    expect(screen.getByText('Use a .ts or .tsx file name.')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(onCreate).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'New file in components' }));
    const inFolder = screen.getByRole('textbox', { name: 'New file path' });
    expect(inFolder).toHaveValue('components/');
    fireEvent.change(inFolder, { target: { value: 'components/Card.tsx' } });
    fireEvent.submit(inFolder);
    expect(onCreate).toHaveBeenCalledWith('components/Card.tsx');
  });

  it('resizes the files panel from its edge', () => {
    setup();
    const nav = screen.getByRole('navigation', { name: 'Files' });
    const handle = screen.getByRole('separator', { name: 'Resize files panel' });
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(nav).toHaveStyle({ width: '192px' });
    for (let i = 0; i < 10; i++) fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(nav).toHaveStyle({ width: '120px' }); // never narrower than its minimum
  });

  it('deletes files after confirming, but never the entry', () => {
    const { onDelete } = setup();
    expect(screen.queryByRole('button', { name: 'Delete App.tsx' })).not.toBeInTheDocument();
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
    fireEvent.click(screen.getByRole('button', { name: 'Delete components/Button.tsx' }));
    expect(onDelete).toHaveBeenCalledWith('components/Button.tsx');
  });
});
