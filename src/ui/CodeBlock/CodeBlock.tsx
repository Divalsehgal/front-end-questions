import { Highlight } from 'prism-react-renderer';
import { syntaxTheme } from './syntaxTheme';

/** Read-only, syntax-highlighted code. Colours come from the --syntax-* tokens, so it follows the theme. */
export function CodeBlock({ code, lang = 'tsx' }: { code: string; lang?: string }) {
  return (
    <Highlight code={code} language={lang} theme={syntaxTheme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="overflow-x-auto rounded-lg border border-line bg-code p-4 font-mono text-sm leading-6">
          <code>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span aria-hidden className="table-cell pr-4 text-right text-text-muted select-none">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, k) => (
                    <span key={k} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
