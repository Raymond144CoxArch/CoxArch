// Performance Monitoring for Cox Architecture & Design
// Tracks key performance metrics and reports them

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Wait for page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
        } else {
            this.startMonitoring();
        }
    }

    startMonitoring() {
        // Core Web Vitals
        this.measureLCP(); // Largest Contentful Paint
        this.measureFID(); // First Input Delay
        this.measureCLS(); // Cumulative Layout Shift
        this.measureFCP(); // First Contentful Paint
        this.measureTTI(); // Time to Interactive

        // Custom metrics
        this.measureImageLoadTime();
        this.measureScriptLoadTime();
    }

    measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                // console.log('LCP:', lastEntry.startTime + 'ms');
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    measureFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    // console.log('FID:', this.metrics.fid + 'ms');
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    measureCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.cls = clsValue;
                // console.log('CLS:', clsValue);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    measureFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.fcp = entry.startTime;
                        // console.log('FCP:', entry.startTime + 'ms');
                    }
                });
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    measureTTI() {
        // Simplified TTI measurement
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.metrics.tti = performance.now();
                // console.log('TTI (approx):', this.metrics.tti + 'ms');
            }, 0);
        });
    }

    measureImageLoadTime() {
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        const totalImages = images.length;
        const startTime = performance.now();

        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        this.metrics.allImagesLoaded = performance.now() - startTime;
                        // console.log('All images loaded in:', this.metrics.allImagesLoaded + 'ms');
                    }
                });
            }
        });

        if (loadedImages === totalImages) {
            this.metrics.allImagesLoaded = performance.now() - startTime;
            // console.log('All images loaded in:', this.metrics.allImagesLoaded + 'ms');
        }
    }

    measureScriptLoadTime() {
        const scripts = document.querySelectorAll('script[src]');
        let loadedScripts = 0;
        const totalScripts = scripts.length;
        const startTime = performance.now();

        scripts.forEach(script => {
            script.addEventListener('load', () => {
                loadedScripts++;
                if (loadedScripts === totalScripts) {
                    this.metrics.allScriptsLoaded = performance.now() - startTime;
                    // console.log('All scripts loaded in:', this.metrics.allScriptsLoaded + 'ms');
                }
            });
        });
    }

    getMetrics() {
        return this.metrics;
    }

    reportMetrics() {
        // console.group('🚀 Performance Metrics');
        // console.log('LCP (Largest Contentful Paint):', this.metrics.lcp ? this.metrics.lcp + 'ms' : 'Not measured');
        // console.log('FCP (First Contentful Paint):', this.metrics.fcp ? this.metrics.fcp + 'ms' : 'Not measured');
        // console.log('FID (First Input Delay):', this.metrics.fid ? this.metrics.fid + 'ms' : 'Not measured');
        // console.log('CLS (Cumulative Layout Shift):', this.metrics.cls ? this.metrics.cls : 'Not measured');
        // console.log('TTI (Time to Interactive):', this.metrics.tti ? this.metrics.tti + 'ms' : 'Not measured');
        // console.log('All Images Loaded:', this.metrics.allImagesLoaded ? this.metrics.allImagesLoaded + 'ms' : 'Not measured');
        // console.log('All Scripts Loaded:', this.metrics.allScriptsLoaded ? this.metrics.allScriptsLoaded + 'ms' : 'Not measured');
        // console.groupEnd();
    }
}

// Initialize performance monitoring
const perfMonitor = new PerformanceMonitor();

// Make it available globally for debugging
window.perfMonitor = perfMonitor;

// Report metrics after 5 seconds
setTimeout(() => {
    perfMonitor.reportMetrics();
}, 5000);

