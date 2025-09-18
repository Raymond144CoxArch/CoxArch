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
        const testimonialsSection = document.querySelector('.testimonials-section');
        if (!testimonialsSection) {
            console.log('Testimonials section not found, skipping swipe initialization.');
            return;
        }

        const conveyorTrack = testimonialsSection.querySelector('.conveyor-track');
        if (!conveyorTrack) {
            console.error('Testimonials conveyor track not found.');
            return;
        }

        const cards = testimonialsSection.querySelectorAll('.testimonial-item');
        if (cards.length === 0) {
            console.log('No testimonial cards found.');
            return;
        }

        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let currentTransform = 0;
        let animationId = null;

        const setupMobileSwipe = () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                // Bug Fix: Calculate total width of all cards
                let totalWidth = 0;
                cards.forEach(card => {
                    totalWidth += card.offsetWidth;
                });
                // Add margins
                const cardMargin = parseFloat(window.getComputedStyle(cards[0]).marginRight);
                totalWidth += (cards.length - 1) * cardMargin;

                conveyorTrack.style.width = `${totalWidth}px`;

                // Add event listeners
                conveyorTrack.addEventListener('mousedown', startDrag);
                conveyorTrack.addEventListener('touchstart', startDrag);
                window.addEventListener('mouseup', endDrag);
                window.addEventListener('touchend', endDrag);
                window.addEventListener('mousemove', doDrag);
                window.addEventListener('touchmove', doDrag);
            } else {
                conveyorTrack.style.width = ''; // Reset width for desktop
                // Remove listeners for desktop
                conveyorTrack.removeEventListener('mousedown', startDrag);
                conveyorTrack.removeEventListener('touchstart', startDrag);
                window.removeEventListener('mouseup', endDrag);
                window.removeEventListener('touchend', endDrag);
                window.removeEventListener('mousemove', doDrag);
                window.removeEventListener('touchmove', doDrag);
            }
        };

        const startDrag = (e) => {
            isDragging = true;
            startX = e.pageX || e.touches[0].pageX;
            startScrollLeft = conveyorTrack.scrollLeft;
            // Stop any existing animation
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            conveyorTrack.style.cursor = 'grabbing';
        };

        const doDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX || e.touches[0].pageX;
            const walk = (x - startX) * 2; // Adjust sensitivity
            conveyorTrack.scrollLeft = startScrollLeft - walk;
        };

        const endDrag = () => {
            isDragging = false;
            conveyorTrack.style.cursor = 'grab';
        };

        // Initialize on load and resize
        setupMobileSwipe();
        
        // Only add resize listener once
        if (!window.testimonialsResizeListenerAdded) {
            window.addEventListener('resize', setupMobileSwipe);
            window.testimonialsResizeListenerAdded = true;
        }
    } catch (error) {
        console.error('Error initializing testimonials swipe:', error);
        if (window.logger) {
            window.logger.error('Testimonials swipe initialization failed', { error: error.message });
        }
    }
};