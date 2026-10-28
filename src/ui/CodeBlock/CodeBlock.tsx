import { Highlight } from 'prism-react-renderer';
import { withStableKeys } from '../lib';
import { syntaxTheme } from './syntaxTheme';

type Token = { content: string };
const lineText = (line: Token[]) => line.map((t) => t.content).join('');

/** Read-only, syntax-highlighted code. Colours come from the --syntax-* tokens, so it follows the theme. */
export function CodeBlock({ code, lang = 'tsx' }: Readonly<{ code: string; lang?: string }>) {
  return (
    <Highlight code={code} language={lang} theme={syntaxTheme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="overflow-x-auto rounded-lg border border-line bg-code p-4 font-mono text-sm leading-6">
          <code>
            {withStableKeys(tokens, lineText).map(({ item: line, key }, i) => (
              <div key={key} {...getLineProps({ line })} className="table-row">
                <span aria-hidden className="table-cell pr-4 text-right text-text-muted select-none">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {withStableKeys(line, (t) => t.content).map(({ item: token, key: tokenKey }) => (
                    <span key={tokenKey} {...getTokenProps({ token })} />
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
