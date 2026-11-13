import { replacePlaceholders } from './solution';

const template = { title: 'Hello {{name}}', info: { age: '{{age}}', hobbies: ['{{hobby1}}', '{{ hobby2 }}'] }, count: 3 };
const data = { name: 'John', age: '30', hobby1: 'Coding', hobby2: 'Cycling' };

test('replaces deeply through objects and arrays', () => {
  assert.deepEqual(replacePlaceholders(template, data), {
    title: 'Hello John',
    info: { age: '30', hobbies: ['Coding', 'Cycling'] },
    count: 3,
  });
});

test('missing keys become empty strings; several per string work', () => {
  assert.equal(replacePlaceholders('{{a}}-{{missing}}-{{a}}', { a: 'x' }), 'x--x');
});

test('does not mutate the template', () => {
  const copy = JSON.parse(JSON.stringify(template));
  replacePlaceholders(template, data);
  assert.deepEqual(template, copy);
});
