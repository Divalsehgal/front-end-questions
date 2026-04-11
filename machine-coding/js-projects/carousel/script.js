const carousel = document.querySelector('#carousel');
const viewport = document.querySelector('.carousel-viewport');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const visibleSlidesInput = document.querySelector('#visible-slides');

const imageCount = 10;
let currentIndex = 0;
let visibleSlides = 1;

// Initialize images
for (let i = 1; i <= imageCount; i++) {
    const img = document.createElement('img');
    const url = `https://en.js.cx/carousel/${i}.png`;
    img.setAttribute('src', url);
    carousel.appendChild(img);
}

// Logic to update position
function updateCarousel() {
    const imgElement = carousel.querySelector('img');
    if (!imgElement) return;

    // Calculate the width of one image including the gap (10px)
    const imageWidth = imgElement.clientWidth;
    const gap = 10;

    const offset = currentIndex * (imageWidth + gap);
    carousel.style.transform = `translateX(-${offset}px)`;
}

// Update configuration
function updateConfig() {
    visibleSlides = parseInt(visibleSlidesInput.value) || 1;
    viewport.style.setProperty('--slides-showing', visibleSlides);
    
    // reset index if it's now out of bounds
    const maxIndex = Math.max(0, imageCount - visibleSlides);
    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    
    updateCarousel();
}

// Event Listeners
visibleSlidesInput.addEventListener('input', updateConfig);

nextBtn.addEventListener('click', () => {
    const maxIndex = Math.max(0, imageCount - visibleSlides);
    if (currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back
    }
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = Math.max(0, imageCount - visibleSlides); // Loop to end
    }
    updateCarousel();
});

// Sync initial config
updateConfig();

// Window resize or image load can affect clientWidth
window.addEventListener('load', updateCarousel);
window.addEventListener('resize', updateCarousel);
