// Infinite loops would freeze the whole tab (the preview iframe shares the page's thread), so every
// braced for / while / do body gets `if (__lp()) break;` as its first statement. __lp (defined in the
// preview's hook) breaks a loop that has run for over a second without yielding, like CodePen does.
// shortcut: a hand-rolled scanner, not a parser: brace-less loop bodies are left unguarded and a regex
// literal containing a quote can confuse it; switch to a real parser (acorn) if that bites.
const GUARD = 'if (__lp()) break;';
const IDENT = /[\w$]/;

/** Index just past the string, template or comment starting at i, or i if none starts there. */
function skipNonCode(src: string, i: number): number {
  const c = src[i];
  if (c === '/' && src[i + 1] === '/') {
    const end = src.indexOf('\n', i);
    return end === -1 ? src.length : end;
  }
  if (c === '/' && src[i + 1] === '*') {
    const end = src.indexOf('*/', i + 2);
    return end === -1 ? src.length : end + 2;
  }
  if (c !== '"' && c !== "'" && c !== '`') return i;
  for (let j = i + 1; j < src.length; j++) {
    if (src[j] === '\\') j++;
    else if (src[j] === c) return j + 1;
  }
  return src.length;
}

const skipSpace = (src: string, i: number) => {
  while (i < src.length) {
    const next = skipNonCode(src, i);
    if (next !== i) i = next;
    else if (/\s/.test(src[i])) i++;
    else break;
  }
  return i;
};

/** Index just past the parenthesised group opening at i. */
function skipParens(src: string, i: number): number {
  let depth = 0;
  while (i < src.length) {
    const next = skipNonCode(src, i);
    if (next !== i) {
      i = next;
      continue;
    }
    if (src[i] === '(') depth++;
    if (src[i] === ')' && --depth === 0) return i + 1;
    i++;
  }
  return i;
}

const keywordAt = (src: string, i: number, word: string) =>
  src.startsWith(word, i) && !IDENT.test(src[i - 1] ?? '') && src[i - 1] !== '.' && !IDENT.test(src[i + word.length] ?? '');

/** Where the body of a loop starting at i begins (`for`, `for await`, `while`, `do`), or -1 if no loop starts there. */
function loopBodyAt(src: string, i: number): number {
  if (keywordAt(src, i, 'do')) return skipSpace(src, i + 2);
  if (!keywordAt(src, i, 'for') && !keywordAt(src, i, 'while')) return -1;
  let j = skipSpace(src, i + (src[i] === 'f' ? 3 : 5));
  if (keywordAt(src, j, 'await')) j = skipSpace(src, j + 5);
  return src[j] === '(' ? skipSpace(src, skipParens(src, j)) : -1;
}

export function protectLoops(src: string): string {
  const inserts: number[] = [];
  let i = 0;
  while (i < src.length) {
    const next = skipNonCode(src, i);
    if (next !== i) {
      i = next;
      continue;
    }
    const body = loopBodyAt(src, i);
    if (body !== -1 && src[body] === '{') inserts.push(body + 1);
    i++;
  }
  let out = src;
  for (const at of inserts.reverse()) out = out.slice(0, at) + GUARD + out.slice(at);
  return out;
}
