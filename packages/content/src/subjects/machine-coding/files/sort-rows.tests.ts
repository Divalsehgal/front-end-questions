import { sortRows } from './solution';

const col = (rows: Record<string, unknown>[], key: string) => rows.map((r) => r[key]);

test('numbers sort numerically, both directions', () => {
  const rows = [{ n: 10 }, { n: 9 }, { n: 100 }, { n: -1 }];
  assert.deepEqual(col(sortRows(rows, 'n'), 'n'), [-1, 9, 10, 100]);
  assert.deepEqual(col(sortRows(rows, 'n', 'desc'), 'n'), [100, 10, 9, -1]);
});

test('numeric strings sort as numbers ("9" before "10")', () => {
  const rows = [{ qty: '100' }, { qty: '9' }, { qty: '10.5' }];
  assert.deepEqual(col(sortRows(rows, 'qty'), 'qty'), ['9', '10.5', '100']);
});

test('ISO date strings sort chronologically, respecting time zone offsets', () => {
  const rows = [{ at: '2024-01-01T06:00:00Z' }, { at: '2024-01-01T10:00:00+05:00' }, { at: '2023-12-31' }];
  assert.deepEqual(col(sortRows(rows, 'at'), 'at'), ['2023-12-31', '2024-01-01T10:00:00+05:00', '2024-01-01T06:00:00Z']);
});

test('Date objects sort by time', () => {
  const a = new Date('2024-05-01');
  const b = new Date('2023-05-01');
  assert.deepEqual(col(sortRows([{ d: a }, { d: b }], 'd'), 'd'), [b, a]);
});

test('strings use a case-insensitive, locale-aware comparison', () => {
  const rows = [{ s: 'banana' }, { s: 'Cherry' }, { s: 'apple' }, { s: 'Éclair' }];
  assert.deepEqual(col(sortRows(rows, 's'), 's'), ['apple', 'banana', 'Cherry', 'Éclair']);
});

test('null and undefined always go last, in either direction', () => {
  const rows = [{ v: null }, { v: 2 }, { v: undefined }, { v: 1 }];
  assert.deepEqual(col(sortRows(rows, 'v'), 'v').slice(0, 2), [1, 2]);
  assert.deepEqual(col(sortRows(rows, 'v', 'desc'), 'v').slice(0, 2), [2, 1]);
  assert.deepEqual(col(sortRows(rows, 'v', 'desc'), 'v').slice(2), [null, undefined]);
});

test('stable: ties keep their input order, ascending and descending', () => {
  const rows = [
    { id: 'a', g: 1 },
    { id: 'b', g: 0 },
    { id: 'c', g: 1 },
    { id: 'd', g: 0 },
  ];
  assert.deepEqual(col(sortRows(rows, 'g'), 'id'), ['b', 'd', 'a', 'c']);
  assert.deepEqual(col(sortRows(rows, 'g', 'desc'), 'id'), ['a', 'c', 'b', 'd']);
});

test('returns a new array and does not mutate the input', () => {
  const rows = [{ n: 2 }, { n: 1 }];
  const out = sortRows(rows, 'n');
  assert.ok(out !== rows, 'expected a new array');
  assert.deepEqual(col(rows, 'n'), [2, 1]);
});
