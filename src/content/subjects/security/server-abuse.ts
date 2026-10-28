import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('security', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const serverAbuse: Topic = {
  slug: 'server-abuse',
  title: 'SSRF & abuse',
  questions: [
    {
      kind: 'quiz',
      id: 'sec-q10',
      title: 'Why SSRF is dangerous',
      prompt: 'Your server runs `await fetch(req.body.url)` to preview links. Why is that dangerous?',
      options: [
        'The server can reach internal services (databases, `169.254.169.254` cloud metadata) that the attacker cannot reach directly',
        'It makes the page load slower',
        "The attacker can read your users' cookies",
        'It only matters if the server runs on Windows',
      ],
      answer: 0,
      why: "With SSRF your server becomes the attacker's proxy inside your network: it can reach internal services and the cloud metadata endpoint (`169.254.169.254`), which can hand out credentials. **Not slower page loads:** a performance concern, not a vulnerability. **Not users' cookies:** a server-side fetch doesn't carry browsers' cookies. **Not Windows-only:** it is OS-independent. Fix with a host allowlist and by blocking private ranges and localhost (after DNS resolution).",
    },
    {
      kind: 'code',
      id: 'sec-c2',
      title: 'isSafeUrl (SSRF allowlist)',
      difficulty: 'easy',
      prompt:
        'Write `isSafeUrl(input)` for a server that fetches URLs from users. Return true only for valid `https:` URLs whose host is exactly one of `ALLOWED_HOSTS`. Look-alikes such as `api.stripe.com.evil.com` must fail. Hint: parse with `new URL()` instead of checking the string.',
      ...code('safe-fetch-url'),
    },
    {
      kind: 'quiz',
      id: 'sec-q11',
      title: 'Where to rate limit',
      prompt: 'You have one general rate limit of 100 requests per 15 minutes. Which endpoints need a stricter limit?',
      options: ['Login', 'Password reset', 'Token refresh', 'Fetching the public blog list'],
      answer: [0, 1, 2],
      why: 'Login, password reset and token refresh all verify secrets, so they are the targets of brute force and credential stuffing and deserve much tighter limits (respond `429 Too Many Requests` and log failures). **Not the public blog list:** read-only public data with no secret to guess; the general limit is enough.',
    },
    {
      kind: 'flashcard',
      id: 'sec-f4',
      title: 'The XSS chain',
      front: 'Why do people say XSS is the most important browser vulnerability to prevent?',
      back: `Once an attacker runs JavaScript on your origin, they:

1. act as the user (call your API with their session)
2. get past client-side checks (hidden buttons, frontend role checks)
3. read anything the page can read (DOM, localStorage, tokens in memory)

HttpOnly cookies and short-lived tokens only **limit** the damage. They do not stop it. So you prevent XSS first, and use CSP as the backup layer.`,
    },
  ],
};
