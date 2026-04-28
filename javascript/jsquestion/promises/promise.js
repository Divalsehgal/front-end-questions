// Promise class 6 methods

// .all()  takes array of promses and returns a promise if any error then other promise ignore
// .settled()
// .any()
// .race()
// .resolve()
// .reject()

async function asyncDemo() {
  let a, b, c;

  let promise = new Promise((res, rej) => {
    a = setTimeout(() => res("hi"));
    b = setTimeout(() => res("hello"));
    c = res(3);
  });

  clearTimeout(b);
  clearTimeout(a);

  let res = await promise;
  console.log("result", res);
}

asyncDemo();

//Promise for just checking whether two strings are eqaul or not

const promise= new Promise((res,rej)=>{
const a ="String";
const b ="string";
if(a==b){
res()
}else{
rej()
}
})

promise.then(()=>console.log('string are equal')).catch(()=>console.log('string are not equal'))

// Promise class is simple
// consists of two .then .catch constructor function

// and resolve , reject function for execution

// following states

// fulfilled
// pending
// reject
// value
// is Called
// is Fulfilled
// is Rejected

function myPromise(executor) {
  let onResolve,
    onReject,
    value,
    isCalled = false,
    error,
    isFulfilled = false,
    isRejected = false;

  this.then = function (thenHandler) {
    onResolve = thenHandler;
    if (!isCalled && isFulfilled === true) {
      onResolve(value);
      isCalled = true;
    }

    return this;
  };

  this.catch = function (catchHandler) {
    onReject = catchHandler;

    if (!isCalled && isRejected === true) {
      onReject(error);
      isCalled = true;
    }

    return this;
  };

  function resolve(val) {
    value = val;
    isFulfilled = true;
    if (typeof onResolve === "Function" && !isCalled) {
      onResolve(value);
      isCalled = true;
    }
  }

  function reject(err) {
    error = err;
    isRejected = true;
    if (typeof onReject === "Function" && !isCalled) {
      onReject(error);
      isCalled = true;
    }
  }

  executor(resolve, reject);
};

const pro=new myPromise((res,rej)=>{
//res(3)
rej("bye")
})

pro.then((r)=>console.log(r)).catch((e)=>console.log(e))
