// Use the existing global logger - CACHE BUST v2
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

// Global event listener manager instance (removed - not needed)

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
        'images/Portfolio/Renovation+Addition/myers-park-renovation/2.jpg',
        'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
        'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
        'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
        'images/HeroProjects/hero-19.jpg'
    ] : [
        'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
        'images/Portfolio/Renovation+Addition/myers-park-renovation/2.jpg',
        'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
        'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
        'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
        'images/Portfolio/New Construction/french-country/french-country-hero-.jpg',
        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
        'images/Portfolio/New Construction/melchor-residence/melchor-residence-hero-.jpg',
        'images/HeroProjects/hero-19.jpg',
        'images/HeroProjects/hero-20-.jpg',
        'images/HeroProjects/hero-21.JPG',
        'images/HeroProjects/hero-22-.jpg'
    ];
  };

  const initializeSlideshow = async () => {
    console.log('🎬 Initializing slideshow...');
    console.log('🎬 Container exists:', !!slideshowContainer);
    
    if (!slideshowContainer) {
        console.error('❌ Slideshow container not found, cannot initialize.');
        logger.error('Slideshow container not found, cannot initialize.');
        return;
    }
    
    const images = getDefaultImages();
    console.log('🎬 Images to load:', images);
    
    slideshowContainer.innerHTML = '';

    images.forEach((imageSrc, index) => {
        console.log(`🎬 Creating slide ${index + 1}: ${imageSrc}`);
        
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
        
        console.log(`🎬 Slide ${index + 1} created and added to container`);
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
    
    console.log('🎬 Slideshow initialization complete!');
    console.log('🎬 Total slides created:', slides.length);
    console.log('🎬 Current slide:', currentSlide);
    console.log('🎬 Auto-slide started:', !!slideInterval);
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
    console.log('🏠 DOM is ready, initializing homepage...');
    
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu && mobileMenuBtn) {
        // Function to update button icon
        function updateButtonIcon(isOpen) {
            if (isOpen) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }

        // Function to toggle menu
        function toggleMenu() {
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                mobileMenu.classList.remove('active');
                updateButtonIcon(false);
            } else {
                mobileMenu.classList.add('active');
                updateButtonIcon(true);
            }
        }

        // Add click event to hamburger button
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking on menu links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                updateButtonIcon(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    updateButtonIcon(false);
                }
            }
        });
        
        console.log('📱 Mobile menu initialized');
    }
    
    // Initialize slideshow containers after DOM is ready
    slideshowContainer = document.querySelector('.hero-slideshow');
    dotsContainer = document.querySelector('.slideshow-dots');
    
    console.log('📋 Slideshow container found:', !!slideshowContainer);
    console.log('📋 Dots container found:', !!dotsContainer);
    
    if (slideshowContainer) {
        console.log('📋 Container HTML before init:', slideshowContainer.innerHTML);
    }
    
    // Initialize slideshow and swipe functionality
    initializeSlideshow();
    initializeSwipe();
    
    if (slideshowContainer) {
        console.log('📋 Container HTML after init:', slideshowContainer.innerHTML);
    }
});
