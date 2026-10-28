import { reactDocument, vanillaDocument } from '../../ui/LivePreview/previewDocument';

/** Renders a UI answer in a hidden sandboxed iframe and waits for it to report ready (null) or an error message. */
export async function renderPreview(framework: 'react' | 'vanilla', code: string, timeoutMs = 30_000): Promise<string | null> {
  const doc = framework === 'react' ? await reactDocument(code) : vanillaDocument(code);
  const frame = document.createElement('iframe');
  frame.setAttribute('sandbox', 'allow-scripts allow-forms');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:800px;height:600px;';
  return new Promise((resolve) => {
    const done = (result: string | null) => {
      window.removeEventListener('message', onMessage);
      clearTimeout(timer);
      frame.remove();
      resolve(result);
    };
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.contentWindow || e.data?.source !== 'fe-grind-preview') return;
      if (e.data.type === 'error') done(e.data.message);
      if (e.data.type === 'ready') done(null);
    };
    const timer = setTimeout(() => done(`preview did not report ready within ${timeoutMs / 1000}s`), timeoutMs);
    window.addEventListener('message', onMessage);
    frame.srcdoc = doc;
    document.body.append(frame);
  });
}
