/**
 * @param {Array} iterable
 * @return {Promise<Array>}
 */

// Promise.all: Waits for all promises to fulfill and returns an array of results. 
// If any promise rejects, it rejects immediately with that error (fail-fast).

export default function promiseAll(iterable) {
  const temp = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) resolve([]);
    for (let i = 0; i < iterable.length; i++) {
      Promise.resolve(iterable[i])
        .then((res) => {
          temp[i] = res;
          count++;
          if (count === iterable.length) {
            resolve(temp);
          }
        })
        .catch((error) => reject(error));
    }
  });
}


const p1 = new Promise((res, rej) => {
  setTimeout(() => res("hi i am resolved"), 3000);
});
const p2 = new Promise((res, rej) => {
  setTimeout(() => res("hi this side dival"), 2000);
});
const p3 = new Promise((res, rej) => {
  setTimeout(() => res("hi i am the fast"), 1000);
});

Promise.all([p1, p2, p3])
  .then((r) => console.log(r))
  .catch((e) => console.log(e));



promiseAll([p1, p2, p3])
  .then((r) => console.log(r))
  .catch((e) => console.log(e));

//wait for all to complete in case of all successes and will return result array in  then block.
//if any one get failed will reject the promise and returns error promise in catch block .
