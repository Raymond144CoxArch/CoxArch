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
        'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
        'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
        'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
        'images/HeroProjects/hero-19.jpg'
    ];
  };

  const initializeSlideshow = async () => {
    if (!slideshowContainer) {
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
    }

    // Initialize slideshow containers after DOM is ready
    slideshowContainer = document.querySelector('.hero-slideshow');
    dotsContainer = document.querySelector('.slideshow-dots');
    
    // Initialize slideshow and swipe functionality
    initializeSlideshow();
    initializeSwipe();
    
    // Check if gallery modal is available and working
    setTimeout(() => {
        if (window.galleryModal) {
            console.log('✅ Gallery modal is available');
            
            // Set up project data for featured projects
            const projectData = {
                'williams-lake-house': {
          name: 'Lake House',
          type: 'New Construction',
          images: [
            'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
                        'images/Portfolio/New Construction/lake-house/lakehouse-1-.jpg',
                        'images/Portfolio/New Construction/lake-house/lakehouse-9-.jpg',
                        'images/Portfolio/New Construction/lake-house/lakehouse-18-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-19-.jpg',
                        'images/Portfolio/New Construction/lake-house/lakehouse-20-.jpg',
                        'images/Portfolio/New Construction/lake-house/lakehouse-21-.jpg',
                        'images/Portfolio/New Construction/lake-house/lakehouse-22-.jpg',
                        'images/Portfolio/New Construction/lake-house/lakehouse-23-.jpg',
                        'images/Portfolio/New Construction/lake-house/lakehouse-24-.jpg'
                    ]
                },
                'split-level-makeover': {
                    name: 'Split Level Makeover',
                    type: 'Renovation + Addition',
          images: [
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
                        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-1-.jpg',
                        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-2-.jpg',
                        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-3-.jpg',
                        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-4-.jpg',
                        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-5-.jpg',
                        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-6-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-7-.jpg',
                        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-8-.jpg',
                        'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-10-.jpg'
                    ]
                },
                'heavy-timber-pool-house': {
                    name: 'Heavy Timber Pool House',
                    type: 'Renovation + Addition',
          images: [
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/hero.png',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/heavy-timber_01.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0503.JPG',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0506.JPG',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0523.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0526.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0527.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0528.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0529.JPG',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0531.jpg'
                    ]
                }
            };
            
            window.galleryModal.setProjectsData(projectData);
            console.log('✅ Project data set for gallery modal');
            console.log('🏊 Heavy Timber Pool House hero image:', projectData['heavy-timber-pool-house'].images[0]);
  } else {
            console.warn('⚠️ Gallery modal not found - featured projects may not work');
        }
        
        // Test featured project click handlers
        const featuredProjects = document.querySelectorAll('.featured-project[data-project-id]');
        console.log(`📋 Found ${featuredProjects.length} featured projects with data-project-id`);
        
        featuredProjects.forEach((project, index) => {
            const projectId = project.getAttribute('data-project-id');
            console.log(`📋 Featured project ${index + 1}: ${projectId}`);
        });
    }, 1000);
});
