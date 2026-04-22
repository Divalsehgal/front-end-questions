



// Promise.allSettled: Waits for every promise to settle (either fulfilled or rejected).
// It returns an array of objects describing the state and value/reason of each promise.

/**
 * @param {Array} iterable
 * @return {Promise<Array<{status: 'fulfilled', value: *}|{status: 'rejected', reason: *}>>}
 */
export default function promiseAllSettled(iterable) {
  let count = 0,
    temp = [];
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) {
      resolve([]);
      return;
    }
    for (let i = 0; i < iterable.length; i++) {
      Promise.resolve(iterable[i])
        .then((res) => {
          temp[i] = { status: "fulfilled", value: res };
        })
        .catch((error) => {
          temp[i] = { status: "rejected", reason: error };
        })
        .finally(() => {
          count++
          if (count === iterable.length) {
            resolve(temp);
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

Promise.allSettled([p1, p2, p3]).then((r) => console.log(r))

//it will return the result array will all the states of the promises
