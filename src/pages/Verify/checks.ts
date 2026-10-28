// Per-kind content checks for the dev-only /verify page. Each uses the same machinery the app does.
import { loader } from '@monaco-editor/react';
import { runCodeTests, runSnippet } from '../../runtime/sandbox';
import { checkTypes, type TypeIssue } from '../../runtime/typecheck';
import { configureMonaco, type Monaco } from '../../ui/CodeEditor/monacoSetup';
import { renderPreview } from './renderPreview';
import type { FullEntry } from '../../content/registry';
import type { CodeQuestion, Question, UiQuestion } from '../../content/types';

export type CheckResult = { key: string; ok: boolean; detail: string };
type Verdict = { ok: boolean; detail: string };

const pass = (detail: string): Verdict => ({ ok: true, detail });
const fail = (detail: string): Verdict => ({ ok: false, detail });

let monacoPromise: Promise<Monaco> | null = null;
const getMonaco = () =>
  (monacoPromise ??= loader.init().then((m) => {
    configureMonaco(m);
    return m;
  }));

const describeIssues = (issues: TypeIssue[]) => `types: ${issues.map((i) => `${i.source} → ${i.shouldFail ?? i.message}`).join(' | ')}`;

async function checkTypeChallenge(q: CodeQuestion, typeTests: string): Promise<Verdict> {
  // Type challenge: the starter must fail the type tests, the solution must pass them.
  const monaco = await getMonaco();
  if (!(await checkTypes(monaco, `verify-s-${q.id}`, q.starter, typeTests)).length) return fail('starter already passes the type tests');
  if (!q.solution) return pass('no reference solution to check');
  const issues = await checkTypes(monaco, `verify-${q.id}`, q.solution, typeTests);
  return issues.length ? fail(describeIssues(issues)) : pass('type challenge: starter fails, solution passes');
}

export async function checkCode(q: CodeQuestion): Promise<Verdict> {
  if (!q.tests) return q.typeTests ? checkTypeChallenge(q, q.typeTests) : fail('no tests or type tests');
  const starter = await runCodeTests(q.starter, q.tests);
  if (!starter.fatal && starter.results.length && starter.results.every((r) => r.ok)) return fail('starter already passes every test');
  if (!q.solution) return pass('no reference solution to check');
  const sol = await runCodeTests(q.solution, q.tests);
  if (sol.fatal) return fail(`solution: ${sol.fatal}`);
  if (!sol.results.length) return fail('no tests registered');
  const bad = sol.results.filter((r) => !r.ok);
  if (bad.length) return fail(`solution fails: ${bad.map((b) => `${b.name} → ${b.error}`).join(' | ')}`);
  if (q.typeTests) {
    const issues = await checkTypes(await getMonaco(), `verify-${q.id}`, q.solution, q.typeTests);
    if (issues.length) return fail(describeIssues(issues));
  }
  return pass(`${sol.results.length} tests pass${q.typeTests ? ' + types' : ''}`);
}

async function compileReact(q: UiQuestion): Promise<string | null> {
  const { transform } = await import('sucrase');
  for (const [name, src] of [
    ['starter', q.starter],
    ['solution', q.solution],
  ] as const) {
    if (!src) continue;
    try {
      transform(src, { transforms: ['typescript', 'jsx'], jsxRuntime: 'automatic' });
    } catch (err) {
      return `${name} does not compile: ${String(err)}`;
    }
    if (!/export default/.test(src)) return `${name} has no default export`;
  }
  return null;
}

export async function checkUi(q: UiQuestion, render = renderPreview): Promise<Verdict> {
  if (!q.requirements.length) return fail('no requirements');
  const compileError = q.framework === 'react' ? await compileReact(q) : null;
  if (compileError) return fail(compileError);
  if (q.solution) {
    const error = await render(q.framework, q.solution);
    if (error) return fail(`reference preview: ${error}`);
  }
  return pass(`${q.requirements.length} requirements${q.solution ? ' + reference renders' : ''}`);
}

/** Checks that need no sandbox: quizzes, flashcards, order questions. */
export function checkStatic(q: Question): Verdict | null {
  switch (q.kind) {
    case 'quiz': {
      const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
      if (answers.some((a) => a < 0 || a >= q.options.length)) return fail('answer index out of range');
      if (new Set(q.options).size !== q.options.length) return fail('duplicate options');
      return pass(`${q.options.length} options`);
    }
    case 'flashcard':
      return q.front.trim() && q.back.trim() ? pass('ok') : fail('empty side');
    case 'order':
      if (q.items.length < 3) return fail('needs at least 3 items');
      if (new Set(q.items).size !== q.items.length) return fail('duplicate items');
      return pass(`${q.items.length} items`);
    default:
      return null;
  }
}

async function checkOutput(code: string, lang?: 'js' | 'ts'): Promise<Verdict> {
  const lines = await runSnippet(code, lang);
  if (!lines.length) return fail('logs nothing');
  if (lines.some((l) => l.startsWith('⏱'))) return fail('timed out');
  return pass(lines.join(' ⏎ '));
}

export async function verify(e: FullEntry): Promise<CheckResult> {
  const q = e.q;
  const verdict =
    checkStatic(q) ?? (q.kind === 'output' ? await checkOutput(q.code, q.lang) : q.kind === 'code' ? await checkCode(q) : await checkUi(q as UiQuestion));
  return { key: e.key, ...verdict };
}
