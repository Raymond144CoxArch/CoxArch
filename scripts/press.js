// Auto-scrolling testimonial slider logic
document.addEventListener('DOMContentLoaded', () => {
  try {
  // ---- Mobile Menu Toggle ----
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

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

  // Initialize testimonials swipe functionality
  initializeTestimonialsSwipe();
  } catch (error) {
    console.error('Error in press page initialization:', error);
    if (window.logger) {
      window.logger.error('Press page initialization failed', { error: error.message });
    }
  }
});

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