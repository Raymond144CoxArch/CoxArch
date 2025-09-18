// Homepage JavaScript - CACHE BUST v7
// Logger is available globally from logger.js

// Debug: Check if logger exists
console.log('Homepage.js loaded, logger available:', typeof window.logger);

// The logger object is available globally from logger.js
// Use window.logger directly in your code.

// Image loading error handler
document.addEventListener('DOMContentLoaded', function() {
    // Handle image loading errors gracefully
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('error', function(e) {
            console.warn('Image failed to load:', e.target.src);
            if (window.logger) {
                window.logger.warn('Image failed to load', { src: e.target.src, alt: e.target.alt });
            }
            // Don't prevent default - let the browser handle the broken image
        });
        
        img.addEventListener('load', function(e) {
            // Optional: Log successful image loads for debugging
            if (window.logger && window.logger.info) {
                window.logger.info('Image loaded successfully', { src: e.target.src });
            }
        });
    });
    
    // Also handle dynamically created images (like in slideshow)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG') {
                        setupImageErrorHandling(node);
                    } else if (node.querySelectorAll) {
                        const newImages = node.querySelectorAll('img');
                        newImages.forEach(setupImageErrorHandling);
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    function setupImageErrorHandling(img) {
        img.addEventListener('error', function(e) {
            console.warn('Dynamically created image failed to load:', e.target.src);
            if (window.logger) {
                window.logger.warn('Dynamically created image failed to load', { src: e.target.src, alt: e.target.alt });
            }
        });
        
        img.addEventListener('load', function(e) {
            if (window.logger && window.logger.info) {
                window.logger.info('Dynamically created image loaded successfully', { src: e.target.src });
            }
        });
    }
});

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
        
        // Add error handling for slideshow images
        imgElement.addEventListener('error', function(e) {
            console.warn('Slideshow image failed to load:', e.target.src);
            if (window.logger) {
                window.logger.warn('Slideshow image failed to load', { src: e.target.src, alt: e.target.alt });
            }
            // Hide the slide if image fails to load
            slideItem.style.display = 'none';
        });
        
        imgElement.addEventListener('load', function(e) {
            if (window.logger && window.logger.info) {
                window.logger.info('Slideshow image loaded successfully', { src: e.target.src });
            }
        });
        
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

// ===== TESTIMONIALS SWIPE FUNCTIONALITY =====
const initializeTestimonialsSwipe = () => {
    try {
        console.log('Initializing testimonials swipe...');
        const testimonialsConveyor = document.querySelector('.testimonials-conveyor');
        const conveyorTrack = document.querySelector('.conveyor-track');
        
        console.log('Testimonials elements found:', {
            conveyor: !!testimonialsConveyor,
            track: !!conveyorTrack,
            windowWidth: window.innerWidth,
            isMobile: window.innerWidth <= 768
        });
        
        if (!testimonialsConveyor || !conveyorTrack) {
            console.log('Testimonials elements not found, exiting');
            return;
        }
    
    let isMobile = window.innerWidth <= 768;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let initialTransform = 0;
    let currentTransform = 0;
    let animationId = null;
    let isAutoScrolling = true;
    
    // Check if mobile and setup swipe functionality
    const setupMobileSwipe = () => {
        try {
            isMobile = window.innerWidth <= 768;
            console.log('Setting up mobile swipe, isMobile:', isMobile, 'width:', window.innerWidth);
            
            if (isMobile) {
                console.log('Setting up mobile touch events...');
                // Stop auto-scroll animation on mobile
                if (conveyorTrack && conveyorTrack.style) {
                    conveyorTrack.style.animationPlayState = 'paused';
                }
                isAutoScrolling = false;
                
                // Add touch event listeners
                testimonialsConveyor.addEventListener('touchstart', handleTouchStart, { passive: false });
                testimonialsConveyor.addEventListener('touchmove', handleTouchMove, { passive: false });
                testimonialsConveyor.addEventListener('touchend', handleTouchEnd, { passive: false });
                
                // Add mouse events for desktop testing
                testimonialsConveyor.addEventListener('mousedown', handleMouseDown);
                testimonialsConveyor.addEventListener('mousemove', handleMouseMove);
                testimonialsConveyor.addEventListener('mouseup', handleMouseUp);
                testimonialsConveyor.addEventListener('mouseleave', handleMouseUp);
                
                console.log('Mobile touch events added successfully');
        } else {
            // Resume auto-scroll animation on desktop
            conveyorTrack.style.animationPlayState = 'running';
            isAutoScrolling = true;
            
            // Remove event listeners
            testimonialsConveyor.removeEventListener('touchstart', handleTouchStart);
            testimonialsConveyor.removeEventListener('touchmove', handleTouchMove);
            testimonialsConveyor.removeEventListener('touchend', handleTouchEnd);
            testimonialsConveyor.removeEventListener('mousedown', handleMouseDown);
            testimonialsConveyor.removeEventListener('mousemove', handleMouseMove);
            testimonialsConveyor.removeEventListener('mouseup', handleMouseUp);
            testimonialsConveyor.removeEventListener('mouseleave', handleMouseUp);
        }
        } catch (error) {
            console.error('Error in setupMobileSwipe:', error);
            if (window.logger) {
                window.logger.error('Setup mobile swipe failed', { error: error.message });
            }
        }
    };
    
    // Touch event handlers
    const handleTouchStart = (e) => {
        console.log('Touch start detected, isMobile:', isMobile);
        if (!isMobile) return;
        
        startX = e.touches[0].clientX;
        const startY = e.touches[0].clientY;
        
        // Store initial touch position for direction detection
        e.touchStartX = startX;
        e.touchStartY = startY;
        
        // Don't start dragging immediately - wait for movement to determine direction
        isDragging = false;
        currentX = startX;
        
        // Get current transform value
        const transform = conveyorTrack.style.transform;
        const match = transform ? transform.match(/-?\d+\.?\d*/) : null;
        initialTransform = match ? parseFloat(match[0]) : 0;
        currentTransform = initialTransform;
        
        // Stop any ongoing animation
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
    
    const handleTouchMove = (e) => {
        if (!isMobile) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - startX;
        const deltaY = currentY - e.touchStartY;
        
        // If we're not dragging yet, determine if this is a horizontal swipe
        if (!isDragging) {
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            // Only start dragging if horizontal movement is greater than vertical
            if (absDeltaX > 10 && absDeltaX > absDeltaY) {
                console.log('Starting horizontal swipe drag...');
                isDragging = true;
                e.preventDefault(); // Prevent scrolling for horizontal swipes
            } else if (absDeltaY > 10) {
                // This is a vertical swipe, don't interfere with page scrolling
                console.log('Vertical swipe detected, allowing page scroll');
                return;
            }
        }
        
        // Only handle horizontal dragging
        if (isDragging) {
            console.log('Touch move detected - horizontal drag');
            e.preventDefault(); // Prevent scrolling during horizontal drag
            currentTransform = initialTransform + deltaX;
            
            // Apply transform with momentum
            conveyorTrack.style.transform = `translateX(${currentTransform}px)`;
        }
    };
    
    const handleTouchEnd = (e) => {
        if (!isMobile || !isDragging) return;
        
        isDragging = false;
        const deltaX = currentX - startX;
        const velocity = Math.abs(deltaX) / 100; // Simple velocity calculation
        
        // Determine if swipe was significant enough
        if (Math.abs(deltaX) > 50 || velocity > 0.5) {
            // Calculate how many testimonials to move
            const testimonialWidth = 300; // Mobile testimonial width + gap
            const moveAmount = Math.round(deltaX / testimonialWidth);
            
            // Apply smooth transition to new position
            const targetTransform = currentTransform - (moveAmount * testimonialWidth);
            animateToPosition(targetTransform);
        } else {
            // Snap back to current position
            animateToPosition(initialTransform);
        }
    };
    
    // Mouse event handlers (for desktop testing)
    const handleMouseDown = (e) => {
        if (!isMobile) return;
        isDragging = true;
        startX = e.clientX;
        currentX = startX;
        
        const transform = conveyorTrack.style.transform;
        const match = transform ? transform.match(/-?\d+\.?\d*/) : null;
        initialTransform = match ? parseFloat(match[0]) : 0;
        currentTransform = initialTransform;
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
    
    const handleMouseMove = (e) => {
        if (!isMobile || !isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX;
        const deltaX = currentX - startX;
        currentTransform = initialTransform + deltaX;
        
        conveyorTrack.style.transform = `translateX(${currentTransform}px)`;
    };
    
    const handleMouseUp = (e) => {
        if (!isMobile || !isDragging) return;
        
        isDragging = false;
        const deltaX = currentX - startX;
        const velocity = Math.abs(deltaX) / 100;
        
        if (Math.abs(deltaX) > 50 || velocity > 0.5) {
            const testimonialWidth = 300;
            const moveAmount = Math.round(deltaX / testimonialWidth);
            const targetTransform = currentTransform - (moveAmount * testimonialWidth);
            animateToPosition(targetTransform);
        } else {
            animateToPosition(initialTransform);
        }
    };
    
    // Smooth animation to target position
    const animateToPosition = (targetTransform) => {
        const startTransform = currentTransform;
        const distance = targetTransform - startTransform;
        const duration = 300; // 300ms animation
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentPosition = startTransform + (distance * easeOut);
            conveyorTrack.style.transform = `translateX(${currentPosition}px)`;
            
            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            } else {
                currentTransform = targetTransform;
                animationId = null;
            }
        };
        
        animationId = requestAnimationFrame(animate);
    };
    
    // Initialize on load and resize
    setupMobileSwipe();
    window.addEventListener('resize', setupMobileSwipe);
    
    // Additional initialization check
    setTimeout(() => {
        console.log('Delayed testimonials check:', {
            conveyor: !!testimonialsConveyor,
            track: !!conveyorTrack,
            conveyorStyle: testimonialsConveyor ? window.getComputedStyle(testimonialsConveyor).display : 'not found',
            trackStyle: conveyorTrack ? window.getComputedStyle(conveyorTrack).display : 'not found'
        });
    }, 1000);
    } catch (error) {
        console.error('Error initializing testimonials swipe:', error);
        if (window.logger) {
            window.logger.error('Testimonials swipe initialization failed', { error: error.message });
        }
    }
};

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    try {
    // ===== MOBILE MENU TOGGLE =====
    try {
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
    } catch (error) {
        console.error('Error initializing mobile menu:', error);
        if (window.logger) {
            window.logger.error('Mobile menu initialization failed', { error: error.message });
        }
    }

    // Initialize slideshow containers after DOM is ready
    slideshowContainer = document.querySelector('.hero-slideshow');
    dotsContainer = document.querySelector('.slideshow-dots');
    
    // Initialize slideshow and swipe functionality
    try {
        initializeSlideshow();
        initializeSwipe();
    } catch (error) {
        console.error('Error initializing slideshow:', error);
        if (window.logger) {
            window.logger.error('Slideshow initialization failed', { error: error.message });
        }
    }
    
    // Initialize testimonials swipe functionality
    try {
        // Delay testimonials initialization to ensure DOM is fully ready
        setTimeout(() => {
            initializeTestimonialsSwipe();
        }, 100);
    } catch (error) {
        console.error('Error initializing testimonials swipe:', error);
        if (window.logger) {
            window.logger.error('Testimonials swipe failed', { error: error.message });
        }
    }
    
    // Check if gallery modal is available and working
    setTimeout(() => {
        if (window.galleryModal) {
            
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
  } else {
            console.warn('⚠️ Gallery modal not found - featured projects may not work');
        }
        
        // Test featured project click handlers
        const featuredProjects = document.querySelectorAll('.featured-project[data-project-id]');
        
        featuredProjects.forEach((project, index) => {
            const projectId = project.getAttribute('data-project-id');
        });
    }, 1000);
    } catch (error) {
        console.error('Error in homepage initialization:', error);
        if (window.logger) {
            window.logger.error('Homepage initialization failed', { error: error.message });
        }
    }
});
