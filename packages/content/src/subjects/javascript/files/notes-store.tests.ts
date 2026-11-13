import { NotesStore } from './solution';

test('stores and filters notes by state, in order', () => {
  const ns = new NotesStore();
  ns.addNote('active', 'clean clothes');
  ns.addNote('active', 'go to market');
  ns.addNote('completed', 'pick up key');
  ns.addNote('active', 'call minal');
  assert.deepEqual(ns.getNotes('active'), ['clean clothes', 'go to market', 'call minal']);
  assert.deepEqual(ns.getNotes('completed'), ['pick up key']);
  assert.deepEqual(ns.getNotes('others'), []);
});

test('rejects empty names', () => {
  const ns = new NotesStore();
  let msg = '';
  try {
    ns.addNote('active', '');
  } catch (e) {
    msg = (e as Error).message;
  }
  assert.equal(msg, 'Name cannot be empty');
});

test('rejects unknown states on add and get', () => {
  const ns = new NotesStore();
  for (const call of [() => ns.addNote('done' as any, 'x'), () => ns.getNotes('done' as any)]) {
    let msg = '';
    try {
      call();
    } catch (e) {
      msg = (e as Error).message;
    }
    assert.equal(msg, 'Invalid state done');
  }
});

test('stores are independent', () => {
  const a = new NotesStore();
  const b = new NotesStore();
  a.addNote('active', 'x');
  assert.deepEqual(b.getNotes('active'), []);
});
