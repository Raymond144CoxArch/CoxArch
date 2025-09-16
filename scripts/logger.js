/**
 * Production-Ready Logging System
 * Provides structured error handling, reporting, and user-friendly notifications
 */

class Logger {
    constructor(config = {}) {
        this.config = {
            // Environment detection
            isDevelopment: this.detectDevelopment(),
            
            // Logging levels
            logLevel: config.logLevel || (this.isDevelopment ? 'debug' : 'error'),
            
            // Error reporting service configuration
            enableErrorReporting: config.enableErrorReporting !== false,
            errorReportingEndpoint: config.errorReportingEndpoint || null,
            
            // User notification settings
            enableUserNotifications: config.enableUserNotifications !== false,
            notificationContainer: config.notificationContainer || null,
            
            // Performance monitoring
            enablePerformanceLogging: config.enablePerformanceLogging !== false,
            
            // Storage for error tracking
            maxStoredErrors: config.maxStoredErrors || 50,
            
            ...config
        };

        this.errorStore = [];
        this.performanceMetrics = new Map();
        this.sessionId = this.generateSessionId();
        
        // Initialize error reporting service
        this.initializeErrorReporting();
        
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
        
        // Create notification container if needed
        this.setupNotificationContainer();
        
        console.log(`🔧 Logger initialized - Environment: ${this.isDevelopment ? 'Development' : 'Production'}, Level: ${this.logLevel}`);
    }

    /**
     * Detect if we're in development environment
     */
    detectDevelopment() {
        return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname.includes('dev') ||
            window.location.search.includes('debug=true') ||
            localStorage.getItem('debugMode') === 'true'
        );
    }

    /**
     * Generate unique session ID for error tracking
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Log debug information (development only)
     */
    debug(message, data = null) {
        if (this.shouldLog('debug')) {
            this.log('debug', message, data);
        }
    }

    /**
     * Log informational messages
     */
    info(message, data = null) {
        if (this.shouldLog('info')) {
            this.log('info', message, data);
        }
    }

    /**
     * Log warnings
     */
    warn(message, data = null) {
        if (this.shouldLog('warn')) {
            this.log('warn', message, data);
        }
    }

    /**
     * Log errors with full error handling
     */
    error(message, error = null, context = null) {
        if (this.shouldLog('error')) {
            const errorData = this.processError(message, error, context);
            this.log('error', message, errorData);
            
            // Store error for reporting
            this.storeError(errorData);
            
            // Report to external service if enabled
            if (this.config.enableErrorReporting) {
                this.reportError(errorData);
            }
            
            // Show user notification for critical errors
            if (this.isCriticalError(errorData)) {
                this.showUserNotification(message, 'error');
            }
        }
    }

    /**
     * Log success messages
     */
    success(message, data = null) {
        if (this.shouldLog('info')) {
            this.log('success', message, data);
        }
    }

    /**
     * Performance logging
     */
    performance(label, startTime = null) {
        if (!this.config.enablePerformanceLogging) return;

        const timestamp = Date.now();
        
        if (startTime) {
            const duration = timestamp - startTime;
            this.performanceMetrics.set(label, duration);
            
            if (this.shouldLog('debug')) {
                this.log('performance', `${label}: ${duration}ms`);
            }
            
            // Report slow operations
            if (duration > 1000) {
                this.warn(`Slow operation detected: ${label} took ${duration}ms`);
            }
        } else {
            this.performanceMetrics.set(label + '_start', timestamp);
            return timestamp;
        }
    }

    /**
     * Check if we should log at the given level
     */
    shouldLog(level) {
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        return levels[level] >= levels[this.config.logLevel];
    }

    /**
     * Core logging function
     */
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            sessionId: this.sessionId,
            url: window.location.href,
            userAgent: navigator.userAgent,
            data
        };

        // Console output with appropriate styling
        const consoleMethod = level === 'error' ? 'error' : 
                             level === 'warn' ? 'warn' : 
                             level === 'success' ? 'log' : 'log';
        
        if (this.isDevelopment) {
            // Rich console output for development
            const emoji = this.getLevelEmoji(level);
            const style = this.getLevelStyle(level);
            
            console[consoleMethod](
                `%c${emoji} [${level.toUpperCase()}] ${message}`,
                style,
                data ? data : ''
            );
        } else {
            // Minimal console output for production
            console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data || '');
        }
    }

    /**
     * Process error object for detailed reporting
     */
    processError(message, error, context) {
        const errorData = {
            message,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            url: window.location.href,
            userAgent: navigator.userAgent,
            context
        };

        if (error) {
            if (error instanceof Error) {
                errorData.error = {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    fileName: error.fileName,
                    lineNumber: error.lineNumber,
                    columnNumber: error.columnNumber
                };
            } else {
                errorData.error = {
                    type: typeof error,
                    value: error
                };
            }
        }

        return errorData;
    }

    /**
     * Store error for batch reporting
     */
    storeError(errorData) {
        this.errorStore.push(errorData);
        
        // Limit stored errors
        if (this.errorStore.length > this.config.maxStoredErrors) {
            this.errorStore = this.errorStore.slice(-this.config.maxStoredErrors);
        }
    }

    /**
     * Report error to external service
     */
    async reportError(errorData) {
        if (!this.config.errorReportingEndpoint) return;

        try {
            await fetch(this.config.errorReportingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(errorData)
            });
        } catch (reportingError) {
            // Don't create infinite loops - just log to console
            console.error('Failed to report error:', reportingError);
        }
    }

    /**
     * Determine if error is critical enough to show user notification
     */
    isCriticalError(errorData) {
        const criticalKeywords = ['network', 'connection', 'timeout', 'failed to load', 'not found'];
        const message = errorData.message.toLowerCase();
        
        return criticalKeywords.some(keyword => message.includes(keyword));
    }

    /**
     * Show user-friendly notification
     */
    showUserNotification(message, type = 'error') {
        if (!this.config.enableUserNotifications) return;

        const notification = document.createElement('div');
        notification.className = `logger-notification logger-notification--${type}`;
        notification.innerHTML = `
            <div class="logger-notification__content">
                <span class="logger-notification__icon">${this.getLevelEmoji(type)}</span>
                <span class="logger-notification__message">${this.getUserFriendlyMessage(message)}</span>
                <button class="logger-notification__close" aria-label="Close notification">&times;</button>
            </div>
        `;

        const container = this.getNotificationContainer();
        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.logger-notification__close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }

    /**
     * Get user-friendly error message
     */
    getUserFriendlyMessage(message) {
        const userMessages = {
            'network': 'Please check your internet connection and try again.',
            'connection': 'Unable to connect. Please try again later.',
            'timeout': 'The request is taking longer than expected. Please try again.',
            'failed to load': 'Some content couldn\'t be loaded. Please refresh the page.',
            'not found': 'The requested content was not found.'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, userMessage] of Object.entries(userMessages)) {
            if (lowerMessage.includes(key)) {
                return userMessage;
            }
        }

        return 'Something went wrong. Please try again.';
    }

    /**
     * Initialize error reporting service
     */
    initializeErrorReporting() {
        // You can integrate with services like:
        // - Sentry: https://sentry.io/
        // - LogRocket: https://logrocket.com/
        // - Bugsnag: https://www.bugsnag.com/
        // - Custom endpoint
        
        // Example Sentry integration (uncomment to use):
        /*
        if (window.Sentry) {
            this.config.errorReportingEndpoint = 'sentry';
            window.Sentry.configureScope((scope) => {
                scope.setTag('sessionId', this.sessionId);
                scope.setTag('environment', this.isDevelopment ? 'development' : 'production');
            });
        }
        */
        
        // Example LogRocket integration (uncomment to use):
        /*
        if (window.LogRocket) {
            window.LogRocket.identify(this.sessionId, {
                environment: this.isDevelopment ? 'development' : 'production'
            });
        }
        */
        
        // Example custom endpoint integration:
        /*
        this.config.errorReportingEndpoint = 'https://your-api.com/errors';
        */
    }

    /**
     * Set up global error handlers
     */
    setupGlobalErrorHandlers() {
        // Unhandled JavaScript errors
        window.addEventListener('error', (event) => {
            this.error('Unhandled JavaScript error', event.error, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.error('Unhandled promise rejection', event.reason, {
                promise: event.promise
            });
        });

        // Network errors
        window.addEventListener('error', (event) => {
            if (event.target !== window && event.target.tagName === 'IMG') {
                this.error('Image failed to load', null, {
                    src: event.target.src,
                    alt: event.target.alt
                });
            }
        }, true);
    }

    /**
     * Set up notification container
     */
    setupNotificationContainer() {
        if (this.config.notificationContainer) return;

        let container = document.getElementById('logger-notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'logger-notifications';
            container.className = 'logger-notifications';
            document.body.appendChild(container);
        }

        this.config.notificationContainer = container;
    }

    /**
     * Get notification container
     */
    getNotificationContainer() {
        return this.config.notificationContainer || document.getElementById('logger-notifications');
    }

    /**
     * Get emoji for log level
     */
    getLevelEmoji(level) {
        const emojis = {
            debug: '🐛',
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
            success: '✅',
            performance: '⚡'
        };
        return emojis[level] || '📝';
    }

    /**
     * Get console style for log level
     */
    getLevelStyle(level) {
        const styles = {
            debug: 'color: #6c757d; font-weight: normal;',
            info: 'color: #17a2b8; font-weight: normal;',
            warn: 'color: #ffc107; font-weight: bold;',
            error: 'color: #dc3545; font-weight: bold;',
            success: 'color: #28a745; font-weight: bold;',
            performance: 'color: #6f42c1; font-weight: bold;'
        };
        return styles[level] || 'color: #000;';
    }

    /**
     * Get error statistics
     */
    getErrorStats() {
        return {
            totalErrors: this.errorStore.length,
            errorsByType: this.groupErrorsByType(),
            sessionId: this.sessionId,
            performanceMetrics: Object.fromEntries(this.performanceMetrics)
        };
    }

    /**
     * Group errors by type for analysis
     */
    groupErrorsByType() {
        const groups = {};
        this.errorStore.forEach(error => {
            const type = error.error?.name || 'Unknown';
            groups[type] = (groups[type] || 0) + 1;
        });
        return groups;
    }

    /**
     * Clear stored errors
     */
    clearErrorStore() {
        this.errorStore = [];
    }

    /**
     * Export errors for analysis
     */
    exportErrors() {
        return {
            errors: this.errorStore,
            stats: this.getErrorStats(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Set log level dynamically
     */
    setLogLevel(level) {
        if (['debug', 'info', 'warn', 'error'].includes(level)) {
            this.config.logLevel = level;
            this.info(`Log level changed to: ${level}`);
        }
    }

    /**
     * Enable/disable debug mode
     */
    setDebugMode(enabled) {
        if (enabled) {
            localStorage.setItem('debugMode', 'true');
            this.setLogLevel('debug');
        } else {
            localStorage.removeItem('debugMode');
            this.setLogLevel('error');
        }
    }

    /**
     * Create a performance timer
     */
    startTimer(label) {
        return this.performance(label);
    }

    /**
     * End a performance timer
     */
    endTimer(label, startTime) {
        return this.performance(label, startTime);
    }

    /**
     * Track user interactions for analytics
     */
    trackInteraction(action, data = {}) {
        this.info(`User interaction: ${action}`, {
            ...data,
            timestamp: Date.now(),
            url: window.location.href
        });
    }

    /**
     * Track page performance metrics
     */
    trackPagePerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            this.performance('page_load_time', loadTime);
            this.performance('dom_ready_time', domReady);
            
            this.info('Page performance metrics', {
                loadTime,
                domReady,
                navigationStart: timing.navigationStart
            });
        }
    }

    /**
     * Monitor resource loading errors
     */
    monitorResourceErrors() {
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                const resource = event.target;
                if (resource.tagName === 'IMG' || resource.tagName === 'SCRIPT' || resource.tagName === 'LINK') {
                    this.error('Resource loading failed', null, {
                        tagName: resource.tagName,
                        src: resource.src || resource.href,
                        alt: resource.alt || null
                    });
                }
            }
        }, true);
    }
}

// Create global logger instance
window.logger = new Logger({
    // Configuration options
    enableErrorReporting: true,
    enableUserNotifications: true,
    enablePerformanceLogging: true,
    
    // Custom error reporting endpoint (replace with your service)
    // errorReportingEndpoint: 'https://your-error-reporting-service.com/api/errors'
});

// Initialize additional monitoring
document.addEventListener('DOMContentLoaded', () => {
    // Track page performance
    window.logger.trackPagePerformance();
    
    // Monitor resource loading errors
    window.logger.monitorResourceErrors();
    
    // Track initial page load
    window.logger.trackInteraction('page_load', {
        page: window.location.pathname,
        referrer: document.referrer
    });
});

// Add global utility functions for easy access
window.enableDebugMode = () => window.logger.setDebugMode(true);
window.disableDebugMode = () => window.logger.setDebugMode(false);
window.getErrorStats = () => window.logger.getErrorStats();
window.exportErrors = () => window.logger.exportErrors();

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .logger-notifications {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
    }
    
    .logger-notification {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 10px;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
    }
    
    .logger-notification--error {
        border-left: 4px solid #dc3545;
    }
    
    .logger-notification--warn {
        border-left: 4px solid #ffc107;
    }
    
    .logger-notification--info {
        border-left: 4px solid #17a2b8;
    }
    
    .logger-notification__content {
        display: flex;
        align-items: center;
        padding: 12px 16px;
    }
    
    .logger-notification__icon {
        margin-right: 8px;
        font-size: 16px;
    }
    
    .logger-notification__message {
        flex: 1;
        font-size: 14px;
        color: #333;
    }
    
    .logger-notification__close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666;
        padding: 0;
        margin-left: 8px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .logger-notification__close:hover {
        color: #333;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize and expose the logger globally
const logger = new Logger();
window.logger = logger;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
}
