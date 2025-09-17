// Use the existing global logger
const logger = window.logger;

// Format project type for display
const formatProjectType = (type) => {
    switch (type) {
        case 'new-construction':
            return 'New Construction';
        case 'renovation-addition':
            return 'Renovation + Addition';
        default:
            return type;
    }
};

// Global event listener manager instance
const eventManager = new EventListenerManager();

// ===== HOMEPAGE SLIDESHOW - CONSOLIDATED & CORRECTED =====
let slideshowContainer;
let dotsContainer;
let currentSlide = 0;
let slides = [];
let slideInterval;
let isSwiping = false;

// Make these functions globally accessible
window.showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[index]) {
        slides[index].classList.add('active');
    }

    const dots = document.querySelectorAll('.slideshow-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
        dots[index].classList.add('active');
    }
};

window.nextSlide = () => {
    if (slides.length > 0) {
        currentSlide = (currentSlide + 1) % slides.length;
        window.showSlide(currentSlide);
    }
};

window.previousSlide = () => {
    if (slides.length > 0) {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        window.showSlide(currentSlide);
    }
};

const startAutoSlide = () => {
    // Clear any existing interval to prevent duplicates
    clearInterval(slideInterval);
    slideInterval = setInterval(window.nextSlide, 5000);
};

const stopAutoSlide = () => {
    clearInterval(slideInterval);
};

// Load slideshow images - simplified for clarity
const getDefaultImages = () => {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? [
        'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
        'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
        'images/HeroProjects/hero-19.jpg'
    ] : [
        'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
        'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
        'images/Portfolio/Renovation+Addition/myers-park-renovation/2.jpg',
        'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
        'images/HeroProjects/hero-19.jpg',
        'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg'
    ];
};

const initializeSlideshow = async () => {
    if (!slideshowContainer) {
        logger.error('Slideshow container not found, cannot initialize.');
        return;
    }
    const images = getDefaultImages();
    slideshowContainer.innerHTML = '';

    images.forEach((imageSrc, index) => {
        const slideItem = document.createElement('div');
        slideItem.className = 'slide-item';
        if (index === 0) {
            slideItem.classList.add('active');
        }

        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        imgElement.alt = `Hero slide ${index + 1}`;
        imgElement.className = 'slide-image';
        imgElement.loading = 'lazy';
        imgElement.decoding = 'async';
        
        slideItem.appendChild(imgElement);
        slideshowContainer.appendChild(slideItem);
    });

    slides = document.querySelectorAll('.slide-item');

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slideshow-dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentSlide = index;
                window.showSlide(currentSlide);
                stopAutoSlide(); // Stop auto-advance on manual interaction
                startAutoSlide(); // Restart after a delay
            });
            dotsContainer.appendChild(dot);
        });
    }

    currentSlide = 0;
    window.showSlide(currentSlide);
    startAutoSlide();
};

// ===== MOBILE SWIPE FUNCTIONALITY =====
const initializeSwipe = () => {
    if (!slideshowContainer) return;

    let touchStartX = 0;
    const swipeThreshold = 50;

    slideshowContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide(); // Stop auto-advance while swiping
    }, { passive: true });

    slideshowContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swiped left
                window.nextSlide();
            } else {
                // Swiped right
                window.previousSlide();
            }
        }
        startAutoSlide(); // Restart auto-advance after swipe ends
    });
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slideshow containers after DOM is ready
    slideshowContainer = document.querySelector('.hero-slideshow');
    dotsContainer = document.querySelector('.slideshow-dots');
    
    // Initialize slideshow and swipe functionality
    initializeSlideshow();
    initializeSwipe();
});
