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

  // ---- Form Handling ----
  const form = document.querySelector('.careers-form-section form');
  const submitBtn = document.getElementById('submitBtn');
  const statusRegion = document.getElementById('form-status');
  const resumeUpload = document.getElementById('resume-upload');
  const portfolioUpload = document.getElementById('portfolio-upload');
  const portfolioLink = document.getElementById('portfolio-link');
  const honeypot = document.querySelector('input[name="company"]');

  // File size validation
  function validateFileSize(file, maxSizeMB) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file && file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`;
    }
    return null;
  }

  // URL validation
  function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Show status message
  function showStatus(message, isError = false) {
    statusRegion.textContent = message;
    statusRegion.className = `form-status ${isError ? 'error' : 'success'}`;
  }

  // Clear status
  function clearStatus() {
    statusRegion.textContent = '';
    statusRegion.className = 'form-status';
  }

  // Handle file uploads with validation
  resumeUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFileSize(file, 15);
      if (error) {
        showStatus(error, true);
        e.target.value = '';
      } else {
        clearStatus();
      }
    }
  });

  portfolioUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFileSize(file, 50);
      if (error) {
        showStatus(error, true);
        e.target.value = '';
      } else {
        clearStatus();
      }
    }
  });

  // Validate portfolio link if provided
  portfolioLink.addEventListener('blur', (e) => {
    const url = e.target.value.trim();
    if (url && !isValidURL(url)) {
      showStatus('Please enter a valid URL for your portfolio link', true);
    } else {
      clearStatus();
    }
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check honeypot
    if (honeypot.value) {
      showStatus('Spam detected. Submission blocked.', true);
      return;
    }

    // Client-side validation
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const resumeFile = resumeUpload.files[0];
    const portfolioFile = portfolioUpload.files[0];
    const portfolioUrl = portfolioLink.value.trim();

    // Required field validation
    if (!firstName) {
      showStatus('First Name is required', true);
      return;
    }
    if (!lastName) {
      showStatus('Last Name is required', true);
      return;
    }
    if (!email) {
      showStatus('Email is required', true);
      return;
    }
    if (!message) {
      showStatus('Message is required', true);
      return;
    }
    if (!resumeFile) {
      showStatus('Resume file is required', true);
      return;
    }
    // Portfolio file is now optional - no validation needed

    // File size validation
    const resumeError = validateFileSize(resumeFile, 15);
    if (resumeError) {
      showStatus(resumeError, true);
      return;
    }

    // Only validate portfolio file size if a file was selected
    if (portfolioFile) {
      const portfolioError = validateFileSize(portfolioFile, 50);
      if (portfolioError) {
        showStatus(portfolioError, true);
        return;
      }
    }

    // Portfolio link validation
    if (portfolioUrl && !isValidURL(portfolioUrl)) {
      showStatus('Please enter a valid URL for your portfolio link', true);
      return;
    }

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Submitting...</span>';
    clearStatus();

    try {
      // Create FormData with exact field names required by Supabase
      const formData = new FormData();
      formData.append('First Name', firstName);
      formData.append('Last Name', lastName);
      formData.append('Email', email);
      formData.append('Subject', document.getElementById('subject').value);
      formData.append('Message', message);
      formData.append('Resume', resumeFile);
      
      // Always send Portfolio field - Supabase function expects it
      if (portfolioFile) {
        formData.append('Portfolio', portfolioFile);
      } else {
        // Send an empty File object when no portfolio is provided
        // This satisfies the server's requirement for the field while indicating no file
        const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
        formData.append('Portfolio', emptyFile);
      }
      
      if (portfolioUrl) {
        formData.append('PortfolioLink', portfolioUrl);
      }

      // Debug logger to verify FormData contents
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('FormData being sent to Supabase:');
      console.log('Total fields being sent:', Array.from(formData.entries()).length);
      for (const [k, v] of formData.entries()) {
        console.log('FD', k, v instanceof File ? `File(${v.name}, ${v.size} bytes)` : v);
      }
      
      // Additional debug info
      console.log('Portfolio file selected:', !!portfolioFile);
      console.log('Portfolio URL provided:', !!portfolioUrl);
      console.log('Form action URL:', form.action);
      console.log('================================');

      // Submit to Supabase function using form.action
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });

      // Check if response is ok
      if (!response.ok) {
        // Try to get error details from response
        let errorText = '';
        try {
          errorText = await response.text();
          console.error('Server error response:', errorText);
        } catch (e) {
          console.error('Could not read error response');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Try to parse JSON response
      let result;
      try {
        result = await response.json();
        console.log('Server response:', result);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (result.ok) {
        // Success
        submitBtn.classList.add('submitted');
        submitBtn.innerHTML = '<span>Submitted!</span>';
        showStatus('Application submitted successfully! We\'ll be in touch soon.');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.classList.remove('submitted');
          submitBtn.innerHTML = '<span>Submit Application</span>';
          clearStatus();
        }, 3000);
      } else {
        // Server error
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      // Network or other error
      console.error('Form submission error:', error);
      showStatus('Sorry, there was an error submitting your application. Please try again.', true);
      
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Submit Application</span>';
    }
  });
});