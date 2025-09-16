# Cox Architecture & Design Website

A modern, responsive website for Cox Architecture & Design, a Charlotte-based residential architecture firm specializing in custom homes, additions, and renovation projects.

## 🏗️ About

Cox Architecture & Design is a premier residential architecture firm serving Charlotte, NC and surrounding areas. We specialize in:

- **New Construction Homes**: Custom residential design from concept to completion
- **Home Additions**: Thoughtful expansions that enhance your living space
- **Renovation Design**: Transforming existing homes with modern functionality
- **Addition Design**: Seamless integration of new spaces with existing architecture

## ✨ Features

### 🎨 Modern Design
- Clean, professional aesthetic matching the firm's brand
- Responsive design optimized for all devices
- Fast loading with lazy image loading implementation
- Accessibility-focused with proper ARIA labels and keyboard navigation

### 📱 Responsive Portfolio
- **28+ Featured Projects** with comprehensive image galleries
- **Lazy Loading**: Optimized performance with progressive image loading
- **Interactive Gallery**: Full-screen modal with keyboard and touch navigation
- **Project Filtering**: Easy browsing by project type (New Construction, Renovation+Addition)

### 🚀 Performance Optimized
- **Lazy Loading System**: Images load only when needed for faster page loads
- **Optimized Images**: Proper sizing and compression for web delivery
- **Modern JavaScript**: ES6+ features with fallback support
- **SEO Optimized**: Proper meta tags, structured data, and semantic HTML

### 🔧 Technical Features
- **404 Error Handling**: Custom error page with search functionality
- **Auto-Redirects**: Smart URL handling for common misspellings
- **Cross-Browser Compatible**: Works on all modern browsers
- **Mobile-First Design**: Optimized for mobile and tablet viewing

## 📁 Project Structure

```
cox-architecture-site/
├── images/
│   ├── Portfolio/
│   │   ├── New Construction/     # New build projects
│   │   └── Renovation+Addition/  # Renovation and addition projects
│   └── Logos/                    # Brand assets
├── scripts/
│   ├── portfolio-new.js         # Main portfolio functionality
│   ├── gallery-modal.js         # Interactive gallery system
│   ├── lazy-loading.js          # Performance optimization
│   ├── homepage.js              # Homepage interactions
│   └── 404.js                   # Error page functionality
├── styles/
│   ├── common.css               # Shared styles and variables
│   ├── homepage.css             # Homepage-specific styles
│   ├── portfolio.css            # Portfolio page styles
│   ├── gallery-modal.css        # Gallery modal styles
│   ├── lazy-loading.css         # Loading animations
│   └── 404.css                  # Error page styles
├── homepage.html                # Main homepage
├── portfolio.html               # Portfolio showcase
├── 404.html                     # Custom error page
└── .htaccess                    # Server configuration
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, optimized performance
- **Intersection Observer API**: Efficient lazy loading
- **Font Awesome**: Professional iconography
- **Google Fonts**: Inter font family for typography

## 🚀 Getting Started

### Prerequisites
- A web server (Apache, Nginx, or any static file server)
- Modern web browser

### Installation
1. Clone or download this repository
2. Upload files to your web server
3. Ensure `.htaccess` file is properly configured for your server
4. Test all functionality in a web browser

### Local Development
1. Use a local server (like Live Server in VS Code)
2. Open `homepage.html` in your browser
3. Navigate through the site to test functionality

## 📊 Portfolio Projects

### New Construction (12 projects)
- Contemporary French
- French Country
- Lake House
- Low Country Cabin
- Melchor Residence
- Modern Warehouse
- Riverchase
- Sabik
- Shingle Style
- Woodland
- And more...

### Renovation & Addition (16 projects)
- Colonial Revival
- Cotswold Outdoor Entertainment
- Dilworth Renovation
- Early Classical Facade Renovation
- Federal Makeover
- Heavy Timber Pool House
- Homeowner Haven
- Lake House Renovation
- Laurel Conversion
- Mid Century Modern Addition
- Myers Park Renovation
- Pelham Woods Renovation
- Ranch Renovation
- Screened Porch Addition
- Selwyn Park Cottage
- Split Level Makeover
- Wine Pavilion
- And more...

## 🎯 Key Features

### Portfolio Gallery
- **Interactive Modal**: Full-screen image viewing
- **Keyboard Navigation**: Arrow keys, ESC to close
- **Touch Support**: Swipe gestures on mobile
- **Thumbnail Navigation**: Quick image selection
- **Lazy Loading**: Images load as needed for performance

### Performance
- **Lazy Loading**: Reduces initial page load time
- **Optimized Images**: Proper sizing and compression
- **Efficient JavaScript**: Minimal dependencies
- **Caching Headers**: Configured for optimal performance

### SEO & Accessibility
- **Semantic HTML**: Proper heading structure and landmarks
- **Alt Text**: Descriptive image alternatives
- **ARIA Labels**: Screen reader support
- **Meta Tags**: Optimized for search engines
- **Structured Data**: Schema markup for better indexing

## 🔧 Configuration

### Server Requirements
- Apache with mod_rewrite enabled (for .htaccess support)
- Or any static file server for basic functionality

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Optimization

- **Responsive Design**: Adapts to all screen sizes
- **Touch-Friendly**: Optimized for mobile interaction
- **Fast Loading**: Lazy loading reduces data usage
- **Progressive Enhancement**: Works without JavaScript

## 🐛 Troubleshooting

### Common Issues
1. **Images not loading**: Check file paths and server permissions
2. **Gallery not working**: Ensure JavaScript is enabled
3. **404 page not showing**: Verify .htaccess configuration
4. **Mobile issues**: Test on actual devices, not just browser dev tools

### Performance Issues
1. **Slow loading**: Check image sizes and compression
2. **Gallery lag**: Ensure lazy loading is working properly
3. **Mobile performance**: Test on slower connections

## 📄 License

This website is proprietary to Cox Architecture & Design LLC. All rights reserved.

## 📞 Contact

**Cox Architecture & Design LLC**
- **Address**: 1310 S Tryon St UNIT 111, Charlotte, NC 28203
- **Website**: [www.coxarchitecture.com](https://www.coxarchitecture.com)
- **Services**: Residential Architecture, Custom Homes, Additions, Renovations

## 🙏 Acknowledgments

- Built with modern web standards and best practices
- Optimized for performance and accessibility
- Designed for the Charlotte residential architecture market
- Created with attention to user experience and SEO

---

*Professional residential architecture services in Charlotte, NC*