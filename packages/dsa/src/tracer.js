// Dry-runs pasted JavaScript: adds a probe after every statement that records the
// variables in scope, runs the code, and returns one row per probe.
// Plain JS so packages/dsa/scripts/traces.mjs can use it in Node too (types: tracer.d.ts).
/* eslint-disable complexity, max-lines-per-function -- an AST walker: one branch per node type */
import { parse } from 'acorn';
import { fmt } from './fmt.js';

export { fmt };
// ---------- instrumentation ----------
function patternNames(p, out = []) {
  if (!p) return out;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach((x) => patternNames(x.type === 'RestElement' ? x.argument : x.value, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach((e) => patternNames(e, out));
  else if (p.type === 'AssignmentPattern') patternNames(p.left, out);
  else if (p.type === 'RestElement') patternNames(p.argument, out);
  return out;
}

const FN = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);

// import lines become blank lines so pasted exercise files keep their line numbers
export const stripImports = (src) => src.replaceAll(/^[ \t]*import\s[^;\n]*from\s*['"][^'"]+['"];?[ \t]*$/gm, '');

export function instrument(src) {
  const ast = parse(src, {
    ecmaVersion: 'latest',
    sourceType: 'script',
    locations: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
  });
  // Inserts at the same position: the one pushed first ends up last in the text.
  const inserts = [];
  const at = (pos, text) => inserts.push({ pos, text });
  const scopes = [[]];
  const declare = (names, from) => scopes.at(-1).push(...names.map((name) => ({ name, from })));
  const probe = (node, pos) => {
    const names = [
      ...new Set(
        scopes
          .flat()
          .filter((v) => v.from <= pos)
          .map((v) => v.name),
      ),
    ];
    const getters = names.map((n) => JSON.stringify(n) + ': () => ' + n).join(', ');
    return `__t(${node.loc.start.line}, {${getters}});`;
  };
  const scoped = (fn) => {
    scopes.push([]);
    fn();
    scopes.pop();
  };

  function expr(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(expr);
    if (FN.has(node.type)) return func(node);
    if (node.type === 'MethodDefinition' || node.type === 'PropertyDefinition') {
      if (node.computed) expr(node.key);
      return expr(node.value);
    }
    for (const key in node) {
      if (key === 'loc') continue;
      const child = node[key];
      if (child && typeof child === 'object') expr(child);
    }
  }

  function func(node) {
    const saved = scopes.length;
    scopes.push([]);
    declare(
      node.params.flatMap((p) => patternNames(p)),
      node.start,
    );
    if (node.type !== 'ArrowFunctionExpression') declare(['this'], node.start);
    node.params.forEach(expr); // default values may hold functions
    if (node.body.type === 'BlockStatement') block(node.body.body);
    else expr(node.body);
    scopes.length = saved;
  }

  // a statement in an if/loop body; wrap it in braces when it isn't a block
  function body(node) {
    if (node.type === 'BlockStatement') return scoped(() => block(node.body));
    at(node.end, '}');
    scoped(() => block([node]));
    at(node.start, '{');
  }

  function block(stmts, last = null) {
    for (const s of stmts) stmt(s, s === last);
  }

  function stmt(s, isResult) {
    switch (s.type) {
      case 'EmptyStatement':
        return;
      case 'FunctionDeclaration':
        return func(s);
      case 'ClassDeclaration':
        return expr(s.body);
      case 'VariableDeclaration':
        expr(s.declarations.map((d) => d.init));
        declare(
          s.declarations.flatMap((d) => patternNames(d.id)),
          s.end,
        );
        return at(s.end, ';' + probe(s, s.end)); // ; guards against code without semicolons
      case 'ExpressionStatement':
        expr(s.expression);
        if (isResult) return at(s.start, 'return ');
        return at(s.end, ';' + probe(s, s.end)); // ; guards against code without semicolons
      case 'ReturnStatement':
      case 'ThrowStatement':
        expr(s.argument);
        return at(s.start, probe(s, s.start));
      case 'BreakStatement':
      case 'ContinueStatement':
        return;
      case 'IfStatement':
        expr(s.test);
        body(s.consequent);
        if (s.alternate) body(s.alternate);
        return;
      case 'ForStatement':
        return scoped(() => {
          expr(s.init);
          if (s.init?.type === 'VariableDeclaration')
            declare(
              s.init.declarations.flatMap((d) => patternNames(d.id)),
              s.init.end,
            );
          expr(s.test);
          expr(s.update);
          body(s.body);
        });
      case 'ForInStatement':
      case 'ForOfStatement':
        return scoped(() => {
          expr(s.right);
          declare(patternNames(s.left.type === 'VariableDeclaration' ? s.left.declarations[0].id : s.left), s.left.end);
          body(s.body);
        });
      case 'WhileStatement':
      case 'DoWhileStatement':
        expr(s.test);
        return body(s.body);
      case 'BlockStatement':
        return scoped(() => block(s.body));
      case 'TryStatement':
        scoped(() => block(s.block.body));
        if (s.handler)
          scoped(() => {
            declare(patternNames(s.handler.param), s.handler.start);
            block(s.handler.body.body);
          });
        if (s.finalizer) scoped(() => block(s.finalizer.body));
        return;
      case 'SwitchStatement':
        expr(s.discriminant);
        return scoped(() =>
          s.cases.forEach((c) => {
            expr(c.test);
            block(c.consequent);
          }),
        );
      case 'LabeledStatement':
        return stmt(s.body, false);
      default:
        expr(s);
    }
  }

  const last = ast.body.at(-1);
  block(ast.body, last?.type === 'ExpressionStatement' ? last : null);

  let out = src;
  inserts
    .map((x, i) => ({ ...x, i }))
    .sort((a, b) => b.pos - a.pos || a.i - b.i)
    .forEach(({ pos, text }) => (out = out.slice(0, pos) + text + out.slice(pos)));
  return out;
}

// ---------- run ----------
// eslint-disable-next-line require-await -- only its constructor is used
const AsyncFunction = Object.getPrototypeOf(async () => undefined).constructor;

/**
 * Runs src with probes. env holds extra globals (helpers, check).
 * Returns { output, steps, cols, error }; steps are kept even when the code throws.
 */
export async function dryRun(src, env = {}, { limit = 1000, timeout = 5000 } = {}) {
  const code = stripImports(src);
  const lines = code.split('\n');
  const steps = [];
  const __t = (line, getters) => {
    if (steps.length >= limit) throw new Error(`Stopped after ${limit} steps. Infinite loop, or input too big for a dry run?`);
    const vals = {};
    for (const [k, get] of Object.entries(getters)) {
      let v;
      try {
        v = get();
      } catch {
        continue; // not initialised yet
      }
      if (v === globalThis || (typeof v === 'function' && k !== 'this')) continue;
      vals[k] = fmt(v);
    }
    steps.push({ note: `L${line}  ${lines[line - 1].trim()}`, vals });
  };

  let output;
  let error = null;
  let timer;
  try {
    const fn = new AsyncFunction('__t', ...Object.keys(env), '{' + instrument(code) + '\n}'); // block lets your own class ListNode shadow the helper
    const timedOut = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timed out after ${timeout / 1000}s`)), timeout);
    });
    output = fmt(await Promise.race([fn(__t, ...Object.values(env)), timedOut]));
  } catch (e) {
    error = e instanceof SyntaxError && e.loc ? `Syntax error: ${e.message}` : String(e?.message ?? e);
  } finally {
    clearTimeout(timer);
  }
  const cols = [...new Set(steps.flatMap((s) => Object.keys(s.vals)))];
  return { output, steps, cols, error };
}
