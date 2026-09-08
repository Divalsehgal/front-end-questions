
const parent = document.querySelector('.root');


let btn;

let progress;
let inner;
let count = 5;
let vw = 0;
let temp=[]
//
function startProgressBar() {
    
    inner.style.width = `${0}%`
    const interval = setInterval(() => {
        if (count === 0) {
            clearInterval(interval);
            return;
        }
        count--;
        vw = 20 + vw
        inner.style.width = `${vw}%`
    }, 1000)
}



function createProgressBar() {
    inner = document.createElement('div')
    inner.classList.add('inner')
    progress = document.createElement('div')
    progress.classList.add('progress');
    progress.appendChild(inner)
}

function createButtton() {
    btn = document.createElement('button');
    btn.textContent = `start`
    btn.addEventListener('click', startProgressBar)
}



createProgressBar()
createButtton()

parent.append(progress)
parent.append(btn)