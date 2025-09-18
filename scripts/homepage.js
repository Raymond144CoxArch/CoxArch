// Homepage JavaScript - CACHE BUST v9 (Clean Modern Testimonials)
// Logger is available globally from logger.js

// Debug: Check if logger exists
// console.log('Homepage.js loaded, logger available:', typeof window.logger);

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
        });
        
        img.addEventListener('load', function(e) {
            if (window.logger && window.logger.info) {
                window.logger.info('Image loaded successfully', { src: e.target.src });
            }
        });
    });
});

// ===== HOMEPAGE SLIDESHOW =====
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
    clearInterval(slideInterval);
    slideInterval = setInterval(window.nextSlide, 5000);
};

const stopAutoSlide = () => {
    clearInterval(slideInterval);
};

// Load slideshow images
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
        
        imgElement.addEventListener('error', function(e) {
            console.warn('Slideshow image failed to load:', e.target.src);
            if (window.logger) {
                window.logger.warn('Slideshow image failed to load', { src: e.target.src, alt: e.target.alt });
            }
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
                stopAutoSlide();
                startAutoSlide();
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
        stopAutoSlide();
    }, { passive: true });

    slideshowContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
                window.nextSlide();
      } else {
                window.previousSlide();
            }
        }
        startAutoSlide();
    });
  };

// ===== TESTIMONIALS FUNCTIONALITY (Clean Modern Design) =====
const initializeTestimonialsSwipe = () => {
    try {
        const testimonialsSection = document.querySelector('.testimonials-section');
        if (!testimonialsSection) {
            // console.log('Testimonials section not found, skipping initialization.');
            return;
        }

        const testimonialsTrack = testimonialsSection.querySelector('.testimonials-track');
        if (!testimonialsTrack) {
            console.error('Testimonials track not found.');
            return;
        }

        const cards = testimonialsSection.querySelectorAll('.testimonial-card');
        if (cards.length === 0) {
            // console.log('No testimonial cards found.');
            return;
        }
        
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let animationId = null;
        let isAutoScrolling = true;

        // Check if screen is mobile (width <= 768px)
        const isMobile = () => window.innerWidth <= 768;

        // Desktop Auto-Scrolling Functionality
        const startAutoScroll = () => {
            if (isMobile() || !isAutoScrolling) return;
            
            const scrollSpeed = 1; // pixels per frame
            const animate = () => {
                if (isAutoScrolling && !isDragging && !isMobile()) {
                    testimonialsTrack.scrollLeft += scrollSpeed;
                    
                    // Reset to beginning when we reach the end
                    if (testimonialsTrack.scrollLeft >= testimonialsTrack.scrollWidth - testimonialsTrack.clientWidth) {
                        testimonialsTrack.scrollLeft = 0;
                    }
                }
                animationId = requestAnimationFrame(animate);
            };
            animate();
        };

        // Mobile Swipe Functionality
        const setupMobileSwipe = () => {
            if (isMobile()) {
                // Stop auto-scroll on mobile
                isAutoScrolling = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }

                // Calculate total width needed for all cards
                let totalWidth = 0;
                cards.forEach(card => {
                    totalWidth += card.offsetWidth;
                });
                
                // Add gaps between cards
                const gap = parseFloat(window.getComputedStyle(testimonialsTrack).gap) || 30;
                totalWidth += (cards.length - 1) * gap;
                
                // Add padding for better UX
                totalWidth += 32; // 16px padding on each side

                // Set the track width to accommodate all cards
                testimonialsTrack.style.width = `${totalWidth}px`;
                testimonialsTrack.style.overflowX = 'scroll';
                testimonialsTrack.style.scrollBehavior = 'auto';

                // Add event listeners for mobile swipe
                testimonialsTrack.addEventListener('mousedown', startDrag);
                testimonialsTrack.addEventListener('touchstart', startDrag, { passive: false });
                window.addEventListener('mouseup', endDrag);
                window.addEventListener('touchend', endDrag);
                window.addEventListener('mousemove', doDrag);
                window.addEventListener('touchmove', doDrag, { passive: false });

                // Add visual feedback
                testimonialsTrack.style.cursor = 'grab';
            } else {
                // Desktop setup
                isAutoScrolling = true;
                testimonialsTrack.style.width = '';
                testimonialsTrack.style.overflowX = 'visible';
                testimonialsTrack.style.cursor = 'default';
                
                // Remove event listeners for desktop
                testimonialsTrack.removeEventListener('mousedown', startDrag);
                testimonialsTrack.removeEventListener('touchstart', startDrag);
                window.removeEventListener('mouseup', endDrag);
                window.removeEventListener('touchend', endDrag);
                window.removeEventListener('mousemove', doDrag);
                window.removeEventListener('touchmove', doDrag);

                // Start auto-scroll for desktop
                startAutoScroll();
            }
        };

        const startDrag = (e) => {
            if (!isMobile()) return;
            
            isDragging = true;
            startX = e.pageX || e.touches[0].pageX;
            startScrollLeft = testimonialsTrack.scrollLeft;
            
            // Visual feedback
            testimonialsTrack.style.cursor = 'grabbing';
            testimonialsTrack.style.scrollBehavior = 'auto';
        };

        const doDrag = (e) => {
            if (!isDragging || !isMobile()) return;
            
            e.preventDefault();
            const x = e.pageX || e.touches[0].pageX;
            const walk = (x - startX) * 2; // Adjust sensitivity
            testimonialsTrack.scrollLeft = startScrollLeft - walk;
        };

        const endDrag = () => {
            if (!isDragging) return;
            
            isDragging = false;
            testimonialsTrack.style.cursor = 'grab';
            testimonialsTrack.style.scrollBehavior = 'smooth';
        };

        // Pause auto-scroll on hover (desktop only)
        const handleMouseEnter = () => {
            if (!isMobile()) {
                isAutoScrolling = false;
            }
        };

        const handleMouseLeave = () => {
            if (!isMobile()) {
                isAutoScrolling = true;
                startAutoScroll();
            }
        };

        // Initialize functionality
        setupMobileSwipe();
        
        // Add hover listeners for desktop
        if (!isMobile()) {
            testimonialsSection.addEventListener('mouseenter', handleMouseEnter);
            testimonialsSection.addEventListener('mouseleave', handleMouseLeave);
        }
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Remove old event listeners
                testimonialsSection.removeEventListener('mouseenter', handleMouseEnter);
                testimonialsSection.removeEventListener('mouseleave', handleMouseLeave);
                
                // Stop current animation
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                
                // Reinitialize
                setupMobileSwipe();
                
                // Re-add hover listeners if desktop
                if (!isMobile()) {
                    testimonialsSection.addEventListener('mouseenter', handleMouseEnter);
                    testimonialsSection.addEventListener('mouseleave', handleMouseLeave);
                }
            }, 100); // Debounce resize events
        });

        // Add keyboard navigation support
        testimonialsTrack.addEventListener('keydown', (e) => {
            if (!isMobile()) return;
            
            const scrollAmount = 300; // Pixels to scroll per key press
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    testimonialsTrack.scrollLeft -= scrollAmount;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    testimonialsTrack.scrollLeft += scrollAmount;
                    break;
                case 'Home':
                    e.preventDefault();
                    testimonialsTrack.scrollLeft = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    testimonialsTrack.scrollLeft = testimonialsTrack.scrollWidth;
                    break;
            }
        });

        // Make track focusable for keyboard navigation
        testimonialsTrack.setAttribute('tabindex', '0');
        testimonialsTrack.setAttribute('role', 'region');
        testimonialsTrack.setAttribute('aria-label', 'Testimonials carousel');

        // console.log('Clean modern testimonials functionality initialized successfully');
        
    } catch (error) {
        console.error('Error initializing testimonials:', error);
        if (window.logger) {
            window.logger.error('Testimonials initialization failed', { error: error.message });
        }
    }
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    try {
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

        // Initialize slideshow and swipe functionality
        slideshowContainer = document.querySelector('.hero-slideshow');
        dotsContainer = document.querySelector('.slideshow-dots');
        
        if (slideshowContainer) {
            initializeSlideshow();
            initializeSwipe();
        }

        // Initialize testimonials functionality
        setTimeout(() => {
            initializeTestimonialsSwipe();
        }, 100);

    } catch (error) {
        console.error('Error in homepage initialization:', error);
        if (window.logger) {
            window.logger.error('Homepage initialization failed', { error: error.message });
        }
    }
});
