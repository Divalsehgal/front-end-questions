import { myApply, myBind, myCall } from './solution';

function describe(this: { name: string } | undefined, greeting: string, punct: string) {
  return `${greeting} ${this?.name}${punct}`;
}

test('myCall sets this and passes args', () => {
  assert.equal(myCall(describe, { name: 'Ann' }, 'Hi', '!'), 'Hi Ann!');
});

test('myCall leaves no extra property on the target', () => {
  const target = { name: 'Ann' };
  assert.equal(myCall(describe, target, 'Hi', '.'), 'Hi Ann.');
  assert.deepEqual(Reflect.ownKeys(target), ['name']);
});

test('myApply takes an array, or no array', () => {
  assert.equal(myApply(describe, { name: 'Bo' }, ['Yo', '?']), 'Yo Bo?');
  assert.equal(myApply(function (this: { n: number }) { return this.n; }, { n: 7 }), 7);
});

test('undefined thisArg gives undefined this', () => {
  assert.equal(myCall(function (this: unknown) { return this === undefined ? 'none' : 'some'; }, undefined), 'none');
});

test('myBind presets args and cannot be re-bound', () => {
  const hi = myBind(describe, { name: 'Cy' }, 'Hello');
  assert.equal(hi('!'), 'Hello Cy!');
  assert.equal(hi.call({ name: 'Other' }, '?'), 'Hello Cy?');
});

test('new on a myBind-ed constructor ignores thisArg', () => {
  function Point(this: any, x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  const ignored = { x: 'nope' };
  const AtX1 = myBind(Point, ignored, 1);
  const p = new AtX1(2);
  assert.deepEqual({ x: p.x, y: p.y }, { x: 1, y: 2 });
  assert.ok(p instanceof Point, 'instance should be instanceof the original function');
  assert.equal(ignored.x, 'nope');
});
