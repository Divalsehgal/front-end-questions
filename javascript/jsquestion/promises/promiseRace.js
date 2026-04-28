

// Promise.race: Returns the first promise to settle (either fulfill or reject). 
// Unlike Promise.any, it doesn't wait for a success; it takes the very first outcome.

export default function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    if (iterable.length === 0) return;
    for (let i = 0; i < iterable.length; i++) {
      Promise.resolve(iterable[i]).then(resolve, reject);
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

 Promise.race([p1, p2, p3])
   .then((r) => console.log(r))
   .catch((err) => console.log("err",err));



// const firstPromise = new Promise((res, rej) => {
//   setTimeout(res, 500, 'one');
// });

// const secondPromise = new Promise((res, rej) => {
//   setTimeout(res, 100, 'two');
// });

// Promise.race([firstPromise, secondPromise]).then(res => console.log(res));


//it will return the fastest promise whether its success or failure
