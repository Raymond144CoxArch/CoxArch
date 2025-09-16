// Auto-scrolling testimonial slider logic
document.addEventListener('DOMContentLoaded', () => {
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

  // Client reviews removed - testimonials section structure remains for future use
});
