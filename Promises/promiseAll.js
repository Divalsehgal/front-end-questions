const p1 = new Promise((res, rej) => {
  setTimeout(() => res("hi i am resolved"), 3000);
});
const p2 = new Promise((res, rej) => {
  setTimeout(() => res("hi this side dival"), 2000);
});
const p3 = new Promise((res, rej) => {
  setTimeout(() => rej("hi i am the fast"), 1000);
});

Promise.all([p1, p2, p3])
  .then((r) => console.log(r))
  .catch((e) => console.log(e));

//wait for all to complete in case of all successes and will return result array in  then block.
//if any one get failed will reject the promise and returns error promise in catch block .
