import type { Topic } from '../../types';

export const authTopic: Topic = {
  slug: 'auth',
  title: 'Authentication & authorization',
  questions: [
    {
      kind: 'quiz',
      id: 'sec-q4',
      title: 'Where to keep tokens',
      prompt: 'Which setup is the recommended one for a single-page app?',
      options: [
        'Short-lived access token in memory, refresh token in an `HttpOnly; Secure; SameSite` cookie',
        'Both tokens in localStorage',
        'Access token in localStorage, refresh token in memory',
        'One long-lived token in a normal cookie that JavaScript can read',
      ],
      answer: 0,
      why: "A short-lived access token in memory is gone on reload and useless within minutes, and an `HttpOnly; Secure; SameSite` refresh cookie can't be read by JavaScript at all, so an XSS payload can't exfiltrate either long-term. **Not both in localStorage:** any script, including XSS, can read localStorage. **Not access in localStorage, refresh in memory:** exposes one token and loses the other on reload, the worst of both. **Not a long-lived JS-readable cookie:** readable by XSS and valid for a long time.",
    },
    {
      kind: 'quiz',
      id: 'sec-q5',
      title: 'Does memory storage stop XSS?',
      prompt: 'Your access token lives only in React state. An attacker finds an XSS bug. What can they still do?',
      options: [
        'Send requests as the user from inside the page while it is open',
        'Read the HttpOnly refresh cookie',
        'Nothing, because the token is not in storage',
        'Keep using the stolen access token for months',
      ],
      answer: 0,
      why: "Memory storage only stops the token from being persisted or easily exfiltrated; script running on your page can still call your API as the user while the tab is open. **Not read the HttpOnly cookie:** HttpOnly blocks all JS access. **Not nothing:** XSS still runs with the user's session in the page. **Not use it for months:** the access token expires in minutes. Preventing XSS is what matters; short lifetimes limit the damage.",
    },
    {
      kind: 'quiz',
      id: 'sec-q6',
      title: 'Spot the IDOR',
      prompt: 'A logged-in user calls `GET /api/orders/124`, but order 124 belongs to someone else. Which handler is safe?',
      options: [
        '`const order = await db.getOrder(req.params.id); if (order.userId !== req.user.id) return res.status(403).end();`',
        '`const order = await db.getOrder(req.params.id); res.json(order);` (the UI only shows your own orders)',
        '`if (req.body.userId !== order.userId) return res.status(403).end();`',
        'Hide the order id from the URL and use a POST instead',
      ],
      answer: 0,
      why: "Only the first handler compares the record's owner with `req.user.id`, the identity from the verified session or token, which the attacker can't forge. **Not returning the order because the UI hides others:** anyone can call the API directly with any id. **Not comparing to req.body.userId:** the attacker controls the body and can put the victim's id in it. **Not hiding the id or using POST:** obscurity and HTTP method aren't access control.",
    },
    {
      kind: 'flashcard',
      id: 'sec-f2',
      title: 'Authentication vs authorization',
      front: 'What is the difference between authentication and authorization, and which one does IDOR break?',
      back: `- **Authentication**: who are you? (login, tokens, sessions)
- **Authorization**: what are you allowed to do? (ownership and role checks)

IDOR is an **authorization** bug. The user is logged in correctly, but the server trusts an id from the request (\`/user/124\`) without checking that it belongs to them. The fix goes on every API endpoint, not in the UI.`,
    },
  ],
};
