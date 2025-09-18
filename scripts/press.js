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

// ===== TESTIMONIALS SWIPE FUNCTIONALITY =====
const initializeTestimonialsSwipe = () => {
    try {
        console.log('Press page: Initializing testimonials swipe...');
        const testimonialsConveyor = document.querySelector('.testimonials-conveyor');
        const conveyorTrack = document.querySelector('.conveyor-track');
        
        console.log('Press page: Testimonials elements found:', {
            conveyor: !!testimonialsConveyor,
            track: !!conveyorTrack,
            windowWidth: window.innerWidth,
            isMobile: window.innerWidth <= 768
        });
        
        if (!testimonialsConveyor || !conveyorTrack) {
            console.log('Press page: Testimonials elements not found, exiting');
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
        isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Stop auto-scroll animation on mobile
            conveyorTrack.style.animationPlayState = 'paused';
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
    };
    
    // Touch event handlers
    const handleTouchStart = (e) => {
        if (!isMobile) return;
        isDragging = true;
        startX = e.touches[0].clientX;
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
        if (!isMobile || !isDragging) return;
        
        e.preventDefault();
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        currentTransform = initialTransform + deltaX;
        
        // Apply transform with momentum
        conveyorTrack.style.transform = `translateX(${currentTransform}px)`;
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
    } catch (error) {
        console.error('Error initializing testimonials swipe:', error);
        if (window.logger) {
            window.logger.error('Testimonials swipe initialization failed', { error: error.message });
        }
    }
};
