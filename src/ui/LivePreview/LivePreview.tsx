import { useEffect, useState } from 'react';

/** Renders a machine-coding answer in a sandboxed iframe, debounced while typing. */
export function LivePreview({ framework, code, title }: { framework: 'react' | 'vanilla'; code: string; title: string }) {
  const [doc, setDoc] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Debounce so the preview doesn't reload on every keystroke.
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        // Loaded on demand: it pulls in sucrase for the React transform.
        const { reactDocument, vanillaDocument } = await import('./previewDocument');
        setDoc(framework === 'react' ? await reactDocument(code) : vanillaDocument(code));
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }, 500);
    return () => clearTimeout(t);
  }, [code, framework]);

  return (
    <div className="relative h-full min-h-96 bg-surface">
      {error && (
        <pre role="alert" className="absolute inset-x-0 top-0 z-10 bg-error-soft px-4 py-3 font-mono text-xs whitespace-pre-wrap text-error">
          {error}
        </pre>
      )}
      <iframe title={title} srcDoc={doc} sandbox="allow-scripts allow-modals allow-forms allow-popups" className="size-full min-h-96 border-0" />
    </div>
  );
}
