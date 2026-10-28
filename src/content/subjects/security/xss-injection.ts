import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('security', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const xssInjection: Topic = {
  slug: 'xss-injection',
  title: 'XSS & injection',
  questions: [
    {
      kind: 'quiz',
      id: 'sec-q1',
      title: 'Which line is unsafe?',
      prompt: "`comment` comes from another user. Which lines can run an attacker's script?",
      options: [
        '`el.innerHTML = comment`',
        '`el.textContent = comment`',
        '`<p>{comment}</p>` in React',
        '`<div dangerouslySetInnerHTML={{ __html: comment }} />`',
      ],
      answer: [0, 3],
      why: '`innerHTML` and `dangerouslySetInnerHTML` hand the string to the HTML parser, so a payload like `<img src=x onerror=alert(1)>` creates an element whose handler runs. **Not textContent:** it sets a text node, markup is never parsed. **Not JSX {comment}:** React escapes the value and renders it as text. If you must render user or CMS HTML, sanitize it with DOMPurify first.',
    },
    {
      kind: 'quiz',
      id: 'sec-q2',
      title: 'Fixing SQL injection',
      prompt: 'What is the correct fix for this query?',
      code: "db.query(`SELECT * FROM users WHERE id = '${req.params.id}'`);",
      options: [
        "Use a parameterized query: `db.query('SELECT * FROM users WHERE id = ?', [id])`",
        'Remove quotes from `id` with `replaceAll` before building the string',
        'Validate the id on the frontend before sending it',
        'Wrap the query in try/catch',
      ],
      answer: 0,
      why: 'Parameterized queries send the SQL and the values separately, so the driver never interprets input as SQL, whatever characters it contains. **Not stripping quotes:** blacklists miss encodings, numeric contexts and other metacharacters. **Not frontend validation:** an attacker calls the API directly and skips it. **Not try/catch:** it only hides errors; the injected query still runs.',
    },
    {
      kind: 'quiz',
      id: 'sec-q3',
      title: 'What CSP is for',
      prompt: "You add `Content-Security-Policy: script-src 'self'`. What does it do?",
      options: [
        'Blocks inline scripts and scripts from other origins, so an injected `<script>` usually will not run',
        'Escapes user input automatically',
        'Fixes the XSS bug in your code',
        'Stops CSRF attacks',
      ],
      answer: 0,
      why: "`script-src 'self'` tells the browser to run only scripts loaded from your own origin, so inline `<script>`, `onerror=` handlers and third-party scripts are blocked; it limits the damage when an XSS bug slips through. **Not escapes input:** CSP never touches your data. **Not fixes the bug:** the injection is still there, CSP just stops it executing. **Not stops CSRF:** CSRF needs no script on your page at all.",
    },
    {
      kind: 'code',
      id: 'sec-c1',
      title: 'escapeHtml',
      difficulty: 'easy',
      prompt:
        'Write `escapeHtml(text)` so the result is safe to put inside HTML or a quoted attribute. Replace `&` `<` `>` `"` `\'` with `&amp;` `&lt;` `&gt;` `&quot;` `&#39;`. Make sure nothing gets escaped twice.',
      ...code('escape-html'),
    },
  ],
};
