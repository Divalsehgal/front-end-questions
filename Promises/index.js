function init() {
    function executor(resolve, reject) {
        resolve(10)
    }
    return new Promise(executor)
}

const i1 = init()
console.log(i1) // Pending , Fulfilled, Rejected
// initial Pending
//on Resolve state change to Fulfilled and then callback should start invoking  
// on Reject Rejected
// then exist on prototype chain of promise instance which i1 here 
// we can even queue call backs even after promie is resolved
i1.then((res) => {
    console.log(res)
})