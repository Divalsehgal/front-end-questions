export default function promiseAny(iterable) {
  const temp = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) return reject(new AggregateError([], 'All promises were rejected'));
    for (let i = 0; i < iterable.length; i++) {
      Promise.resolve(iterable[i])
        .then((res) => resolve(res))
        .catch((error) => {
          temp[i] = error;
          count++;
          if (count === iterable.length) {
            reject(new AggregateError(temp, 'All promises were rejected'));
          }
        });
    }
  });
}


const p1 = new Promise((res, rej) => {
  setTimeout(() => rej("hi i am resolved"), 3000);
});
const p2 = new Promise((res, rej) => {
  setTimeout(() => rej("hi this side dival"), 2000);
});
const p3 = new Promise((res, rej) => {
  setTimeout(() => rej("hi i am the fast"), 1000);
});

Promise.any([p1, p2, p3]).then((r) => console.log(r)).catch((err) => console.log(err))

// if all fails return aggregate error in array
// otherwise return the first return promise success
