import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reactDocument, rewriteImports, vanillaDocument } from './previewDocument';
import { LivePreview } from '.';

vi.mock('sucrase', () => ({
  transform: (code: string) => {
    if (code.includes('SYNTAX ERROR')) throw new Error('Unexpected token');
    return { code: `/*compiled*/${code}` };
  },
}));

describe('rewriteImports', () => {
  it('sends bare packages to esm.sh but leaves React, relative and URL imports alone', () => {
    const out = rewriteImports(
      [
        "import { X } from 'lucide-react';",
        "import React from 'react';",
        "import a from './a';",
        "import d from 'dayjs/plugin/utc';",
        "import b from '@base-ui/react/menu';",
        "const m = import('clsx');",
        "import u from 'https://x.dev/u.js';",
      ].join('\n'),
    );
    expect(out).toContain("'https://esm.sh/lucide-react@1.8.0?external=react,react-dom'");
    expect(out).toContain("from 'react'");
    expect(out).toContain("from './a'");
    expect(out).toContain("'https://esm.sh/dayjs@1.11.13/plugin/utc?external=react,react-dom'");
    expect(out).toContain("'https://esm.sh/@base-ui/react@1.4.0/menu?external=react,react-dom'");
    expect(out).toContain("import('https://esm.sh/clsx@2.1.1?external=react,react-dom')");
    expect(out).toContain("'https://x.dev/u.js'");
  });

  it('accepts any spacing around dynamic import parens and keeps it', () => {
    expect(rewriteImports("import  (  'clsx')")).toBe("import  (  'https://esm.sh/clsx@2.1.1?external=react,react-dom')");
    expect(rewriteImports('import"dayjs"')).toBe('import"https://esm.sh/dayjs@1.11.13?external=react,react-dom"');
    expect(rewriteImports('from \'x"')).toBe('from \'x"');
  });

  it('runs in linear time on long whitespace after import', () => {
    const input = `import${' '.repeat(50_000)}(${' '.repeat(50_000)}x`;
    const start = performance.now();
    expect(rewriteImports(input)).toBe(input);
    expect(performance.now() - start).toBeLessThan(50);
  });
});

describe('preview documents', () => {
  it('builds a React document with an import map, Tailwind and the error hook', async () => {
    const doc = await reactDocument('export default function App() { return null }');
    expect(doc).toContain('<script type="importmap">');
    expect(doc).toContain('@tailwindcss/browser');
    expect(doc).toContain('/*compiled*/export default');
    expect(doc).not.toContain('fake-indexeddb');
    expect(await reactDocument('indexedDB.open("x")')).toContain('fake-indexeddb');
    expect(await reactDocument('while (true) {}')).toContain('while (true) {if (__lp()) break;}');
  });

  it('injects the error hook into the head of a vanilla document, or before it if there is none', () => {
    const withHead = vanillaDocument('<html><head><title>x</title></head><body></body></html>');
    expect(withHead.indexOf('id="__error"')).toBeGreaterThan(withHead.indexOf('<head>'));
    expect(withHead.indexOf('id="__error"')).toBeLessThan(withHead.indexOf('<title>'));
    expect(vanillaDocument('<p>hi</p>').endsWith('<p>hi</p>')).toBe(true);
  });

  it('injects a hook that is valid JavaScript', () => {
    const hook = /<script>([\s\S]*?)<\/script>/.exec(vanillaDocument('<p>x</p>'))![1];
    expect(() => new Function(hook)).not.toThrow();
  });

  it('guards loops in inline scripts only', () => {
    const doc = vanillaDocument('<script>for(;;){}</script><script type="application/json">{"for":1}</script><script src="a.js">while(1){}</script>');
    expect(doc).toContain('<script>for(;;){if (__lp()) break;}</script>');
    expect(doc).toContain('<script src="a.js">while(1){}</script>');
  });
});

describe('LivePreview', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders a sandboxed, titled iframe after a debounce', async () => {
    render(<LivePreview framework="vanilla" code="<p>hello</p>" title="Counter preview" />);
    const frame = screen.getByTitle('Counter preview');
    expect(frame).toHaveAttribute('sandbox', 'allow-scripts allow-modals allow-forms allow-popups');
    expect(frame.getAttribute('srcdoc')).toBe('');
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(frame.getAttribute('srcdoc')).toContain('<p>hello</p>');
  });

  it('shows compile errors as an alert', async () => {
    render(<LivePreview framework="react" code="SYNTAX ERROR" title="Broken" />);
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(screen.getByRole('alert')).toHaveTextContent('Unexpected token');
  });

  it('shows console messages from its own frame and clears them', async () => {
    render(<LivePreview framework="vanilla" code="<p>x</p>" title="Logs" />);
    const frame = screen.getByTitle('Logs') as HTMLIFrameElement;
    const post = (source: MessageEventSource | null, data: unknown) => {
      act(() => {
        window.dispatchEvent(new MessageEvent('message', { source, data }));
      });
    };
    post(frame.contentWindow, { source: 'fe-grind-preview', type: 'console', message: { level: 'log', text: 'hello' } });
    post(frame.contentWindow, { source: 'fe-grind-preview', type: 'error', message: 'boom' });
    post(window, { source: 'fe-grind-preview', type: 'console', message: { level: 'log', text: 'spoofed' } });
    fireEvent.click(screen.getByRole('button', { name: /Console \(2\)/ }));
    const list = screen.getByRole('list', { name: 'Logs console' });
    expect(list).toHaveTextContent('hello');
    expect(list).toHaveTextContent('boom');
    expect(list).not.toHaveTextContent('spoofed');
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(list).toHaveTextContent('No logs yet.');
    post(frame.contentWindow, { source: 'fe-grind-preview', type: 'console', message: { level: 'log', text: 'again' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reload preview' }));
    expect(list).toHaveTextContent('No logs yet.');
    expect(screen.getByTitle('Logs')).not.toBe(frame); // iframe remounted
  });

  it('unloads a preview whose memory keeps growing, until reloaded', () => {
    render(<LivePreview framework="vanilla" code="<p>x</p>" title="Leaky" />);
    const frame = screen.getByTitle('Leaky') as HTMLIFrameElement;
    const heap = (bytes: number) => {
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', { source: frame.contentWindow, data: { source: 'fe-grind-preview', type: 'memory', message: bytes } }),
        );
      });
    };
    heap(50e6);
    heap(200e6);
    expect(screen.getByTitle('Leaky')).toBeInTheDocument();
    heap(400e6);
    expect(screen.queryByTitle('Leaky')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('memory grew by');
    fireEvent.click(screen.getByRole('button', { name: 'Reload preview' }));
    expect(screen.getByTitle('Leaky')).toBeInTheDocument();
  });
});
