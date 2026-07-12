let response=''
let finalresponse=''


// document.querySelector('form').addEventListener('submit',function(){
//     e.preventDefault()
//     alert(finalresponse)
// })

document.querySelector('.email').addEventListener('input',(e)=>{
    response=e.target.value
    console.log(response)
})


document.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault()
    finalresponse = response
    alert(finalresponse)
})

console.log(finalresponse)