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

  // ---- 404 Page Enhancements ----
  
  // Log 404 error for analytics (if analytics is available)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: '404 - Page Not Found',
      page_location: window.location.href
    });
  }

  // Auto-redirect common misspellings or old URLs
  const currentPath = window.location.pathname.toLowerCase();
  const redirectMap = {
    '/home': '/homepage.html',
    '/index': '/homepage.html',
    '/index.html': '/homepage.html',
    '/portfolio': '/portfolio.html',
    '/gallery': '/portfolio.html',
    '/projects': '/portfolio.html',
    '/about': '/studio.html',
    '/team': '/studio.html',
    '/contact': '/contact.html',
    '/get-in-touch': '/contact.html',
    '/news': '/press.html',
    '/media': '/press.html',
    '/jobs': '/careers.html',
    '/work': '/careers.html'
  };

  // Check if current path should be redirected
  if (redirectMap[currentPath]) {
    console.log(`Redirecting ${currentPath} to ${redirectMap[currentPath]}`);
    window.location.replace(redirectMap[currentPath]);
    return;
  }

  // Add helpful suggestions based on the URL
  const urlSegments = currentPath.split('/').filter(segment => segment.length > 0);
  if (urlSegments.length > 0) {
    const lastSegment = urlSegments[urlSegments.length - 1];
    
    // Check for common file extensions that might be missing
    const commonExtensions = ['.html', '.htm', '.php', '.asp'];
    const baseName = lastSegment.replace(/\.(html|htm|php|asp)$/, '');
    
    // Try to find a matching page
    const possiblePages = [
      `${baseName}.html`,
      `${baseName}.htm`,
      `${baseName}.php`,
      `${baseName}.asp`
    ];
    
    // This would require server-side checking, but we can at least log it
    console.log(`Possible matches for "${lastSegment}":`, possiblePages);
  }

  // Add keyboard navigation for accessibility
  document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape') {
      if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
      } else {
        window.location.href = '/homepage.html';
      }
    }
    
    // Enter key on focusable elements
    if (e.key === 'Enter' && e.target.classList.contains('contact-btn')) {
      e.target.click();
    }
  });

  // Add a "Go Back" button dynamically if there's a referrer
  if (document.referrer && document.referrer !== window.location.href) {
    const ctaButtons = document.querySelector('.cta-buttons');
    if (ctaButtons) {
      const goBackBtn = document.createElement('a');
      goBackBtn.href = '#';
      goBackBtn.className = 'contact-btn';
      goBackBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Go Back';
      goBackBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.history.back();
      });
      ctaButtons.insertBefore(goBackBtn, ctaButtons.firstChild);
    }
  }

  // Add search functionality to help users find what they're looking for
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const searchSection = document.createElement('div');
    searchSection.className = 'search-section';
    searchSection.innerHTML = `
      <div class="search-box">
        <input type="text" id="pageSearch" placeholder="Search for a page..." />
        <button id="searchBtn" class="search-btn">
          <i class="fas fa-search"></i>
        </button>
      </div>
      <div id="searchResults" class="search-results"></div>
    `;
    heroContent.appendChild(searchSection);

    // Add search functionality
    const searchInput = document.getElementById('pageSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    const availablePages = [
      { name: 'Home', url: 'homepage.html', description: 'Main homepage' },
      { name: 'Portfolio', url: 'portfolio.html', description: 'Our work and projects' },
      { name: 'Studio', url: 'studio.html', description: 'About our team' },
      { name: 'Press', url: 'press.html', description: 'News and media' },
      { name: 'Careers', url: 'careers.html', description: 'Job opportunities' },
      { name: 'Contact', url: 'contact.html', description: 'Get in touch' }
    ];

    function performSearch(query) {
      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }

      const results = availablePages.filter(page => 
        page.name.toLowerCase().includes(query.toLowerCase()) ||
        page.description.toLowerCase().includes(query.toLowerCase())
      );

      if (results.length > 0) {
        searchResults.innerHTML = results.map(page => 
          `<a href="${page.url}" class="search-result-item">
            <strong>${page.name}</strong>
            <span>${page.description}</span>
          </a>`
        ).join('');
      } else {
        searchResults.innerHTML = '<div class="no-results">No matching pages found.</div>';
      }
    }

    searchInput.addEventListener('input', function() {
      performSearch(this.value);
    });

    searchBtn.addEventListener('click', function() {
      performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch(this.value);
      }
    });
  }
});
