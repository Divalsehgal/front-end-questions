const box = document.getElementById('box');
const ball = document.getElementById('ball');

box.addEventListener('click', (event) => {
    // 1. Get the box's position on the screen
    // getBoundingClientRect provides (left, top, right, bottom, x, y, width, height) 
    // relative to the viewport.
    const rect = box.getBoundingClientRect();

    // 2. Calculate coordinates relative to the box
    // event.clientX is the click position from the viewport edge
    // rect.left is the box's distance from the viewport edge
    // Subtracting them gives you the exact position INSIDE the box
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // 3. Center the ball at the click point
    // We subtract half the ball's width/height to center it.
    const ballRadius = ball.offsetWidth / 2;
    
    x -= ballRadius;
    y -= ballRadius;

    // 4. Update the ball's position
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';

    console.log(`Clicked at Client(${event.clientX}, ${event.clientY}) | Relative to Box(${x.toFixed(0)}, ${y.toFixed(0)})`);
});
