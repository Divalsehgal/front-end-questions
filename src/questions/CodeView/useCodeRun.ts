import { useRef, useState } from 'react';
import { runCodeTests, type TestResult } from '../../runtime/sandbox';
import { checkTypes, type TypeIssue } from '../../runtime/typecheck';
import type { CodeQuestion } from '../../content/types';
import type { Monaco } from '../../ui/code';

export type RunState = { results: TestResult[]; logs: string[]; fatal?: string } | null;

export const allPassed = (run: RunState) => !!run && !run.fatal && run.results.length > 0 && run.results.every((r) => r.ok);

/**
 * Runs the drill's tests (in the sandbox worker) and type tests (in Monaco's TS worker).
 * `onSolved` fires when everything that judges this drill passes.
 */
export function useCodeRun(q: CodeQuestion, code: string, onSolved: () => void, onDone: () => void) {
  const [running, setRunning] = useState(false);
  const [run, setRun] = useState<RunState>(null);
  const [types, setTypes] = useState<TypeIssue[] | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  // Pure type challenges have no runtime tests: the type checker is the judge.
  const typeOnly = !q.tests;

  const runTypes = async () => {
    if (!monacoRef.current || !q.typeTests) return;
    setRunning(true);
    const issues = await checkTypes(monacoRef.current, q.id, code, q.typeTests);
    setTypes(issues);
    setRunning(false);
    onDone();
    if (typeOnly && issues.length === 0) onSolved();
  };

  const runTests = async () => {
    if (!q.tests) return runTypes();
    setRunning(true);
    const res = await runCodeTests(code, q.tests);
    setRun(res);
    setRunning(false);
    onDone();
    if (allPassed(res)) onSolved();
  };

  const clear = () => {
    setRun(null);
    setTypes(null);
  };

  const setMonaco = (m: Monaco) => {
    monacoRef.current = m;
  };

  return { running, run, types, typeOnly, runTests, runTypes, clear, setMonaco };
}
