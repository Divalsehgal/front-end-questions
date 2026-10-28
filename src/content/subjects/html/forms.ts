import { uiFiles } from '../../files';
import type { Topic } from '../../types';

const ui = uiFiles('html', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const formsTopic: Topic = {
  slug: 'forms',
  title: 'Forms & validation',
  questions: [
    {
      kind: 'quiz',
      id: 'form-q1',
      title: 'Associating labels',
      prompt: 'Which give the input a reliable accessible name?',
      options: [
        '`<label for="email">Email</label><input id="email">`',
        '`<label>Email <input></label>`',
        '`<span>Email</span><input placeholder="Email">`',
        '`<input aria-label="Email">`',
      ],
      answer: [0, 1, 3],
      why: "`for`/`id` and wrapping the input in `<label>` both create a real label association (announced as the name, and clicking the text focuses the input); `aria-label` also sets the accessible name, just with no visible label. **Not span + placeholder:** a span isn't associated with anything, and a placeholder isn't a reliable label: it disappears while typing and often has poor contrast.",
    },
    {
      kind: 'quiz',
      id: 'form-q2',
      title: 'Grouping radio buttons',
      prompt: 'How should a group of radio buttons ("Account type: Personal / Business") be marked up?',
      options: [
        '`<fieldset>` with a `<legend>`, each radio inside its own `<label>`',
        'A `<div>` with a heading',
        'A `<select>`',
        '`<ul>` with `role="radiogroup"` and no labels',
      ],
      answer: 0,
      why: "`<fieldset>` + `<legend>` gives the group a name announced when focus enters ('Account type, Personal, radio button 1 of 2'), and each radio needs its own `<label>`; sharing a `name` gives native arrow-key navigation. **Not a div with a heading:** the heading isn't associated with the group. **Not a select:** a different control, not markup for radios. **Not ul role=radiogroup with no labels:** the role names nothing and the radios have no accessible names.",
    },
    {
      kind: 'quiz',
      id: 'form-q3',
      title: 'Native validation',
      prompt: "Which are part of the browser's built-in constraint validation?",
      options: [
        '`required`, `minlength`, `pattern`, `type="email"`',
        'The `:invalid` / `:user-invalid` CSS pseudo-classes for styling',
        '`form.checkValidity()` and `input.validity`',
        '`<input validate="true">`',
      ],
      answer: [0, 1, 2],
      why: 'Constraint validation is native: attributes like `required`, `minlength`, `pattern`, `type="email"`; CSS hooks `:invalid` and `:user-invalid` (only after interaction, so no red fields on load); and the JS API `checkValidity()`, `validity`, `setCustomValidity()`. **Not validate=true:** no such attribute exists (the opposite, `novalidate`, does). Always validate again on the server.',
    },
    {
      kind: 'quiz',
      id: 'form-q4',
      title: 'Select placeholder',
      prompt: 'How do you show "(select one)" in a required `<select>` that can\'t be submitted as a choice?',
      options: [
        '`<option value="" disabled selected hidden>(select one)</option>` as the first option',
        '`<select placeholder="(select one)">`',
        'A label positioned over the select',
        '`<option>(select one)</option>` with value "none"',
      ],
      answer: 0,
      why: 'An option with `value=""` makes `required` fail until the user picks a real choice, `selected` shows it initially, and `disabled` + `hidden` stop it being chosen again. **Not a placeholder attribute:** `<select>` doesn\'t support one. **Not a label over the select:** fragile visually and doesn\'t affect validation. **Not value=none:** a non-empty value satisfies `required`, so \'(select one)\' could be submitted. In React drive it with a controlled `value=""`.',
    },
    {
      kind: 'ui',
      id: 'semantic-form',
      title: 'Fix an inaccessible signup form',
      difficulty: 'easy',
      framework: 'vanilla',
      prompt:
        'The starter form "looks" fine but uses spans instead of labels, text inputs for everything, a div as a button and no validation. Rebuild it properly.',
      requirements: [
        'Every input has a real, clickable label',
        'Email uses `type="email"`, the password uses `type="password"` with `minlength="8"`, and both have the right `autocomplete`',
        'The radio group is a `fieldset` with a `legend`',
        'Submitting is a real `<button type="submit">` inside a `<form>` (Enter key works)',
        'The password hint and error are linked with `aria-describedby`; errors are announced',
        'On invalid submit, focus moves to the first invalid field',
      ],
      ...ui('semantic-form'),
    },
  ],
};
