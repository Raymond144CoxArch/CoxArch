  // Format project type for display
  const formatProjectType = (type) => {
    switch(type) {
      case 'new-construction':
        return 'New Construction';
      case 'renovation-addition':
        return 'Renovation + Addition';
      default:
        return type;
    }
  };

  // Event Listener Management System
  class EventListenerManager {
    constructor() {
      this.listeners = new Map();
      this.elements = new Map();
    }

    // Store element reference for later cleanup
    storeElement(key, element) {
      this.elements.set(key, element);
      return element;
    }

    // Add event listener with stored reference for cleanup
    addListener(element, event, handler, options = {}) {
      const key = `${element.tagName || 'document'}_${event}_${Date.now()}_${Math.random()}`;
      
      // Store the handler reference
      this.listeners.set(key, {
        element,
        event,
        handler,
        options
      });

      // Add the actual listener
      element.addEventListener(event, handler, options);
      
      return key; // Return key for potential removal
    }

    // Remove specific event listener
    removeListener(key) {
      const listener = this.listeners.get(key);
      if (listener) {
        listener.element.removeEventListener(listener.event, listener.handler, listener.options);
        this.listeners.delete(key);
        return true;
      }
      return false;
    }

    // Remove all listeners for a specific element
    removeListenersForElement(element) {
      const keysToRemove = [];
      for (const [key, listener] of this.listeners) {
        if (listener.element === element) {
          element.removeEventListener(listener.event, listener.handler, listener.options);
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => this.listeners.delete(key));
      return keysToRemove.length;
    }

    // Clean up all listeners
    cleanup() {
      for (const [key, listener] of this.listeners) {
        listener.element.removeEventListener(listener.event, listener.handler, listener.options);
      }
      this.listeners.clear();
      this.elements.clear();
    }

    // Get all stored listener keys for debugging
    getListenerKeys() {
      return Array.from(this.listeners.keys());
    }
  }

  // Mobile menu functions
  window.toggleMobileMenu = function() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
      menu.classList.toggle('active');
    }
  };

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 DOM is ready, starting homepage initialization...');
    
    // Initialize event listener manager
    const eventManager = new EventListenerManager();
    
    // Global variables for gallery animation
    let galleryScrollAnimId = null;

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


    // ===== FEATURED PROJECTS SECTION =====
    // Define loadFromIndexedDB function first (needed by loadFeaturedProjects)
    const loadFromIndexedDB = (key) => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('SlideshowDB', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['slideshow'], 'readonly');
          const store = transaction.objectStore('slideshow');
          const getRequest = store.get(key);

          getRequest.onsuccess = () => resolve(getRequest.result);
          getRequest.onerror = () => reject(getRequest.error);
        };

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('slideshow')) {
            db.createObjectStore('slideshow');
          }
        };
      });
    };

    // Define loadFeaturedProjects function
    const loadFeaturedProjects = async () => {
      logger.info('Loading featured projects');

      // Use the three specified featured projects - convert to match portfolio.js structure
      const featuredProjects = [
        {
          id: 'williams-lake-house',
          name: 'Lake House',
          displayName: 'Lake House',
          type: 'New Construction',
          description: 'Luxury lakefront residence with contemporary design and natural materials.',
          hero_image: 'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
          images: [
            'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-25-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-19-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-25-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-42-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-43-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-42-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-9-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-48-.jpg',
            'images/Portfolio/New Construction/lake-house/lakehouse-20-.jpg'
          ],
          featured: true
        },
        {
          id: 'split-level-makeover',
          name: 'Split Level Makeover', // Changed from 'title' to 'name'
          displayName: 'Split Level Makeover',
          type: 'Renovation + Addition', // Changed from 'category' to 'type'
          description: 'Complete split-level home transformation with modern open concept design.',
          hero_image: 'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg', // Changed from 'heroImage' to 'hero_image'
          images: [
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-7-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-1-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-10-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-11-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-16-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-26-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-24-.jpg',
            'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-30-.jpg'
          ],
          featured: true
        },
        {
          id: 'heavy-timber-pool-house',
          name: 'Heavy Timber Pool House', // Changed from 'title' to 'name'
          displayName: 'Heavy Timber Pool House',
          type: 'Renovation + Addition', // Changed from 'category' to 'type'
          description: 'Custom heavy-timber-pool-house addition with rustic elegance and modern amenities.',
          hero_image: 'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/heavy-timber_01.jpg', // Changed from 'heroImage' to 'hero_image'
          images: [
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/heavy-timber_01.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0503.JPG',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0506.JPG',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0523.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0526.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0527.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0528.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0529.JPG',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0531.jpg',
            'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG-0500.jpg'
          ],
          featured: true
        }
      ];

      // Convert array to object with project IDs as keys for gallery modal
      const portfolioProjects = {};
      featuredProjects.forEach(project => {
        portfolioProjects[project.id] = project;
      });
      
      // Expose projects globally for gallery modal
      window.portfolioProjects = portfolioProjects;

      // NEW: Explicitly tell the gallery modal that the data is ready
      if (window.galleryModal && window.portfolioProjects) {
        window.galleryModal.setProjectsData(window.portfolioProjects);
        logger.success('Portfolio data set in gallery modal from featured projects', { projectCount: Object.keys(portfolioProjects).length });
      } else {
        // Fallback: wait a bit and try again if gallery modal isn't ready yet
        logger.warn('Gallery modal not ready yet for featured projects, will retry');
        setTimeout(() => {
          if (window.galleryModal && window.portfolioProjects) {
            window.galleryModal.setProjectsData(window.portfolioProjects);
            logger.success('Portfolio data set in gallery modal from featured projects (retry)', { projectCount: Object.keys(portfolioProjects).length });
          }
        }, 100);
      }

      logger.success('Using predefined featured projects', { projectCount: featuredProjects.length });
      updateFeaturedProjectsSection(featuredProjects);
      logger.info('Featured projects load complete');
    };

    const updateFeaturedProjectsSection = (featuredProjects) => {
      const featuredGrid = document.querySelector('.featured-projects-grid');
      const galleryTrack = document.getElementById('featuredContinuousGallery');
      if (!featuredGrid) {
        logger.warn('Featured projects grid not found');
        return;
      }

      // Clear existing content
      featuredGrid.innerHTML = '';

      // Add featured projects (max 3 for homepage grid; more can scroll in gallery)
      const projectsToShow = featuredProjects.slice(0, 3);

      projectsToShow.forEach(project => {
        const projectElement = document.createElement('a');
        projectElement.className = 'featured-project';

        // Use hero image if available, otherwise first image, otherwise default
        const imageSrc = project.hero_image ||
          (project.images && project.images.length > 0 ? project.images[0] : null) ||
          'images/Portfolio/contemporary-french/contemporaryfrench (1).png';

        projectElement.innerHTML = `
          <div class="project-image">
            <img src="${imageSrc}" alt="${project.name}" />
          </div>
          <div class="project-info">
            <h3>${project.displayName || project.name}</h3>
            <p class="project-type">${formatProjectType(project.type)}</p>
            <p class="project-description">${project.description || ''}</p>
          </div>
        `;

        // Remove href - we'll handle clicks with JavaScript to open modal
        projectElement.href = '#';
        projectElement.dataset.bound = '1';
        projectElement.setAttribute('data-project-id', project.id);

        featuredGrid.appendChild(projectElement);

        // Add to continuous gallery track as well
        if (galleryTrack) {
          const item = document.createElement('div');
          item.className = 'continuous-gallery-item';
          item.setAttribute('data-project-id', project.id);
          item.innerHTML = `
            <img class="continuous-gallery-image" src="${imageSrc}" alt="${project.name}">
            <div class="continuous-gallery-overlay">
              <div class="continuous-gallery-title">${project.displayName || project.name}</div>
            </div>
          `;
          // Click handler is automatically handled by gallery-modal.js via event delegation
          galleryTrack.appendChild(item);
        }
      });

      logger.success(`Updated featured projects section`, { projectCount: projectsToShow.length });

      // Click handlers are automatically handled by gallery-modal.js via event delegation

      // Initialize or refresh the continuous gallery scroller
      initContinuousGalleryScroller();
    };


    // Now call the function with error handling
    loadFeaturedProjects().catch(error => {
      logger.error('Failed to load featured projects on initial load', error);
    });

    // ===== HOMEPAGE SLIDESHOW - COMPLETE REWORK =====
  const slideshowContainer = document.querySelector('.hero-slideshow');
  const dotsContainer = document.querySelector('.slideshow-dots');
  let currentSlide = 0;
  let slides = [];

  logger.debug('Slideshow containers found', {
    slideshowContainer: !!slideshowContainer,
    dotsContainer: !!dotsContainer
  });

  // Load slideshow images - use the new default project images
  const loadSlideshowImages = async () => {
    logger.info('Loading slideshow images');
    
    // Use the new default project images
    const images = getDefaultImages();
    logger.success('Using default project images', { imageCount: images.length });
    logger.info('Slideshow loading complete');
    return images;
  };


  const getDefaultImages = () => {
    return [
      'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
      'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
      'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
      'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-hero-.jpg',
      'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3069.JPG',
      'images/Portfolio/New Construction/Sabik/sabik-18-.jpg',
      'images/Portfolio/New Construction/Riverchase/riverchase-hero-.jpg'
    ];
  };

  const initializeSlideshow = async () => {
    logger.info('Initializing slideshow');
    const images = await loadSlideshowImages();
    logger.debug('Images to display', { images });

    // Clear existing slides
    slideshowContainer.innerHTML = '';

    // Create slide items
    images.forEach((imageSrc, index) => {
      const slideItem = document.createElement('div');
      slideItem.className = 'slide-item';
      if (index === 0) {slideItem.classList.add('active');}

      slideItem.innerHTML = `
        <img src="${imageSrc}" alt="Hero slide ${index + 1}" class="slide-image" />
      `;

      slideshowContainer.appendChild(slideItem);
    });

    // Update slides reference
    slides = document.querySelectorAll('.slide-item');
    logger.debug('Created slides', { slideCount: slides.length });

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slideshow-dot');
        if (index === 0) {dot.classList.add('active');}
        // Store dot click handler reference for cleanup
        const dotClickHandler = () => {
          currentSlide = index;
          showSlide(currentSlide);
        };
        eventManager.addListener(dot, 'click', dotClickHandler);
        dotsContainer.appendChild(dot);
      });
      logger.debug('Created dots', { dotCount: dotsContainer.children.length });
    }

    // Reset current slide to 0
    currentSlide = 0;
    logger.success('Slideshow initialized');
  };

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[index]) {slides[index].classList.add('active');}

    const dots = document.querySelectorAll('.slideshow-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {dots[index].classList.add('active');}
  };

  const nextSlide = () => {
    if (slides.length > 0) {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
  };

  // Initialize slideshow
  if (slideshowContainer) {
    logger.info('Slideshow container found, initializing');
    initializeSlideshow().catch(error => {
      logger.error('Error initializing slideshow', error);
    });
  } else {
    logger.error('Slideshow container not found');
  }

  // Auto-advance slides
  setInterval(nextSlide, 5000);

  // ===== MOBILE SWIPE FUNCTIONALITY =====
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwipeActive = false;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isSwipeActive = true;
    if (slideshowContainer) {
      slideshowContainer.classList.add('swiping');
    }
  };

  const handleTouchMove = (e) => {
    if (!isSwipeActive) return;
    e.preventDefault(); // Prevent scrolling while swiping
  };

  const handleTouchEnd = (e) => {
    if (!isSwipeActive) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    isSwipeActive = false;
    if (slideshowContainer) {
      slideshowContainer.classList.remove('swiping');
    }
  };

  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe left - next slide
        nextSlide();
        logger.debug('Swipe left detected - next slide');
      } else {
        // Swipe right - previous slide
        previousSlide();
        logger.debug('Swipe right detected - previous slide');
      }
    }
  };

  const previousSlide = () => {
    if (slides.length > 0) {
      currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      showSlide(currentSlide);
    }
  };

  // Add touch event listeners to slideshow container
  if (slideshowContainer) {
    eventManager.addListener(slideshowContainer, 'touchstart', handleTouchStart, { passive: false });
    eventManager.addListener(slideshowContainer, 'touchmove', handleTouchMove, { passive: false });
    eventManager.addListener(slideshowContainer, 'touchend', handleTouchEnd, { passive: false });
    
    logger.info('Mobile swipe functionality added to slideshow');
  }

  // ===== MOBILE SLIDESHOW NEW WINDOW FUNCTIONALITY =====
  
  // Add click handlers to slideshow images (mobile only)
  const addSlideshowClickHandlers = () => {
    const slideshowImages = document.querySelectorAll('.slide-image');
    
    slideshowImages.forEach(image => {
      // Remove existing click handlers to avoid duplicates
      image.removeEventListener('click', handleSlideshowImageClick);
      image.addEventListener('click', handleSlideshowImageClick);
    });
  };
  
  const handleSlideshowImageClick = (e) => {
    // Only open new window on mobile devices
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      
      const imageSrc = e.target.src;
      const imageAlt = e.target.alt || 'Slideshow image';
      
      // Create a new window with the image
      const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (newWindow) {
        // Create HTML content for the new window
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${imageAlt}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                background-color: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                overflow: auto;
              }
              
              .image-container {
                max-width: 100%;
                max-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
              }
              
              .image-container img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
              }
              
              .close-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 24px;
                color: #333;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                z-index: 1000;
                transition: all 0.3s ease;
              }
              
              .close-button:hover {
                background: rgba(255, 255, 255, 1);
                transform: scale(1.1);
              }
              
              .instructions {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                text-align: center;
                z-index: 1000;
              }
              
              @media (max-width: 768px) {
                .close-button {
                  width: 40px;
                  height: 40px;
                  font-size: 20px;
                  top: 10px;
                  right: 10px;
                }
                
                .instructions {
                  bottom: 10px;
                  font-size: 12px;
                  padding: 8px 16px;
                }
              }
            </style>
          </head>
          <body>
            <button class="close-button" onclick="window.close()">×</button>
            <div class="image-container">
              <img src="${imageSrc}" alt="${imageAlt}" />
            </div>
            <div class="instructions">
              Use your browser's zoom controls (Ctrl/Cmd + scroll) to zoom in/out
            </div>
          </body>
          </html>
        `;
        
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Focus the new window
        newWindow.focus();
      } else {
        // Fallback if popup is blocked
        alert('Please allow popups for this site to view images in a new window.');
      }
    }
  };
  
  // Add click handlers after slideshow is initialized
  setTimeout(addSlideshowClickHandlers, 1000);

  // ===== HOMEPAGE UPDATE FUNCTIONS =====

  // Function to refresh slideshow (called from admin dashboard)
  window.refreshSlideshow = async () => {
    logger.info('Refreshing slideshow');
    await initializeSlideshow();
  };

  // Continuous gallery: use Hero images from both new-construction and renovation-addition
  const refreshContinuousGallery = async () => {
    try {
      const track = document.getElementById('featuredContinuousGallery');
      if (!track) {return;}
      
      // Mix of Hero images from both new-construction and renovation-addition projects with project names
      const heroImages = [
        // new-construction Hero Images
        { src: 'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg', name: 'Modern Warehouse' },
        { src: 'images/Portfolio/New Construction/Riverchase/riverchase-hero-.jpg', name: 'Riverchase' },
        { src: 'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg', name: 'Woodland' },
        { src: 'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-hero-.png', name: 'Contemporary French' },
        { src: 'images/Portfolio/New Construction/french-country/french-country-hero-.jpg', name: 'French Country' },
        { src: 'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-hero-.jpg', name: 'Low Country Cabin' },
        { src: 'images/Portfolio/New Construction/melchor-residence/melchor-residence-hero-.jpg', name: 'Melchor Residence' },
        { src: 'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg', name: 'Modern Craftsman' },
        { src: 'images/Portfolio/New Construction/shingle-style/shingle-style-hero-.jpg', name: 'Shingle Style' },
        
        // renovation-addition Hero Images
        { src: 'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-hero-.jpg', name: 'Homeowner Haven' },
        { src: 'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-hero-.jpg', name: 'Selwyn Park Cottage' },
        { src: 'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg', name: 'Split Level Makeover' },
        { src: 'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-hero-.jpg', name: 'Ranch Renovation' },
        { src: 'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-hero-.jpg', name: 'Mid-Century Modern Addition + Renovation' },
        { src: 'images/Portfolio/Renovation+Addition/wine-pavlion/WP6.jpg', name: 'Wine Pavilion' }
      ];

      // Stop any existing animation
      if (typeof galleryScrollAnimId !== 'undefined' && galleryScrollAnimId) {
        cancelAnimationFrame(galleryScrollAnimId);
        galleryScrollAnimId = null;
      }
      
      // Clear and rebuild
      track.innerHTML = '';
      track.removeAttribute('data-duplicated');
      
      heroImages.forEach(imageData => {
        const item = document.createElement('div');
        item.className = 'continuous-gallery-item';
        item.innerHTML = `
          <img class="continuous-gallery-image" src="${imageData.src}" alt="${imageData.name}" />
          <div class="continuous-gallery-overlay">
            <div class="continuous-gallery-title">${imageData.name}</div>
          </div>
        `;
        
        // Named functions for hover and click effects with stored references
        const mouseEnterHandler = () => {
          item.style.transform = 'scale(1.05)';
          item.style.border = '2px solid #ff6b35';
          item.style.transition = 'all 0.3s ease';
          const overlay = item.querySelector('.continuous-gallery-overlay');
          if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.transition = 'opacity 0.3s ease';
          }
        };
        
        const mouseLeaveHandler = () => {
          item.style.transform = 'scale(1)';
          item.style.border = 'none';
          const overlay = item.querySelector('.continuous-gallery-overlay');
          if (overlay) {
            overlay.style.opacity = '0';
          }
        };
        
        const clickHandler = () => {
          // Try to find the project ID and open modal, otherwise navigate to portfolio page
          const projectName = imageData.name;
          const project = window.portfolioProjects?.find(p => p.name === projectName);
          if (project && window.galleryModal) {
            window.galleryModal.openProject(project.id);
          } else {
            // Fallback: navigate to portfolio page
            window.location.href = 'portfolio.html';
          }
        };
        
        // Add event listeners with stored references for cleanup
        eventManager.addListener(item, 'mouseenter', mouseEnterHandler);
        eventManager.addListener(item, 'mouseleave', mouseLeaveHandler);
        eventManager.addListener(item, 'click', clickHandler);
        
        track.appendChild(item);
      });
      
      // Restart scroller
      initContinuousGalleryScroller();
      logger.success('Continuous gallery updated with Hero images from both project types');
    } catch (e) {
      logger.warn('Error refreshing continuous gallery', e);
    }
  };

  // Named functions for window event listeners with stored references
  const storageEventHandler = (e) => {
    logger.debug('Storage event received', { key: e.key });
    if (e.key === 'homepageSlideshow') {
      logger.info('Updating slideshow from storage event');
      initializeSlideshow().catch(error => {
        logger.error('Failed to initialize slideshow from storage event', error);
      });
    } else if (e.key === 'adminProjectsUpdated') {
      logger.info('Updating featured projects from storage event');
      loadFeaturedProjects().catch(error => {
        logger.error('Failed to load featured projects from storage event', error);
      });
    } else if (e.key === 'homepageContinuousGallery') {
      logger.info('Updating continuous gallery from storage event');
      refreshContinuousGallery().catch(error => {
        logger.error('Failed to refresh continuous gallery from storage event', error);
      });
    }
  };

  const slideshowUpdatedHandler = (e) => {
    logger.debug('Custom event received', { detail: e.detail });
    initializeSlideshow().catch(error => {
      logger.error('Failed to initialize slideshow from custom event', error);
    });
  };

  // Store window event listener references for cleanup
  eventManager.addListener(window, 'storage', storageEventHandler);
  eventManager.addListener(window, 'slideshowUpdated', slideshowUpdatedHandler);

  // Debug function
  window.debugHomepageSlideshow = () => {
    logger.debug('Homepage debug info', {
      localStorage: localStorage.getItem('homepageSlideshow'),
      parsed: JSON.parse(localStorage.getItem('homepageSlideshow') || '[]'),
      currentSlides: document.querySelectorAll('.slide-item').length,
      currentDots: document.querySelectorAll('.slideshow-dot').length
    });
  };

  // Force refresh function
  window.forceRefreshSlideshow = () => {
    logger.info('Force refreshing slideshow');
    initializeSlideshow();
  };

  // Test function to check localStorage
  window.checkLocalStorage = () => {
    const stored = localStorage.getItem('homepageSlideshow');
    logger.debug('Checking localStorage', {
      rawData: stored,
      parsedData: stored ? JSON.parse(stored) : null,
      imageCount: stored ? JSON.parse(stored).length : 0
    });
  };

  // Test function to set test images
  window.setTestImages = () => {
    logger.info('Setting test images');
    const testImages = [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzOTlkYiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3QgSW1hZ2U8L3RleHQ+PC9zdmc+',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzI3YWU2MCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3QgSW1hZ2UgMjwvdGV4dD48L3N2Zz4='
    ];
    localStorage.setItem('homepageSlideshow', JSON.stringify(testImages));
    logger.success('Test images set in localStorage');
    initializeSlideshow().catch(error => {
      logger.error('Failed to initialize slideshow with test images', error);
    });
  };

  // ---- Testimonial Slider (Homepage) ----
  const slider = document.getElementById('homepageTestimonialSlider');
  if (slider) {
    const testimonials = [
      {
        name: 'Jane D.',
        date: 'July 2024',
        rating: 5,
        image: 'images/People/person1.jpg',
        text: 'Cox Architecture & Design completely transformed our home. Every detail was handled with care and creativity. Highly recommend!'
      },
      {
        name: 'Mark S.',
        date: 'May 2023',
        rating: 4,
        image: 'images/People/person2.jpg',
        text: 'Professional, responsive, and truly talented. We love the end result of our addition project!'
      },
      {
        name: 'Angela R.',
        date: 'March 2023',
        rating: 5,
        image: 'images/People/person3.jpg',
        text: 'From concept to completion, they were fantastic. We especially appreciated their attention to detail and communication.'
      },
      {
        name: 'Terry L.',
        date: 'January 2022',
        rating: 5,
        image: 'images/People/person4.jpg',
        text: 'We\'ve worked with several architects, but this team is the best. They listened and delivered exactly what we needed.'
      },
      {
        name: 'Emily C.',
        date: 'November 2021',
        rating: 5,
        image: 'images/People/person5.jpg',
        text: 'Our kitchen renovation is stunning thanks to Cox Architecture. They made the process smooth and enjoyable.'
      }
    ];

    const createStars = (count) => {
      let stars = '';
      for (let i = 0; i < 5; i++) {
        stars += i < count ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
      }
      return stars;
    };

    // Duplicate for looping effect
    const repeated = [...testimonials, ...testimonials];

    repeated.forEach(t => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <div class="testimonial-header">
          <img src="${t.image}" alt="${t.name}">
          <div class="testimonial-name-date">
            <span class="testimonial-name">${t.name}</span>
            <span class="testimonial-date">${t.date}</span>
            <div class="testimonial-stars">${createStars(t.rating)}</div>
          </div>
        </div>
        <p class="testimonial-text">${t.text}</p>
      `;
      slider.appendChild(card);
    });

    // Auto-scroll testimonials
    let scrollPosition = 0;
    const scrollSpeed = 1;
    // const scrollInterval = setInterval(() => { // Unused variable
    setInterval(() => {
      scrollPosition += scrollSpeed;
      slider.scrollLeft = scrollPosition;

      // Reset scroll position when reaching the end
      if (scrollPosition >= slider.scrollWidth / 2) {
        scrollPosition = 0;
      }
    }, 50);
  }

  // Named functions for additional window event listeners
  const adminProjectsStorageHandler = (e) => {
    if (e.key === 'adminProjects') {
      logger.info('Admin projects updated, refreshing featured projects');
      loadFeaturedProjects().catch(error => {
        logger.error('Failed to load featured projects from admin storage event', error);
      });
    }
  };

  const featuredProjectsUpdatedHandler = () => {
    logger.info('Featured projects update event received');
    loadFeaturedProjects().catch(error => {
      logger.error('Failed to load featured projects from update event', error);
    });
  };

  const continuousGalleryUpdatedHandler = () => {
    logger.info('Continuous gallery update event received');
    refreshContinuousGallery().catch(error => {
      logger.error('Failed to refresh continuous gallery from update event', error);
    });
  };

  // Store additional window event listener references
  eventManager.addListener(window, 'storage', adminProjectsStorageHandler);
  eventManager.addListener(window, 'featuredProjectsUpdated', featuredProjectsUpdatedHandler);
  eventManager.addListener(window, 'continuousGalleryUpdated', continuousGalleryUpdatedHandler);

  // ===== PROJECT MODAL FUNCTIONALITY =====
  // Note: Old modal functionality removed - now using gallery-modal.js

  // Old modal functionality removed - now using gallery-modal.js

  // Initial continuous gallery refresh from admin-managed images
  setTimeout(refreshContinuousGallery, 350);

  // ===== Continuous Gallery: Build and Auto-scroll =====
  const initContinuousGalleryFromDefaults = () => {
    // First, create the default project data structure
    const defaultProjects = {
      'williams-lake-house': {
        id: 'williams-lake-house',
        name: 'Lake House',
        type: 'new-construction',
        description: 'Luxury lakefront residence with contemporary design and natural materials.',
        hero_image: 'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
        images: [
          'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
          'images/Portfolio/New Construction/lake-house/lakehouse-1-.jpg',
          'images/Portfolio/New Construction/lake-house/lakehouse-9-.jpg',
          'images/Portfolio/New Construction/lake-house/lakehouse-18-.jpg'
        ],
        featured: true
      },
      'split-level-makeover': {
        id: 'split-level-makeover',
        name: 'split-level-makeover',
        type: 'renovation-addition',
        description: 'Complete split-level home transformation with modern open concept design.',
        hero_image: 'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
        images: [
          'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
          'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-10-.jpg',
          'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-19-.jpg',
          'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-20-.jpg'
        ],
        featured: true
      },
      'heavy-timber-pool-house': {
        id: 'heavy-timber-pool-house',
        name: 'heavy-timber-pool-house',
        type: 'renovation-addition',
        description: 'Custom heavy-timber-pool-house addition with rustic elegance and modern amenities.',
        hero_image: 'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/heavy-timber_01.jpg',
        images: [
          'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/heavy-timber_01.jpg',
          'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0503.JPG',
          'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0506.JPG',
          'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0523.jpg'
        ],
        featured: true
      }
    };

    // Create portfolioProjects object from default data
    const portfolioProjects = {};
    Object.keys(defaultProjects).forEach(projectId => {
      portfolioProjects[projectId] = { ...defaultProjects[projectId] };
    });

    // Note: Not setting window.portfolioProjects here to avoid overriding featured projects data

    // Build continuous gallery from the data
    const galleryTrack = document.getElementById('featuredContinuousGallery');
    if (!galleryTrack) { return; }
    if (galleryTrack.childElementCount > 0) { return; } // already populated by CMS

    const cards = document.querySelectorAll('.featured-projects-grid .featured-project');
    if (!cards || cards.length === 0) { return; }

    cards.forEach(card => {
      const titleEl = card.querySelector('.project-info h3');
      const imgEl = card.querySelector('.project-image img');
      const title = titleEl ? titleEl.textContent.trim() : '';
      const src = imgEl ? imgEl.getAttribute('src') : '';

      const item = document.createElement('div');
      item.className = 'continuous-gallery-item';
      item.innerHTML = `
        <img class="continuous-gallery-image" src="${src}" alt="${title}">
        <div class="continuous-gallery-overlay">
          <div class="continuous-gallery-title">${title}</div>
        </div>
      `;
      
      // Named function for click handler with stored reference
      const clickHandler = () => {
        // Try to find the project ID and open modal, otherwise navigate to portfolio page
        const project = window.portfolioProjects && Object.values(window.portfolioProjects).find(p => p.name === title);
        if (project && window.galleryModal) {
          window.galleryModal.openProject(project.id);
        } else {
          // Fallback: navigate to portfolio page
          const normalized = { title, heroImage: src };
          localStorage.setItem('homepageFeaturedProject', JSON.stringify(normalized));
          window.location.href = 'portfolio.html';
        }
      };
      
      eventManager.addListener(item, 'click', clickHandler);
      galleryTrack.appendChild(item);
    });

    initContinuousGalleryScroller();
  };

  function initContinuousGalleryScroller() {
    const viewport = document.querySelector('.continuous-gallery-viewport');
    const track = document.getElementById('featuredContinuousGallery');
    if (!viewport || !track) {return;}

    // If not enough items, skip
    if (track.children.length === 0) {return;}

    // Duplicate items to enable seamless loop
    // const neededDup = track.children.length; // Unused variable
    const existingDupAttr = track.getAttribute('data-duplicated');
    if (!existingDupAttr) {
      const clones = [];
      Array.from(track.children).forEach(child => {
        const clone = child.cloneNode(true);
        clones.push(clone);
      });
      clones.forEach(c => track.appendChild(c));
      track.setAttribute('data-duplicated', '1');
    }

    let offset = 0;
    const speed = 0.35; // pixels per frame ~ 21px/sec @60fps

    const step = () => {
      offset -= speed;
      const first = track.firstElementChild;
      if (first) {
        const firstWidth = first.getBoundingClientRect().width + 24; // include gap
        if (Math.abs(offset) >= firstWidth) {
          // move first to end and adjust offset
          track.appendChild(first);
          offset += firstWidth;
        }
      }
      track.style.transform = `translateX(${offset}px)`;
      galleryScrollAnimId = requestAnimationFrame(step);
    };

    if (galleryScrollAnimId) {cancelAnimationFrame(galleryScrollAnimId);}
    galleryScrollAnimId = requestAnimationFrame(step);

    // Named functions for viewport hover effects with stored references
    const viewportMouseEnterHandler = () => {
      if (galleryScrollAnimId) {cancelAnimationFrame(galleryScrollAnimId);}
      galleryScrollAnimId = null;
    };
    
    const viewportMouseLeaveHandler = () => {
      if (!galleryScrollAnimId) {galleryScrollAnimId = requestAnimationFrame(step);}
    };
    
    // Store viewport event listener references for cleanup
    eventManager.addListener(viewport, 'mouseenter', viewportMouseEnterHandler);
    eventManager.addListener(viewport, 'mouseleave', viewportMouseLeaveHandler);
  }

  // Build from defaults on initial load (in case CMS not present)
  setTimeout(initContinuousGalleryFromDefaults, 400);

  // Gallery modal is automatically initialized by gallery-modal.js
  // No need to initialize it here - it will handle everything automatically

  // Mobile menu toggle already initialized above

  // Expose event manager for debugging and cleanup
  window.homepageEventManager = eventManager;
  
  // Example usage for cleanup (if needed):
  // window.homepageEventManager.cleanup(); // Remove all event listeners
  // window.homepageEventManager.getListenerKeys(); // Get all listener keys for debugging
  
  logger.success('Homepage event listeners initialized');
  logger.info('Event manager available at window.homepageEventManager');

  // ---- Gallery Modal Integration ----
  // Ensure the gallery modal is properly initialized for homepage project cards
  if (window.galleryModal) {
    logger.info('Gallery modal found, setting up homepage integration');
    
    // Ensure project data is set in the modal
    if (window.portfolioProjects) {
      window.galleryModal.setProjectsData(window.portfolioProjects);
      logger.success('Project data set in gallery modal for homepage');
    } else {
      logger.warn('No portfolio projects data available for gallery modal');
    }
    
    // Add specific event listeners for homepage project cards
    const homepageProjectCards = document.querySelectorAll('.featured-projects-grid .featured-project[data-project-id]');
    homepageProjectCards.forEach(card => {
      // Remove any existing event listeners to avoid duplicates
      card.removeEventListener('click', handleProjectCardClick);
      
      // Add new event listener
      card.addEventListener('click', handleProjectCardClick);
    });
    
    logger.info(`Added click listeners to ${homepageProjectCards.length} homepage project cards`);
  } else {
    logger.error('Gallery modal not available - project cards will not work');
  }
  
  // Project card click handler function
  function handleProjectCardClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const projectId = this.getAttribute('data-project-id');
    logger.info('Homepage project card clicked', { projectId, modalReady: window.galleryModal?.isReady() });
    
    if (projectId && window.galleryModal) {
      try {
        window.galleryModal.openProject(projectId);
      } catch (error) {
        logger.error('Failed to open project from homepage card', error, { projectId });
      }
    } else {
      logger.warn('Cannot open project - missing projectId or gallery modal', { 
        hasProjectId: !!projectId, 
        hasGalleryModal: !!window.galleryModal 
      });
    }
  }
});


