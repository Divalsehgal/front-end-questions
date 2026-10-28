import { uiFiles } from '../../files';
import type { Topic } from '../../types';

const ui = uiFiles('machine-coding', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const formsTopic: Topic = {
  slug: 'forms',
  title: 'Forms (React)',
  questions: [
    {
      kind: 'ui',
      id: 'action-form',
      title: 'Form with useActionState',
      difficulty: 'easy',
      framework: 'react',
      prompt:
        'Build a name + email form using React 19\'s `<form action>` and `useActionState`, with a pending state while it "submits" (simulate 1s latency).',
      requirements: [
        'Uses `useActionState(submitAction, initialState)`; reads fields from `FormData`',
        'The submit button shows "Submitting…" and is disabled while pending',
        'After submit, the returned state is shown',
        'Inputs are uncontrolled (`name` + `defaultValue`)',
      ],
      ...ui('action-form'),
    },
    {
      kind: 'ui',
      id: 'form-validation',
      title: 'Signup form with validation',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'A signup form (username, email, password, confirm password) with real-time validation and a password strength meter.',
      requirements: [
        'Errors appear after a field is touched or on submit, not before',
        'Email is checked with a regex; passwords must match',
        'A password strength indicator updates as you type',
        'Submit is blocked while there are errors; success shows an "Account created" state',
        'Errors are linked to inputs (`aria-invalid`, `aria-describedby`)',
      ],
      ...ui('form-validation'),
    },
    {
      kind: 'ui',
      id: 'otp-input',
      title: 'OTP input',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'Build a 6-digit one-time-code input made of separate boxes.',
      requirements: [
        'State is an array of digits; only numbers are accepted',
        'Typing moves focus to the next box; Backspace on an empty box moves to the previous one',
        'Arrow keys move between boxes',
        'Pasting a full code fills every box',
        'Shows a complete/verified state when all digits are entered',
        '`inputMode="numeric"` and `autoComplete="one-time-code"` for mobile',
      ],
      ...ui('otp-input'),
    },
    {
      kind: 'ui',
      id: 'mention-box',
      title: '@mention box',
      difficulty: 'hard',
      framework: 'react',
      prompt: 'An input where typing a word that starts with `@` opens a list of matching users. Choosing one replaces the word with `@first_name`.',
      requirements: [
        'When the last word starts with `@`, show the users whose first or last name contains the text after it',
        'Clicking a user replaces the `@` word with `@first_name ` and puts focus back in the input',
        'The list closes on Escape, or when the last word no longer starts with `@`',
        'Bonus: support mentions in the middle of the text using `selectionStart`',
      ],
      ...ui('mention-box'),
    },
    {
      kind: 'ui',
      id: 'comment-reply-box',
      title: 'Posts, comments & replies',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'A small social feed: create posts, comment on posts, and reply to comments, showing relative timestamps.',
      requirements: [
        'New posts appear at the top',
        'Each post can collect comments; each comment can collect replies (nested immutable updates)',
        'Timestamps render relatively ("5m ago")',
        'Empty submissions are ignored',
        'Reply areas can be expanded and collapsed',
      ],
      ...ui('comment-reply-box'),
    },
  ],
};
