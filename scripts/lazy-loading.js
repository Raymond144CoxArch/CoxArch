// Lazy Loading System
// Provides efficient image lazy loading with intersection observer and performance optimizations

class LazyLoader {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '100px', // Increased from 50px for earlier loading
            threshold: 0.01, // Reduced from 0.1 for earlier loading
            loadingClass: 'lazy-loading',
            loadedClass: 'lazy-loaded',
            errorClass: 'lazy-error',
            placeholderClass: 'lazy-placeholder',
            ...options
        };
        
        this.observer = null;
        this.observedElements = new Set();
        this.loadedImages = new Set();
        this.failedImages = new Set();
        
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    root: this.options.root,
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );
        } else {
            // Fallback for browsers without IntersectionObserver
            console.warn('IntersectionObserver not supported, loading all images immediately');
            this.loadAllImages();
        }
    }
    
    /**
     * Add an image element to lazy loading
     * @param {HTMLImageElement} img - Image element to lazy load
     * @param {string} src - Source URL for the image
     * @param {Object} options - Additional options for this specific image
     */
    observe(img, src, options = {}) {
        if (!img || !src) {
            console.warn('Invalid image element or source provided to lazy loader');
            return;
        }
        
        // Skip if already loaded or failed
        if (this.loadedImages.has(src) || this.failedImages.has(src)) {
            this.loadImage(img, src, options);
            return;
        }
        
        // Store original src and set placeholder
        img.dataset.lazySrc = src;
        img.dataset.lazyOptions = JSON.stringify(options);
        
        // Set placeholder or low-quality image
        if (options.placeholder) {
            img.src = options.placeholder;
        } else {
            // Create a simple placeholder
            img.src = this.createPlaceholder(options.width, options.height);
        }
        
        // Add loading classes
        img.classList.add(this.options.loadingClass);
        if (options.placeholderClass) {
            img.classList.add(options.placeholderClass);
        }
        
        // Add to observer
        this.observer.observe(img);
        this.observedElements.add(img);
    }
    
    /**
     * Handle intersection observer callback
     * @param {IntersectionObserverEntry[]} entries - Intersection entries
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.lazySrc;
                const options = JSON.parse(img.dataset.lazyOptions || '{}');
                
                this.loadImage(img, src, options);
                this.observer.unobserve(img);
                this.observedElements.delete(img);
            }
        });
    }
    
    /**
     * Load an image with error handling and transitions
     * @param {HTMLImageElement} img - Image element
     * @param {string} src - Source URL
     * @param {Object} options - Loading options
     */
    loadImage(img, src, options = {}) {
        if (!img || !src) return;
        
        // Create a new image to test loading
        const testImg = new Image();
        
        testImg.onload = () => {
            // Image loaded successfully
            this.loadedImages.add(src);
            
            // Update the actual image element
            img.src = src;
            img.classList.remove(this.options.loadingClass);
            img.classList.add(this.options.loadedClass);
            
            // Add smooth transition
            if (options.transition !== false) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease-in-out';
                
                // Trigger reflow
                img.offsetHeight;
                
                // Fade in
                img.style.opacity = '1';
            }
            
            // Call success callback
            if (options.onLoad && typeof options.onLoad === 'function') {
                options.onLoad(img, src);
            }
        };
        
        testImg.onerror = (error) => {
            // Image failed to load
            this.failedImages.add(src);
            
            img.classList.remove(this.options.loadingClass);
            img.classList.add(this.options.errorClass);
            
            // Set error placeholder
            if (options.errorPlaceholder) {
                img.src = options.errorPlaceholder;
            } else {
                img.src = this.createErrorPlaceholder();
            }
            
            // Call error callback
            if (options.onError && typeof options.onError === 'function') {
                options.onError(img, src, error);
            }
            
            console.warn('Failed to load image:', src, error);
        };
        
        // Start loading
        testImg.src = src;
    }
    
    /**
     * Create a simple placeholder image
     * @param {number} width - Width of placeholder
     * @param {number} height - Height of placeholder
     * @returns {string} Data URL for placeholder
     */
    createPlaceholder(width = 400, height = 300) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Create a subtle gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#e0e0e0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add a simple loading indicator
        ctx.fillStyle = '#ccc';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Loading...', width / 2, height / 2);
        
        return canvas.toDataURL();
    }
    
    /**
     * Create an error placeholder image
     * @returns {string} Data URL for error placeholder
     */
    createErrorPlaceholder() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Light red background
        ctx.fillStyle = '#ffe6e6';
        ctx.fillRect(0, 0, 400, 300);
        
        // Error text
        ctx.fillStyle = '#cc0000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Image failed to load', 200, 150);
        
        return canvas.toDataURL();
    }
    
    /**
     * Load all images immediately (fallback for browsers without IntersectionObserver)
     */
    loadAllImages() {
        const images = document.querySelectorAll('img[data-lazy-src]');
        images.forEach(img => {
            const src = img.dataset.lazySrc;
            const options = JSON.parse(img.dataset.lazyOptions || '{}');
            this.loadImage(img, src, options);
        });
    }
    
    /**
     * Preload images for better performance
     * @param {string[]} urls - Array of image URLs to preload
     * @param {Function} onComplete - Callback when all images are loaded
     */
    preloadImages(urls, onComplete) {
        if (!urls || urls.length === 0) {
            if (onComplete) onComplete();
            return;
        }
        
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                if (this.loadedImages.has(url)) {
                    resolve(url);
                    return;
                }
                
                const img = new Image();
                img.onload = () => {
                    this.loadedImages.add(url);
                    resolve(url);
                };
                img.onerror = () => {
                    this.failedImages.add(url);
                    reject(new Error(`Failed to preload: ${url}`));
                };
                img.src = url;
            });
        });
        
        Promise.allSettled(promises).then(() => {
            if (onComplete) onComplete();
        });
    }
    
    /**
     * Destroy the lazy loader and clean up
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.observedElements.clear();
        this.loadedImages.clear();
        this.failedImages.clear();
    }
}

// Global lazy loader instance
window.lazyLoader = new LazyLoader();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}
