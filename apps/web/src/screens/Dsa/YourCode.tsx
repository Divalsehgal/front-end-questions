'use client';
import * as helpers from '@fe-grind/dsa/helpers';
import { dryRun, fmt, type DryRunResult } from '@fe-grind/dsa/tracer';
import { Button, Callout, Kbd, useModKey, withStableKeys } from '@fe-grind/ui';
import { useState } from 'react';
import { TraceTable } from './TraceTable';

const CODE_KEY = 'dsa-dryrun-code';
const SAMPLE = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}

twoSum([2, 7, 11, 15], 9)`;

type Test = { label: string; ok: boolean; expected: string; actual: string };

const saved = () => {
  try {
    return localStorage.getItem(CODE_KEY) ?? SAMPLE;
  } catch {
    return SAMPLE;
  }
};

/** Paste any function and the call to trace; runs it with a probe after every statement. */
export function YourCode() {
  const mod = useModKey();
  // Only mounted after a click, so reading localStorage here can't mismatch the server HTML.
  const [code, setCode] = useState(saved);
  const [result, setResult] = useState<(DryRunResult & { tests: Test[] }) | null>(null);
  const [running, setRunning] = useState(false);

  const save = (value: string) => {
    setCode(value);
    try {
      localStorage.setItem(CODE_KEY, value);
    } catch {
      // storage blocked: the code just won't be remembered
    }
  };

  const run = async () => {
    setRunning(true);
    const tests: Test[] = [];
    // exercise files call check(); collect the results instead of printing them
    const check = (label: string, actual: unknown, expected: unknown) => {
      tests.push({ label, ok: JSON.stringify(actual) === JSON.stringify(expected), expected: fmt(expected), actual: fmt(actual) });
    };
    const res = await dryRun(code, { ...helpers, check });
    setResult({ ...res, tests });
    setRunning(false);
  };

  return (
    <section aria-labelledby="your-code">
      <h2 id="your-code" className="mb-3.5 text-xl font-semibold tracking-tight">
        Your code
      </h2>
      <div className="mb-3 max-w-prose space-y-2 text-sm text-text-muted">
        <p>
          Paste a function and end with the call to trace; its value is the output. A whole exercise file works too, its check() calls show as tests. ListNode,
          TreeNode, arrayToList, listToArray, arrayToTree, treeToArray and wait are available without importing, or paste your own class ListNode.
        </p>
        <p>
          Linked list: <code className="font-mono">reverse(arrayToList([1, 2, 3]))</code> builds 1 -&gt; 2 -&gt; 3 and passes its head. Any node variable shows
          as the list from that node on, for example curr = 2 -&gt; 3.
        </p>
      </div>
      <textarea
        spellCheck={false}
        aria-label="Code to dry run"
        value={code}
        rows={Math.min(24, Math.max(10, code.split('\n').length + 1))}
        onChange={(e) => save(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            void run();
          } else if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            const el = e.currentTarget;
            const { selectionStart: a, selectionEnd: b } = el;
            save(code.slice(0, a) + '  ' + code.slice(b));
            requestAnimationFrame(() => el.setSelectionRange(a + 2, a + 2));
          }
        }}
        className="block w-full resize-y rounded-xl border border-line-strong bg-surface px-4 py-3.5 font-mono text-[13px] leading-relaxed [tab-size:2]"
      />
      <div className="mt-3 mb-5 flex gap-2">
        <Button onClick={() => void run()} disabled={running}>
          {running ? 'Running' : 'Dry run'} <Kbd>{mod}+Enter</Kbd>
        </Button>
        <Button variant="secondary" onClick={() => save(SAMPLE)}>
          Reset to example
        </Button>
      </div>

      {result && <RunResult result={result} />}
    </section>
  );
}

/** What a run produced: an error or the output, check() results, then the variable table. */
function RunResult({ result }: Readonly<{ result: DryRunResult & { tests: Test[] } }>) {
  return (
    <div>
      {result.error && (
        <div className="mb-4">
          <Callout tone="error" title="Error" role="alert">
            <span className="font-mono">{result.error}</span>
          </Callout>
        </div>
      )}
      {!result.error && result.output !== '-' && (
        <p className="mb-4 text-sm">
          <span className="text-text-muted">Output </span>
          <span className="font-mono">{result.output}</span>
        </p>
      )}
      {result.tests.length > 0 && (
        <ul className="mb-4 space-y-1 text-sm">
          {withStableKeys(result.tests, (t) => t.label).map(({ item: t, key }) => (
            <li key={key}>
              <b className={t.ok ? 'font-mono text-xs text-success' : 'font-mono text-xs text-error'}>{t.ok ? 'PASS' : 'FAIL'}</b> {t.label}
              {!t.ok && (
                <span className="block pl-11 font-mono text-xs text-text-muted">
                  expected {t.expected}, got {t.actual}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {result.steps.length > 0 && <TraceTable steps={result.steps} cols={result.cols} />}
      {result.steps.length === 0 && !result.error && <p className="text-sm text-text-muted">No steps recorded. Does the last line call your function?</p>}
    </div>
  );
}
