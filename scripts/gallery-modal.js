// Gallery Modal System
// Handles project gallery modal with keyboard navigation, accessibility, and touch support

// Mobile viewport height fix for gallery modal
// This handles the dynamic viewport height changes in mobile browsers
(function() {
    'use strict';
    
    // Function to set the viewport height CSS custom property
    function setViewportHeight() {
        // Get the actual viewport height
        const vh = window.innerHeight * 0.01;
        // Set the CSS custom property
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Optional: Log for debugging
        if (window.logger) {
            window.logger.info('Viewport height updated', { vh: vh, innerHeight: window.innerHeight });
        }
    }
    
    // Set the initial viewport height
    setViewportHeight();
    
    // Update viewport height on resize (handles orientation changes and address bar show/hide)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce the resize events to avoid excessive calculations
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setViewportHeight, 100);
    });
    
    // Handle orientation change specifically for mobile devices
    window.addEventListener('orientationchange', function() {
        // Small delay to allow the browser to complete the orientation change
        setTimeout(setViewportHeight, 250);
    });
    
    // Handle visual viewport changes (for browsers that support it)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setViewportHeight, 50);
        });
    }
    
    // Additional handling for iOS Safari and other mobile browsers
    // that change viewport height when scrolling
    let lastHeight = window.innerHeight;
    window.addEventListener('scroll', function() {
        const currentHeight = window.innerHeight;
        if (Math.abs(currentHeight - lastHeight) > 50) { // Significant height change
            setViewportHeight();
            lastHeight = currentHeight;
        }
    }, { passive: true });
    
    // Force recalculation when modal is opened/closed
    // This will work with your existing modal system
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList && (
                    target.classList.contains('project-modal') || 
                    target.classList.contains('no-scroll')
                )) {
                    // Modal state changed, recalculate viewport
                    setTimeout(setViewportHeight, 100);
                }
            }
        });
    });
    
    // Observe changes to body class (for no-scroll) and modal elements
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    // Also observe the modal container if it exists
    document.addEventListener('DOMContentLoaded', function() {
        const modalContainer = document.querySelector('.project-modal');
        if (modalContainer) {
            observer.observe(modalContainer, { attributes: true, attributeFilter: ['class'] });
        }
    });
    
    // Cleanup function (if you need to remove listeners)
    window.cleanupViewportFix = function() {
        observer.disconnect();
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', setViewportHeight);
        }
    };
})();

class GalleryModal {
    constructor(config = {}) {
        // Centralized configuration for easy customization
        this.config = {
            swipeThreshold: 50,
            transitionDuration: 300, // Matches CSS transition time
            modalActiveClassName: 'active',
            noScrollClassName: 'no-scroll',
            fullscreenClassName: 'fullscreen-mode',
            mainImageLoadingClassName: 'loading',
            thumbnailActiveClassName: 'active',
            ...config
        };

        this.modal = null;
        this.elements = {};
        this.projectsData = null;
        this.currentProject = null;
        this.currentIndex = 0;
        this.isFullscreen = false;
        this.preloadedImages = new Set();
        this.lastFocusedElement = null;
        this.touchStartX = 0;

        this.init();
    }

    async init() {
        this.setupModal();
        if (this.modal) {
            this.setupEventListeners();
        }
        logger.success('Gallery Modal initialized');
    }

    /**
     * Set projects data from external source
     * This method should be called by other scripts once the data is ready
     * @param {Object} data - Project data object with project IDs as keys
     */
    setProjectsData(data) {
        if (data && Object.keys(data).length > 0) {
            this.projectsData = data;
            logger.success('Project data set successfully', { projectCount: Object.keys(data).length });
        } else {
            logger.error('Failed to set project data: provided data is empty or invalid');
            this.showError("Some content couldn't be loaded. Please refresh the page.");
        }
    }

    /**
     * Show user-friendly error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        // You can implement user-friendly error display here
        // For now, we'll use the logger's notification system
        if (window.logger && window.logger.showUserNotification) {
            window.logger.showUserNotification(message, 'error');
        } else {
            // Fallback to alert if logger not available
            alert(message);
        }
    }

    formatProjectType(type) {
        switch(type) {
            case 'new-construction':
                return 'New Construction';
            case 'renovation-addition':
                return 'Renovation + Addition';
            default:
                return type;
        }
    }

    setupModal() {
        this.modal = document.getElementById('projectModal');
        if (!this.modal) {
            logger.error('Project modal element not found in the DOM');
            return;
        }

        this.elements = {
            modal: this.modal,
            backdrop: this.modal.querySelector('.modal-backdrop'),
            closeBtn: this.modal.querySelector('.modal-close-btn'),
            title: this.modal.querySelector('#modalTitle'),
            projectType: this.modal.querySelector('#modalDescription'),
            mainImage: this.modal.querySelector('#mainImage'),
            mainImageContainer: this.modal.querySelector('.main-image-container'),
            thumbnailsColumn: this.modal.querySelector('.thumbnails-column'),
            thumbnailsContainer: this.modal.querySelector('#thumbnailsContainer'),
            prevBtn: this.modal.querySelector('.nav-prev'),
            nextBtn: this.modal.querySelector('.nav-next'),
        };

        const missingElements = Object.entries(this.elements).filter(([, el]) => !el).map(([key]) => key);
        if (missingElements.length > 0) {
            logger.error('Missing required modal elements', null, { missingElements });
            this.modal = null; // Prevent further operations
        }
        
        // Setup mobile close button positioning
        this.setupMobileCloseButton();
        
        // Setup mobile thumbnail toggle
        this.setupMobileThumbnailToggle();
        
        // Handle mobile browser UI
        this.handleMobileBrowserUI();
    }
    
    setupMobileCloseButton() {
        if (!this.elements.closeBtn) return;
        
        // Function to check if we're on mobile
        const isMobile = () => window.innerWidth <= 768;
        
        // Function to position close button for mobile
        const positionCloseButtonForMobile = () => {
            if (isMobile()) {
                // Override inline styles for mobile - just orange X, no background or shadow
                this.elements.closeBtn.style.position = 'absolute';
                this.elements.closeBtn.style.top = '0.5rem';
                this.elements.closeBtn.style.right = '0.5rem';
                this.elements.closeBtn.style.zIndex = '10000';
                this.elements.closeBtn.style.background = 'transparent';
                this.elements.closeBtn.style.borderRadius = '0';
                this.elements.closeBtn.style.width = 'auto';
                this.elements.closeBtn.style.height = 'auto';
                this.elements.closeBtn.style.display = 'flex';
                this.elements.closeBtn.style.alignItems = 'center';
                this.elements.closeBtn.style.justifyContent = 'center';
                this.elements.closeBtn.style.boxShadow = 'none';
                this.elements.closeBtn.style.fontSize = '24px';
                this.elements.closeBtn.style.color = '#ff6600';
                this.elements.closeBtn.style.border = 'none';
                this.elements.closeBtn.style.cursor = 'pointer';
                this.elements.closeBtn.style.fontWeight = 'bold';
                this.elements.closeBtn.style.visibility = 'visible';
                this.elements.closeBtn.style.opacity = '1';
                this.elements.closeBtn.style.outline = 'none';
                this.elements.closeBtn.style.flex = 'none';
                this.elements.closeBtn.style.margin = '0';
                this.elements.closeBtn.style.padding = '0';
                this.elements.closeBtn.style.transform = 'none';
                this.elements.closeBtn.style.left = 'auto';
                this.elements.closeBtn.style.bottom = 'auto';
            }
        };
        
        // Position on initial load
        positionCloseButtonForMobile();
        
        // Position on window resize
        window.addEventListener('resize', positionCloseButtonForMobile);
    }
    
    setupMobileThumbnailToggle() {
        if (!this.elements.thumbnailsColumn) return;
        
        // Function to check if we're on mobile
        // Always show thumbnails - no toggle button needed
        this.elements.thumbnailsColumn.classList.add('expanded');
    }
    
    // Handle mobile browser UI (address bar, navigation buttons)
    handleMobileBrowserUI() {
        if (!this.isMobileDevice()) return;
        
        // Function to adjust modal height for mobile browser UI
        const adjustForMobileBrowser = () => {
            if (!this.modal) return;
            
            const modal = this.modal;
            const modalContainer = this.elements.modalContainer;
            
            if (!modal || !modalContainer) return;
            
            // Get actual viewport height (excluding browser UI)
            const actualViewportHeight = window.innerHeight;
            const documentHeight = document.documentElement.clientHeight;
            
            // Use the smaller of the two to avoid browser UI overlap
            const safeHeight = Math.min(actualViewportHeight, documentHeight);
            
            // Apply safe height to modal
            modal.style.height = `${safeHeight}px`;
            modalContainer.style.height = `${safeHeight}px`;
            
            logger.debug('Adjusted modal height for mobile browser UI', {
                actualViewportHeight,
                documentHeight,
                safeHeight
            });
        };
        
        // Adjust on initial load
        adjustForMobileBrowser();
        
        // Adjust when orientation changes or browser UI shows/hides
        window.addEventListener('resize', adjustForMobileBrowser);
        window.addEventListener('orientationchange', () => {
            // Delay to allow orientation change to complete
            setTimeout(adjustForMobileBrowser, 100);
        });
        
        // Adjust when modal opens (only if openModal exists)
        if (this.openModal && typeof this.openModal === 'function') {
            const originalOpenModal = this.openModal.bind(this);
            this.openModal = (...args) => {
                const result = originalOpenModal(...args);
                setTimeout(adjustForMobileBrowser, 100);
                return result;
            };
        }
    }
    
    // Debug function to check modal layout
    debugModalLayout() {
        if (!this.modal) {
            logger.error('Modal not found for layout debugging');
            return;
        }
        
        const elements = {
            modal: this.modal,
            header: this.elements.modalHeader,
            title: this.elements.title,
            projectType: this.elements.projectType,
            closeBtn: this.elements.closeBtn,
            thumbnailsColumn: this.elements.thumbnailsColumn,
            mainImageContainer: this.elements.mainImageContainer
        };
        
        logger.info('Modal layout debug info:', {
            isMobile: this.isMobileDevice(),
            currentProject: this.currentProject?.name || 'None',
            elements: Object.entries(elements).map(([name, element]) => ({
                name,
                exists: !!element,
                visible: element ? window.getComputedStyle(element).display !== 'none' : false,
                classes: element ? element.className : 'N/A'
            }))
        });
    }

    setupEventListeners() {
        // Main interactions
        this.elements.closeBtn.addEventListener('click', this.closeModal.bind(this));
        this.elements.backdrop.addEventListener('click', this.closeModal.bind(this));
        this.elements.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.previousImage();
        });
        this.elements.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextImage();
        });
        
        // Use event delegation for thumbnails to improve performance
        this.elements.thumbnailsContainer.addEventListener('click', this.handleThumbnailClick.bind(this));
        this.elements.thumbnailsContainer.addEventListener('keydown', this.handleThumbnailKeydown.bind(this));

        // Touch and keyboard support
        this.elements.mainImageContainer.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.elements.mainImageContainer.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        // Resize and scroll
        window.addEventListener('resize', this.updateScrollIndicators.bind(this));
        this.elements.thumbnailsContainer.addEventListener('scroll', this.updateScrollIndicators.bind(this));

        // Fullscreen toggle via main image click
        this.elements.mainImageContainer.addEventListener('click', this.handleMainImageClick.bind(this));
    }

    // Event Handlers
    handleThumbnailClick(e) {
        const clickedThumbnail = e.target.closest('.thumbnail');
        if (clickedThumbnail) {
            const index = parseInt(clickedThumbnail.dataset.index, 10);
            this.setActiveIndex(index);
        }
    }

    handleThumbnailKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleThumbnailClick(e);
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = this.touchStartX - touchEndX;
        if (Math.abs(diff) > this.config.swipeThreshold) {
            diff > 0 ? this.nextImage() : this.previousImage();
        }
    }

    handleKeyboard(e) {
        if (!this.modal.classList.contains(this.config.modalActiveClassName)) return;
        
        const isFullscreen = this.modal.classList.contains(this.config.fullscreenClassName);

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                isFullscreen ? this.closeFullscreen() : this.closeModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextImage();
                break;
            case 'Tab':
                this.handleTabNavigation(e);
                break;
        }
    }

    handleTabNavigation(e) {
        const focusableElements = this.modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    // Modal Operations
    async openProject(projectId) {
        // Check if modal is properly initialized
        if (!this.modal) {
            logger.error('Modal not initialized - cannot open project', { projectId });
            this.showError("Gallery is not ready. Please refresh the page and try again.");
            return;
        }

        // Check if we have project data
        if (!this.projectsData || Object.keys(this.projectsData).length === 0) {
            logger.warn('Portfolio data not available', { projectId });
            this.showError("Project data is not available. Please try again later.");
            return;
        }

        if (!this.projectsData[projectId]) {
            logger.error(`Project not found for ID: ${projectId}`, null, { availableProjects: Object.keys(this.projectsData) });
            this.showError("Project not found. Please try a different project.");
            return;
        }

        this.currentProject = this.projectsData[projectId];
        this.currentIndex = 0;
        this.lastFocusedElement = document.activeElement;
        
        this.updateModalContent();
        this.showModal();
        this.preloadImages(0, 2);
    }

    /**
     * Check if portfolio data is available
     * @returns {boolean} - True if data is loaded and available
     */
    isDataAvailable() {
        return this.projectsData && Object.keys(this.projectsData).length > 0;
    }

    /**
     * Check if modal is ready to use
     * @returns {boolean} - True if modal is initialized and ready
     */
    isReady() {
        return this.modal && this.elements && Object.keys(this.elements).length > 0;
    }

    /**
     * Get data loading status
     * @returns {Object} - Status information about data loading
     */
    getDataStatus() {
        return {
            hasData: this.isDataAvailable(),
            projectCount: this.projectsData ? Object.keys(this.projectsData).length : 0,
            isReady: this.isReady(),
            modalInitialized: !!this.modal
        };
    }

    async updateModalContent() {
        const { name, type, images, hero_image } = this.currentProject;
        
        this.elements.title.textContent = name;
        this.elements.projectType.textContent = this.formatProjectType(type);

        const orderedImages = this.orderImages(images, hero_image);
        this.currentProject.images = orderedImages;
        
        if (orderedImages.length === 0) {
            logger.error(`No valid images found for project: ${name}`, null, { projectName: name });
            return;
        }

        // Show loading state
        this.elements.mainImage.classList.add(this.config.mainImageLoadingClassName);
        
        await this.setMainImage(orderedImages[0], 0);
        this.updateThumbnails(orderedImages);
        this.updateNavigationButtons();
        
        // Preload more images in the background
        this.preloadImages(0, Math.min(5, orderedImages.length));
        
        // Start preloading all remaining images in the background
        this.preloadAllImagesInBackground();
    }

    orderImages(images, hero_image) {
        const orderedImages = [...images];
        if (hero_image) {
            const heroIndex = orderedImages.indexOf(hero_image);
            if (heroIndex > -1) {
                const [hero] = orderedImages.splice(heroIndex, 1);
                orderedImages.unshift(hero);
            }
        }
        return orderedImages;
    }

    async setMainImage(imageSrc, index) {
        this.elements.mainImage.classList.add(this.config.mainImageLoadingClassName);
        
        try {
            await this.preloadImage(imageSrc);
            this.elements.mainImage.src = imageSrc;
            this.elements.mainImage.alt = `${this.currentProject.name} - Image ${index + 1}`;
            this.updateActiveThumbnail(index);
            this.updateNavigationButtons();
        } catch (error) {
            logger.error('Failed to load main image', error, { imageSrc });
            // Consider displaying a placeholder or error message
        } finally {
            this.elements.mainImage.classList.remove(this.config.mainImageLoadingClassName);
        }
    }

    updateThumbnails(images) {
        this.elements.thumbnailsContainer.innerHTML = '';
        images.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.alt = `${this.currentProject.name} - Image ${index + 1}`;
            thumbnail.className = 'thumbnail lazy-loading';
            thumbnail.setAttribute('data-index', index);
            thumbnail.setAttribute('tabindex', '0');
            if (index === 0) {
                thumbnail.classList.add(this.config.thumbnailActiveClassName);
            }
            
            // Set up lazy loading for thumbnails
            if (window.lazyLoader) {
                window.lazyLoader.observe(thumbnail, imageSrc, {
                    width: 120,
                    height: 90,
                    onLoad: (loadedImg) => {
                        // Add smooth transition for thumbnails
                        loadedImg.style.transition = 'opacity 0.2s ease-in-out';
                        loadedImg.style.opacity = '0';
                        loadedImg.offsetHeight; // Trigger reflow
                        loadedImg.style.opacity = '1';
                    },
                    onError: (errorImg, src) => {
                        console.warn('Failed to load thumbnail:', src);
                    }
                });
            } else {
                // Fallback: load immediately
                thumbnail.src = imageSrc;
            }
            
            this.elements.thumbnailsContainer.appendChild(thumbnail);
        });
        setTimeout(() => this.updateScrollIndicators(), 100);
    }

    updateActiveThumbnail(index) {
        const thumbnails = this.elements.thumbnailsContainer.querySelectorAll('.thumbnail');
        if (!thumbnails[index]) return;

        thumbnails.forEach(thumb => thumb.classList.remove(this.config.thumbnailActiveClassName));
        thumbnails[index].classList.add(this.config.thumbnailActiveClassName);
        thumbnails[index].focus();
        thumbnails[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    updateNavigationButtons() {
        const totalImages = this.currentProject.images.length;
        this.elements.prevBtn.setAttribute('aria-label', `Previous image (${this.currentIndex + 1}/${totalImages}) - loops to end`);
        this.elements.nextBtn.setAttribute('aria-label', `Next image (${this.currentIndex + 2 > totalImages ? 1 : this.currentIndex + 2}/${totalImages}) - loops to beginning`);
    }

    // Navigation and State
    nextImage() {
        const totalImages = this.currentProject.images.length;
        const newIndex = (this.currentIndex + 1) % totalImages;
        this.setActiveIndex(newIndex);
    }

    previousImage() {
        const totalImages = this.currentProject.images.length;
        const newIndex = (this.currentIndex - 1 + totalImages) % totalImages;
        this.setActiveIndex(newIndex);
    }

    setActiveIndex(index) {
        if (this.isLoading || index === this.currentIndex) return;
        this.currentIndex = index;
        this.setMainImage(this.currentProject.images[index], index);
        
        // Preload more surrounding images for smoother navigation
        this.preloadImages(index - 2, 5); // Preload 5 images around current position
    }

    showModal() {
        this.modal.classList.add(this.config.modalActiveClassName);
        document.documentElement.classList.add(this.config.noScrollClassName);
        document.body.classList.add('modal-open');
        setTimeout(() => {
            this.elements.closeBtn.focus();
        }, this.config.transitionDuration);
    }

    closeModal() {
        this.modal.classList.remove(this.config.modalActiveClassName);
        document.documentElement.classList.remove(this.config.noScrollClassName);
        document.body.classList.remove('modal-open');
        this.toggleFullscreen(false); // Ensure fullscreen is off
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    }

    // Handle main image click - mobile opens new window, desktop toggles fullscreen
    handleMainImageClick(e) {
        // Check if we're on mobile
        if (this.isMobileDevice()) {
            e.preventDefault();
            e.stopPropagation();
            this.openImageInNewWindow();
        } else {
            // Desktop behavior - toggle fullscreen
            this.toggleFullscreen();
        }
    }

    // Check if device is mobile
    isMobileDevice() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Open current image in a new window for mobile zooming
    openImageInNewWindow() {
        if (!this.currentProject || !this.currentProject.images || !this.currentProject.images[this.currentIndex]) {
            logger.error('No image available to open in new window');
            return;
        }

        const currentImageSrc = this.currentProject.images[this.currentIndex];
        const projectName = this.currentProject.name || 'Project Image';
        
        // Create a new window with the image
        const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        if (newWindow) {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${projectName} - Cox Architecture & Design</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            background: #000;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            font-family: 'Inter', sans-serif;
                        }
                        
                        .image-container {
                            position: relative;
                            max-width: 100%;
                            max-height: 100vh;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        
                        .image-container img {
                            max-width: 100%;
                            max-height: 100vh;
                            object-fit: contain;
                            cursor: zoom-in;
                            transition: transform 0.3s ease;
                        }
                        
                        .image-container img:hover {
                            transform: scale(1.05);
                        }
                        
                        .close-btn {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: rgba(255, 255, 255, 0.9);
                            border: none;
                            border-radius: 50%;
                            width: 50px;
                            height: 50px;
                            font-size: 24px;
                            color: #ff6600;
                            cursor: pointer;
                            z-index: 1000;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                        }
                        
                        .close-btn:hover {
                            background: rgba(255, 255, 255, 1);
                            transform: scale(1.1);
                        }
                        
                        .project-title {
                            position: fixed;
                            top: 20px;
                            left: 20px;
                            background: rgba(0, 0, 0, 0.7);
                            color: white;
                            padding: 10px 15px;
                            border-radius: 5px;
                            font-size: 16px;
                            z-index: 1000;
                        }
                        
                        .instructions {
                            position: fixed;
                            bottom: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: rgba(0, 0, 0, 0.7);
                            color: white;
                            padding: 10px 15px;
                            border-radius: 5px;
                            font-size: 14px;
                            z-index: 1000;
                            text-align: center;
                        }
                        
                        @media (max-width: 768px) {
                            .close-btn {
                                top: 10px;
                                right: 10px;
                                width: 40px;
                                height: 40px;
                                font-size: 20px;
                            }
                            
                            .project-title {
                                top: 10px;
                                left: 10px;
                                font-size: 14px;
                                padding: 8px 12px;
                            }
                            
                            .instructions {
                                bottom: 10px;
                                font-size: 12px;
                                padding: 8px 12px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <button class="close-btn" onclick="window.close()" title="Close">×</button>
                    <div class="project-title">${projectName}</div>
                    <div class="image-container">
                        <img src="${currentImageSrc}" alt="${projectName}" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s ease;">
                    </div>
                    <div class="instructions">
                        <!-- Instructions removed -->
                    </div>
                    
                    <script>
                        // Handle keyboard events
                        document.addEventListener('keydown', function(e) {
                            if (e.key === 'Escape') {
                                window.close();
                            }
                        });
                        
                        // Handle image click for zoom hint
                        document.querySelector('img').addEventListener('click', function() {
                            this.style.cursor = this.style.cursor === 'zoom-out' ? 'zoom-in' : 'zoom-out';
                        });
                    </script>
                </body>
                </html>
            `);
            
            newWindow.document.close();
            logger.info('Image opened in new window', { imageSrc: currentImageSrc, projectName });
        } else {
            // Fallback if popup is blocked
            alert('Please allow popups for this site to view images in a new window.');
            logger.warn('Popup blocked, could not open image in new window');
        }
    }

    // Toggles fullscreen mode and handles related CSS class changes
    toggleFullscreen(forceState) {
        this.isFullscreen = typeof forceState === 'boolean' ? forceState : !this.isFullscreen;
        this.modal.classList.toggle(this.config.fullscreenClassName, this.isFullscreen);
        document.body.classList.toggle('fullscreen-active', this.isFullscreen);
    }

    // Utility Methods
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.preloadedImages.has(src)) {
                resolve();
                return;
            }
            const img = new Image();
            img.onload = () => {
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                    this.preloadedImages.add(src);
                    resolve();
                } else {
                    reject(new Error('Image is empty or corrupted.'));
                }
            };
            img.onerror = (error) => reject(error);
            img.src = src;
        });
    }

    preloadImages(startIndex, count) {
        const images = this.currentProject.images;
        const preloadPromises = [];
        
        for (let i = startIndex; i < startIndex + count; i++) {
            const index = (i + images.length) % images.length;
            const imageSrc = images[index];
            
            // Skip if already preloaded or if lazy loader has it
            if (this.preloadedImages.has(imageSrc) || 
                (window.lazyLoader && window.lazyLoader.loadedImages.has(imageSrc))) {
                continue;
            }
            
            preloadPromises.push(
                this.preloadImage(imageSrc).catch(error => {
                    logger.warn('Image preload failed', error, { imageSrc });
                })
            );
        }
        
        // Preload in parallel for better performance
        Promise.allSettled(preloadPromises).then(() => {
            logger.info(`Preloaded ${preloadPromises.length} images`, { startIndex, count });
        });
    }
    
    preloadAllImagesInBackground() {
        const images = this.currentProject.images;
        const unloadedImages = images.filter(img => !this.preloadedImages.has(img));
        
        if (unloadedImages.length === 0) return;
        
        // Preload remaining images in batches to avoid overwhelming the browser
        const batchSize = 3;
        let currentBatch = 0;
        
        const preloadBatch = () => {
            const startIndex = currentBatch * batchSize;
            const endIndex = Math.min(startIndex + batchSize, unloadedImages.length);
            const batch = unloadedImages.slice(startIndex, endIndex);
            
            const batchPromises = batch.map(imageSrc => 
                this.preloadImage(imageSrc).catch(error => {
                    logger.warn('Background preload failed', error, { imageSrc });
                })
            );
            
            Promise.allSettled(batchPromises).then(() => {
                logger.info(`Preloaded batch ${currentBatch + 1}`, { 
                    batchSize: batch.length, 
                    totalRemaining: unloadedImages.length - endIndex 
                });
                
                currentBatch++;
                if (endIndex < unloadedImages.length) {
                    // Continue with next batch after a short delay
                    setTimeout(preloadBatch, 100);
                } else {
                    logger.info('All images preloaded successfully');
                }
            });
        };
        
        // Start preloading after a short delay to let the initial images load first
        setTimeout(preloadBatch, 500);
    }
    
    updateScrollIndicators() {
        if (!this.elements.thumbnailsColumn || !this.elements.thumbnailsContainer) return;

        const isHorizontal = window.innerWidth <= 1024;
        const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = this.elements.thumbnailsContainer;

        const canScrollLeft = isHorizontal && scrollLeft > 0;
        const canScrollRight = isHorizontal && scrollLeft < scrollWidth - clientWidth - 1;
        const canScrollUp = !isHorizontal && scrollTop > 0;
        const canScrollDown = !isHorizontal && scrollTop < scrollHeight - clientHeight - 1;
        
        this.elements.thumbnailsColumn.classList.toggle('scrollable-top', canScrollUp || canScrollLeft);
        this.elements.thumbnailsColumn.classList.toggle('scrollable-bottom', canScrollDown || canScrollRight);
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    if (window.logger) {
        logger.info('Initializing Gallery Modal System');
    }
    
    const galleryModal = new GalleryModal();
    
    // Expose to global scope for external use and debugging
    window.galleryModal = galleryModal;
    window.debugGalleryModal = () => galleryModal.debugModalLayout();

    // Enhanced click handler with better error handling
    document.addEventListener('click', async (e) => {
        const projectCard = e.target.closest('[data-project-id]');
        if (projectCard) {
            e.preventDefault();
            e.stopPropagation(); // Prevent page jump
            
            const projectId = projectCard.getAttribute('data-project-id');
            
            logger.info('Project card clicked', { projectId, modalReady: galleryModal.isReady() });
            
            try {
                await galleryModal.openProject(projectId);
            } catch (error) {
                logger.error('Failed to open project', error, { projectId });
                galleryModal.showError("Unable to open project gallery. Please try again.");
            }
        }
    });

    // Add additional click handler for featured project cards without data-project-id
    document.addEventListener('click', async (e) => {
        const featuredProject = e.target.closest('.featured-project');
        if (featuredProject && !featuredProject.hasAttribute('data-project-id')) {
            e.preventDefault();
            e.stopPropagation(); // Prevent page jump
            
            const projectTitle = featuredProject.querySelector('h3')?.textContent?.trim();
            if (projectTitle && galleryModal.isDataAvailable()) {
                // Try to find project by name
                const project = Object.values(galleryModal.projectsData).find(p => p.name === projectTitle);
                if (project) {
                    logger.info('Featured project clicked by name', { projectId: project.id, projectTitle });
                    try {
                        await galleryModal.openProject(project.id);
                    } catch (error) {
                        logger.error('Failed to open featured project', error, { projectId: project.id, projectTitle });
                        galleryModal.showError("Unable to open project gallery. Please try again.");
                    }
                }
            }
        }
    });

    // Debug utilities for development
    window.debugGalleryModal = () => {
        logger.debug('Gallery Modal Debug Info', {
            dataStatus: galleryModal.getDataStatus(),
            modalElements: galleryModal.elements,
            currentProject: galleryModal.currentProject,
            isDataAvailable: galleryModal.isDataAvailable(),
            isReady: galleryModal.isReady()
        });
    };

    // Test function to verify modal is working
    window.testGalleryModal = () => {
        logger.info('Testing Gallery Modal');
        
        if (!galleryModal.isReady()) {
            logger.error('Modal is not ready');
            return false;
        }
        
        if (!galleryModal.isDataAvailable()) {
            logger.error('No project data available');
            return false;
        }
        
        // Try to open the first available project
        const projectIds = Object.keys(galleryModal.projectsData);
        if (projectIds.length > 0) {
            const testProjectId = projectIds[0];
            logger.info('Testing with project', { testProjectId });
            galleryModal.openProject(testProjectId);
            return true;
        } else {
            logger.error('No projects available for testing');
            return false;
        }
    };

    if (window.logger) {
        logger.success('Gallery Modal System initialized');
        logger.info('Debug utilities available', {
            utilities: [
                'window.debugGalleryModal() - Show debug info',
                'window.testGalleryModal() - Test modal functionality',
                'window.galleryModal.openProject(id) - Open specific project',
                'window.galleryModal.setProjectsData(data) - Set project data',
                'window.galleryModal.isDataAvailable() - Check if data is loaded',
                'window.galleryModal.isReady() - Check if modal is ready'
            ]
        });
    }
});