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

// ===== FEATURED PROJECTS AND CONTINUOUS GALLERY =====
let continuousGalleryTrack;
let galleryItems = [];
let galleryAnimationId;
let isGalleryPaused = false;

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

        // Desktop Auto-Scrolling Functionality - Using CSS animation instead
        const startAutoScroll = () => {
            // CSS animation handles the scrolling, no JavaScript needed
            console.log('Using CSS animation for testimonials');
            return;
        };

        // Desktop Drag Functionality
        const setupDesktopDrag = () => {
            if (isMobile()) return;

            let isDragging = false;
            let startX = 0;
            let startScrollLeft = 0;

            const startDrag = (e) => {
                isDragging = true;
                startX = e.pageX - testimonialsTrack.offsetLeft;
                startScrollLeft = testimonialsTrack.scrollLeft;
                
                // Pause CSS animation
                testimonialsTrack.style.animationPlayState = 'paused';
                
                // Change cursor
                testimonialsTrack.style.cursor = 'grabbing';
                document.body.style.cursor = 'grabbing';
                
                e.preventDefault();
            };

            const drag = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                
                const x = e.pageX - testimonialsTrack.offsetLeft;
                const walk = (x - startX) * 2; // Multiply for faster scrolling
                testimonialsTrack.scrollLeft = startScrollLeft - walk;
            };

            const stopDrag = () => {
                isDragging = false;
                
                // Resume CSS animation after a short delay
                setTimeout(() => {
                    if (!isDragging) {
                        testimonialsTrack.style.animationPlayState = 'running';
                    }
                }, 1000);
                
                // Reset cursor
                testimonialsTrack.style.cursor = 'grab';
                document.body.style.cursor = 'default';
            };

            // Add event listeners for desktop drag
            testimonialsTrack.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            // Prevent text selection while dragging
            testimonialsTrack.addEventListener('selectstart', (e) => {
                if (isDragging) e.preventDefault();
            });
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
        // setupDesktopDrag(); // Temporarily disabled - causing grid layout issues
        
        // Add hover listeners for desktop
        if (!isMobile()) {
            testimonialsSection.addEventListener('mouseenter', handleMouseEnter);
            testimonialsSection.addEventListener('mouseleave', handleMouseLeave);
            
            // Add hover listeners to individual testimonial cards
            const testimonialCards = testimonialsSection.querySelectorAll('.testimonial-card');
            testimonialCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    console.log('Hovering over testimonial card - pausing animation');
                    testimonialsTrack.style.animationPlayState = 'paused';
                });
                
                card.addEventListener('mouseleave', () => {
                    console.log('Leaving testimonial card - resuming animation');
                    testimonialsTrack.style.animationPlayState = 'running';
                });
            });
            
            // Start auto-scroll with a small delay to ensure DOM is ready
            setTimeout(() => {
                console.log('Starting desktop auto-scroll...');
                startAutoScroll();
            }, 500);
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

// ===== CONTINUOUS GALLERY FUNCTIONALITY =====
const initializeContinuousGallery = () => {
    try {
        console.log('Initializing continuous gallery...');
        continuousGalleryTrack = document.getElementById('featuredContinuousGallery');
        if (!continuousGalleryTrack) {
            console.log('Continuous gallery track not found by ID, trying by class...');
            continuousGalleryTrack = document.querySelector('.continuous-gallery-track');
            if (!continuousGalleryTrack) {
                console.log('Continuous gallery track not found, skipping initialization.');
                console.log('Available elements with "gallery" in ID:', 
                    Array.from(document.querySelectorAll('[id*="gallery"]')).map(el => el.id));
                console.log('Available elements with "gallery" in class:', 
                    Array.from(document.querySelectorAll('[class*="gallery"]')).map(el => el.className));
                return;
            }
        }
        console.log('Found continuous gallery track:', continuousGalleryTrack);
        console.log('Gallery track parent:', continuousGalleryTrack.parentElement);

        // Full project data for the continuous gallery (matching portfolio structure)
        const projects = [
            {
                id: 'williams-lake-house',
                name: 'Lake House',
                displayName: 'Lake House',
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
                    'images/Portfolio/New Construction/lake-house/lakehouse-24-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-25-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-26-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-27-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-28-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-29-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-30-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-31-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-32-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-33-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-34-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-35-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-36-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-37-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-38-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-39-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-40-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-41-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-42-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-43-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-44-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-45-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-46-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-47-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-48-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-49-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-50-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-51-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-52-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-53-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
                type: 'new-construction',
                description: 'Lakeside residence designed to maximize water views and outdoor living.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'split-level-makeover',
                name: 'Split Level Makeover',
                displayName: 'Split Level Makeover',
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
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-10-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-11-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-12-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-13-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-14-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-15-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-16-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-17-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-18-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-19-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-20-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-21-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-22-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-23-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-24-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-25-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-26-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-27-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-28-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-29-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-30-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-31-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-32-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
                type: 'renovation-addition',
                description: 'Complete split-level home transformation with modern design elements.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'heavy-timber-pool-house',
                name: 'Heavy Timber Pool House',
                displayName: 'Heavy Timber Pool House',
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
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/hero.png',
                type: 'renovation-addition',
                description: 'Custom heavy-timber-pool-house addition with rustic elegance and modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'woodland',
                name: 'Woodland',
                displayName: 'Woodland',
                images: [
                    'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-1-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-3-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-4-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-5-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-6-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-7-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-8-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-9-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-10-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-11-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-12-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-13-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-14-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
                type: 'new-construction',
                description: 'Natural woodland setting home with organic design elements and forest integration.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'sabik',
                name: 'Modern Craftsman',
                displayName: 'Modern Craftsman',
                images: [
                    'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-3-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-5-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-7-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-10-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-11-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-12-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-13-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-14-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-15-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-16-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-17-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-18-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
                type: 'new-construction',
                description: 'Modern craftsman home with clean lines and natural materials.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'modern-warehouse',
                name: 'Modern Warehouse',
                displayName: 'Modern Warehouse',
                images: [
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-1-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-1-.jpeg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-3-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-4-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-5-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-6-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-7-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
                type: 'new-construction',
                description: 'Industrial-inspired modern home featuring open spaces and contemporary design.',
                location: 'Charlotte, NC',
                year: '2023'
            }
        ];

        // Create gallery items (duplicate for seamless loop)
        const allProjects = [...projects, ...projects, ...projects]; // Triple for smooth continuous scroll
        
        allProjects.forEach((project, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'continuous-gallery-item';
            galleryItem.setAttribute('data-project-id', project.id);
            galleryItem.innerHTML = `
                <img src="${project.hero_image}" alt="${project.name}" class="continuous-gallery-image" loading="lazy" />
                <div class="continuous-gallery-overlay">
                    <div class="continuous-gallery-title">${project.name}</div>
                </div>
            `;
            
            // Add click handler for gallery modal
            galleryItem.addEventListener('click', async (e) => {
        e.preventDefault();
                if (window.galleryModal && window.galleryModal.isDataAvailable()) {
                    try {
                        await window.galleryModal.openProject(project.id);
                    } catch (error) {
                        console.error('Failed to open project:', error);
                        if (window.logger) {
                            window.logger.error('Failed to open project from continuous gallery', { error: error.message, projectId: project.id });
                        }
                    }
                }
            });
            
            continuousGalleryTrack.appendChild(galleryItem);
            galleryItems.push(galleryItem);
        });
        
        console.log(`Continuous gallery populated with ${allProjects.length} items`);
        console.log('Gallery track element:', continuousGalleryTrack);

        // Start continuous animation
        try {
            startContinuousAnimation();
            console.log('Continuous animation started successfully');
        } catch (error) {
            console.error('Error starting continuous animation:', error);
        }

        // Pause animation on hover
        continuousGalleryTrack.addEventListener('mouseenter', () => {
            isGalleryPaused = true;
        });

        continuousGalleryTrack.addEventListener('mouseleave', () => {
            isGalleryPaused = false;
            startContinuousAnimation();
        });

               console.log('Continuous gallery initialized successfully');
               
           } catch (error) {
               console.error('Error initializing continuous gallery:', error);
               if (window.logger) {
                   window.logger.error('Continuous gallery initialization failed', { error: error.message });
               }
           }
       };

       // ===== GALLERY MODAL SETUP FOR HOMEPAGE =====
       const initializeHomepageGalleryModal = () => {
           try {
               if (window.galleryModal && window.galleryModal.isReady()) {
                   console.log('Setting up gallery modal for homepage');
                   
                   // Get the same project data used in continuous gallery
                   const projects = [
                       {
                           id: 'williams-lake-house',
                           name: 'Lake House',
                           displayName: 'Lake House',
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
                               'images/Portfolio/New Construction/lake-house/lakehouse-24-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-25-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-26-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-27-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-28-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-29-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-30-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-31-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-32-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-33-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-34-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-35-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-36-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-37-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-38-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-39-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-40-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-41-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-42-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-43-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-44-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-45-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-46-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-47-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-48-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-49-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-50-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-51-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-52-.jpg',
                               'images/Portfolio/New Construction/lake-house/lakehouse-53-.jpg'
                           ],
                           hero_image: 'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
                           type: 'new-construction',
                           description: 'Lakeside residence designed to maximize water views and outdoor living.',
                           location: 'Charlotte, NC',
                           year: '2023'
                       },
                       {
                           id: 'split-level-makeover',
                           name: 'Split Level Makeover',
                           displayName: 'Split Level Makeover',
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
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-10-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-11-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-12-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-13-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-14-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-15-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-16-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-17-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-18-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-19-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-20-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-21-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-22-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-23-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-24-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-25-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-26-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-27-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-28-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-29-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-30-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-31-.jpg',
                               'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-32-.jpg'
                           ],
                           hero_image: 'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
                           type: 'renovation-addition',
                           description: 'Complete split-level home transformation with modern design elements.',
                           location: 'Charlotte, NC',
                           year: '2023'
                       },
                       {
                           id: 'heavy-timber-pool-house',
                           name: 'Heavy Timber Pool House',
                           displayName: 'Heavy Timber Pool House',
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
                           ],
                           hero_image: 'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/hero.png',
                           type: 'renovation-addition',
                           description: 'Custom heavy-timber-pool-house addition with rustic elegance and modern amenities.',
                           location: 'Charlotte, NC',
                           year: '2023'
                       },
                       {
                           id: 'woodland',
                           name: 'Woodland',
                           displayName: 'Woodland',
                           images: [
                               'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-1-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-3-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-4-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-5-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-6-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-7-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-8-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-9-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-10-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-11-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-12-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-13-.jpg',
                               'images/Portfolio/New Construction/Woodland/woodland-14-.jpg'
                           ],
                           hero_image: 'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
                           type: 'new-construction',
                           description: 'Natural woodland setting home with organic design elements and forest integration.',
                           location: 'Charlotte, NC',
                           year: '2023'
                       },
                       {
                           id: 'sabik',
                           name: 'Modern Craftsman',
                           displayName: 'Modern Craftsman',
                           images: [
                               'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-1-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-2-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-3-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-4-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-5-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-6-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-7-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-8-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-9-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-10-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-11-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-12-.jpg',
                               'images/Portfolio/New Construction/Sabik/sabik-13-.jpg'
                           ],
                           hero_image: 'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
                           type: 'new-construction',
                           description: 'Modern craftsman home with clean lines and natural materials.',
                           location: 'Charlotte, NC',
                           year: '2023'
                       },
                       {
                           id: 'modern-warehouse',
                           name: 'Modern Warehouse',
                           displayName: 'Modern Warehouse',
                           images: [
                               'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
                               'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-1-.jpg',
                               'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-1-.jpeg',
                               'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-3-.jpg',
                               'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-4-.jpg',
                               'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-5-.jpg',
                               'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-6-.jpg',
                               'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-7-.jpg'
                           ],
                           hero_image: 'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
                           type: 'new-construction',
                           description: 'Industrial-inspired modern home featuring open spaces and contemporary design.',
                           location: 'Charlotte, NC',
                           year: '2023'
                       }
                   ];
                   
                   // Convert array to object keyed by project IDs
                   const projectsObject = projects.reduce((obj, project) => {
                       obj[project.id] = project;
                       return obj;
                   }, {});
                   
                   // Set project data in gallery modal
                   window.galleryModal.setProjectsData(projectsObject);
                   console.log('Gallery modal project data set for homepage');
                   
            } else {
                   console.log('Gallery modal not ready yet, retrying in 100ms...');
                   setTimeout(initializeHomepageGalleryModal, 100);
               }
           } catch (error) {
               console.error('Error initializing homepage gallery modal:', error);
               if (window.logger) {
                   window.logger.error('Homepage gallery modal initialization failed', { error: error.message });
               }
           }
       };

const startContinuousAnimation = () => {
    if (galleryAnimationId) {
        cancelAnimationFrame(galleryAnimationId);
    }
    
    let position = 0;
    const speed = 0.5; // pixels per frame
    
    const animate = () => {
        if (!isGalleryPaused && continuousGalleryTrack) {
            position -= speed;
            
            // Reset position when we've scrolled through one set of projects
            const projectWidth = 300; // Approximate width of each project
            const projectsPerSet = 6; // Number of projects in one set
            if (Math.abs(position) >= projectWidth * projectsPerSet) {
                position = 0;
            }
            
            continuousGalleryTrack.style.transform = `translateX(${position}px)`;
            galleryAnimationId = requestAnimationFrame(animate);
        }
    };
    
    animate();
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

               // Continuous gallery removed

               // Initialize homepage gallery modal
               setTimeout(() => {
                   initializeHomepageGalleryModal();
               }, 300);

               // Ensure featured project images are loaded
               setTimeout(() => {
                   const featuredProjectImages = document.querySelectorAll('.featured-project img');
                   console.log('Found featured project images:', featuredProjectImages.length);
                   featuredProjectImages.forEach((img, index) => {
                       console.log(`Image ${index + 1}:`, {
                           src: img.src,
                           complete: img.complete,
                           naturalWidth: img.naturalWidth,
                           naturalHeight: img.naturalHeight,
                           offsetWidth: img.offsetWidth,
                           offsetHeight: img.offsetHeight
                       });
                       
                       // Force load the image if it's not complete
                       if (img.src && !img.complete) {
                           console.log('Loading featured project image:', img.src);
                           img.addEventListener('load', () => {
                               console.log('Featured project image loaded:', img.src);
                           });
                           img.addEventListener('error', (e) => {
                               console.error('Featured project image failed to load:', img.src, e);
                           });
                           
                           // Force reload the image
                           const originalSrc = img.src;
                           img.src = '';
                           img.src = originalSrc;
                       } else if (img.complete) {
                           console.log('Featured project image already loaded:', img.src);
                       }
                       
                       // Ensure the image is visible
                       img.style.display = 'block';
                       img.style.visibility = 'visible';
                       img.style.opacity = '1';
                   });
               }, 100);

               // Add debugging for gallery modal
               setTimeout(() => {
                   if (window.galleryModal) {
                       console.log('Gallery Modal Status:', {
                           isReady: window.galleryModal.isReady(),
                           hasData: window.galleryModal.isDataAvailable(),
                           projectCount: window.galleryModal.projectsData ? Object.keys(window.galleryModal.projectsData).length : 0
                       });
  } else {
                       console.error('Gallery Modal not found on window object');
                   }
               }, 500);

    } catch (error) {
        console.error('Error in homepage initialization:', error);
        if (window.logger) {
            window.logger.error('Homepage initialization failed', { error: error.message });
        }
    }
});
