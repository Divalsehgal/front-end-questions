import type { Question } from '../../../types';

export const promiseOutputQuestions: Question[] = [
  {
    kind: 'output',
    id: 'el-1',
    title: 'sync vs microtask vs macrotask',
    code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve()
  .then(() => {
    console.log(3);
    setTimeout(() => console.log(4), 0);
  })
  .then(() => console.log(5));
queueMicrotask(() => console.log(6));
(async () => {
  console.log(7);
  await null;
  console.log(8);
})();
console.log(9);`,
    why: "All sync logs first (1 7 9). Microtasks run in queue order: 3, 6, 8; 5 is queued only when 3's callback returns. Then timers: 2, then 4 (queued during a microtask, so after 2).",
  },
  {
    kind: 'output',
    id: 'el-2',
    title: 'where does an async function pause?',
    code: `async function a() {
  console.log(1);
  await b();
  console.log(2);
}
async function b() {
  console.log(3);
}
console.log(4);
a();
console.log(5);`,
    why: 'An async function runs synchronously until its first await. b() logs 3 synchronously; the code after `await` resumes as a microtask, after the sync log 5.',
  },
  {
    kind: 'output',
    id: 'el-3',
    title: 'promise executor runs sync; settles once',
    code: `const p = new Promise((resolve, reject) => {
  console.log('a');
  resolve(1);
  console.log('b');
  reject(2);
  resolve(3);
});
p.then((v) => console.log('then', v)).catch((e) => console.log('catch', e));
console.log('c');`,
    why: 'The executor runs synchronously. A promise settles exactly once; later resolve/reject calls are ignored. .then callbacks are always async, so "c" comes before "then 1".',
  },
  {
    kind: 'output',
    id: 'el-4',
    title: 'what flows through finally?',
    code: `Promise.resolve(1)
  .then((v) => {
    console.log(v);
    return v * 2;
  })
  .finally(() => {
    console.log('finally');
    return 99;
  })
  .then((v) => console.log(v))
  .then((v) => console.log(v));`,
    why: 'finally receives no value and its return value is ignored (unless it throws or returns a rejected promise), so 2 passes through. The last .then gets undefined because the previous one returned nothing.',
  },
  {
    kind: 'output',
    id: 'el-5',
    title: 'catch, rethrow, recover',
    code: `Promise.reject(new Error('x'))
  .then(() => console.log('t1'))
  .catch((e) => {
    console.log('c1', e.message);
    throw new Error('y');
  })
  .then(() => console.log('t2'))
  .catch((e) => console.log('c2', e.message))
  .then(() => console.log('t3'));`,
    why: '.then without a rejection handler is skipped while the chain is rejected. A catch that throws makes the chain rejected again; a catch that returns normally recovers it, so t3 runs.',
  },
  {
    kind: 'output',
    id: 'el-6',
    title: 'two chains interleave',
    code: `Promise.resolve()
  .then(() => console.log('a1'))
  .then(() => console.log('a2'));
Promise.resolve()
  .then(() => console.log('b1'))
  .then(() => console.log('b2'));`,
    why: 'Each .then is queued only when the previous step settles, so the two chains take turns: a1 b1 a2 b2.',
  },
];
