import { act, render, screen } from '@testing-library/react';
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
});

describe('preview documents', () => {
  it('builds a React document with an import map, Tailwind and the error hook', async () => {
    const doc = await reactDocument('export default function App() { return null }');
    expect(doc).toContain('<script type="importmap">');
    expect(doc).toContain('@tailwindcss/browser');
    expect(doc).toContain('/*compiled*/export default');
    expect(doc).not.toContain('fake-indexeddb');
    expect(await reactDocument('indexedDB.open("x")')).toContain('fake-indexeddb');
  });

  it('injects the error hook into the head of a vanilla document, or before it if there is none', () => {
    const withHead = vanillaDocument('<html><head><title>x</title></head><body></body></html>');
    expect(withHead.indexOf('id="__error"')).toBeGreaterThan(withHead.indexOf('<head>'));
    expect(withHead.indexOf('id="__error"')).toBeLessThan(withHead.indexOf('<title>'));
    expect(vanillaDocument('<p>hi</p>').endsWith('<p>hi</p>')).toBe(true);
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
});
