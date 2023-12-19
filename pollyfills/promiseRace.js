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

//it will return the fastest promise whether its success or failure
