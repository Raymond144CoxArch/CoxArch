# Installation Guide - Cox Architecture & Design Website

## Quick Start

### Option 1: Git Installation (Recommended)

1. **Install Git**
   - Download from: https://git-scm.com/download/win
   - Run installer with default settings
   - Restart your terminal

2. **Initialize Repository**
   ```bash
   # Navigate to project directory
   cd "C:\Users\Raymond\OneDrive\Desktop\cox-architecture-site\cox-architecture-site"
   
   # Initialize Git
   git init
   
   # Add all files
   git add .
   
   # Create initial commit
   git commit -m "Initial commit: Cox Architecture & Design website"
   
   # Set main branch
   git branch -M main
   
   # Add remote origin
   git remote add origin https://github.com/RGROSS97/CoxArchSite.git
   
   # Push to GitHub
   git push -u origin main
   ```

### Option 2: GitHub Desktop

1. **Download GitHub Desktop**
   - Go to: https://desktop.github.com/
   - Install and sign in to your GitHub account

2. **Create Repository**
   - Click "Create a new repository on your hard drive"
   - Name: `CoxArchSite`
   - Local path: Choose your desired location
   - Click "Create repository"

3. **Add Files**
   - Copy all website files to the repository folder
   - GitHub Desktop will detect the changes
   - Add commit message: "Initial commit: Cox Architecture & Design website"
   - Click "Commit to main"

4. **Publish to GitHub**
   - Click "Publish repository"
   - Repository name: `CoxArchSite`
   - Make it public or private as desired
   - Click "Publish repository"

### Option 3: Manual Upload

1. **Create Repository on GitHub**
   - Go to https://github.com/RGROSS97
   - Click "New repository"
   - Name: `CoxArchSite`
   - Don't initialize with README
   - Click "Create repository"

2. **Upload Files**
   - Use GitHub's web interface
   - Drag and drop files or use "uploading an existing file"
   - Upload all files from your project directory

## Server Deployment

### Shared Hosting (cPanel, etc.)

1. **Upload Files**
   - Use File Manager or FTP client
   - Upload all files to your domain's root directory
   - Ensure `.htaccess` file is uploaded

2. **Verify Configuration**
   - Test the website in a browser
   - Check that 404 page works
   - Verify portfolio galleries load correctly

### VPS/Dedicated Server

1. **Upload Files**
   ```bash
   # Using SCP
   scp -r * user@your-server:/var/www/html/
   
   # Or using rsync
   rsync -avz * user@your-server:/var/www/html/
   ```

2. **Set Permissions**
   ```bash
   chmod 644 *.html *.css *.js
   chmod 755 images/
   chmod 644 .htaccess
   ```

3. **Configure Web Server**
   - Ensure Apache has mod_rewrite enabled
   - Verify .htaccess is being processed
   - Test all functionality

## Local Development

### Using VS Code

1. **Install Live Server Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install the extension

2. **Start Development Server**
   - Right-click on `homepage.html`
   - Select "Open with Live Server"
   - Browser will open automatically

### Using Python (if installed)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then visit: http://localhost:8000

### Using Node.js (if installed)

```bash
# Install http-server globally
npm install -g http-server

# Start server
http-server -p 8000
```

Then visit: http://localhost:8000

## Testing Checklist

After installation, test these features:

- [ ] Homepage loads correctly
- [ ] Portfolio page displays all projects
- [ ] Gallery modals open and navigate properly
- [ ] Images load with lazy loading
- [ ] 404 page works (try visiting a non-existent page)
- [ ] Mobile responsiveness
- [ ] All links work correctly
- [ ] Contact forms (if any) function properly

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check file paths are correct
   - Verify image files exist
   - Check server permissions

2. **Gallery not working**
   - Ensure JavaScript is enabled
   - Check browser console for errors
   - Verify all script files are loaded

3. **404 page not showing**
   - Check .htaccess file is uploaded
   - Verify server supports .htaccess
   - Test with a non-existent URL

4. **Mobile issues**
   - Test on actual devices
   - Check viewport meta tag
   - Verify responsive CSS

### Performance Issues

1. **Slow loading**
   - Check image file sizes
   - Verify lazy loading is working
   - Test on different connection speeds

2. **Gallery lag**
   - Check browser performance
   - Verify images are optimized
   - Test on different devices

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all files are uploaded correctly
3. Test on different browsers and devices
4. Check server error logs

## Next Steps

After successful installation:

1. **Customize Content**: Update text, images, and contact information
2. **SEO Optimization**: Add Google Analytics, Search Console
3. **Performance**: Monitor Core Web Vitals
4. **Backup**: Set up regular backups
5. **Updates**: Keep content fresh and current

---

*For technical support, refer to the main README.md file or contact your web developer.*
