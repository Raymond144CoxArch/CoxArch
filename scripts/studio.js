// Studio.js loaded

// Test if we can find buttons immediately
// Check buttons immediately

document.addEventListener('DOMContentLoaded', () => {
  // DOM content loaded
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

  // Simple bio toggle for mobile
  
  // Test button visibility
  const buttons = document.querySelectorAll('.bio-toggle-btn');
  
  setupBioToggle();
  
  // Load updated team member bios from localStorage AFTER bio toggle is set up
  loadUpdatedBios();
  
  // Debug function - call this in console to test
  window.testBioToggle = function() {
    // Testing bio toggle functionality
    const buttons = document.querySelectorAll('.bio-toggle-btn');
    const bios = document.querySelectorAll('.member-bio');
    
    // Try manual toggle
    const firstBio = document.getElementById('craig-bio');
    if (firstBio) {
      firstBio.classList.add('expanded');
    }
  };
  
  // Simple test function
  window.simpleTest = function() {
    // Simple test functionality
    const button = document.querySelector('.bio-toggle-btn');
    const bio = document.getElementById('craig-bio');
    
    // Test button and bio elements
    return {
      buttonFound: !!button,
      bioFound: !!bio,
      buttonDisplay: button ? window.getComputedStyle(button).display : null,
      buttonClickable: button ? button.offsetWidth > 0 && button.offsetHeight > 0 : false,
      bioMaxHeight: bio ? window.getComputedStyle(bio).maxHeight : null,
      bioOpacity: bio ? window.getComputedStyle(bio).opacity : null
    };
  };
});

function loadUpdatedBios() {
  const studioBios = JSON.parse(localStorage.getItem('studioBios') || '{}');

  // Loading studio bios
  
  // Clear any localhost image URLs from localStorage
  let needsClearing = false;
  Object.keys(studioBios).forEach(key => {
    if (studioBios[key].image && studioBios[key].image.includes('127.0.0.1')) {
      // Clearing localhost image URL
      delete studioBios[key].image;
      needsClearing = true;
    }
  });
  
  if (needsClearing) {
    localStorage.setItem('studioBios', JSON.stringify(studioBios));
    // Updated localStorage to remove localhost URLs
  }

  // Update Craig Cox bio
  if (studioBios.craig) {
    // Updating Craig bio
    updateTeamMemberBio('craig', studioBios.craig);
  }

  // Update Raymond Gross bio
  if (studioBios.raymond) {
    // Updating Raymond bio
    updateTeamMemberBio('raymond', studioBios.raymond);
  }

  // Update Gregory Bartley bio
  if (studioBios.greg) {
    // Updating Gregory bio
    updateTeamMemberBio('greg', studioBios.greg);
  }
}

function updateTeamMemberBio(userKey, bioData) {
  // let memberSelector, // Unused variable
  let nameSelector, titleSelector, bioSelector, imageSelector;

  // Updating bio for team member

  // Map user keys to DOM selectors
  switch (userKey) {
    case 'craig':
      // memberSelector = '.team-member.founder'; // Unused variable
      nameSelector = '.team-member.founder .member-name';
      titleSelector = '.team-member.founder .member-title';
      bioSelector = '.team-member.founder .member-bio';
      imageSelector = '.team-member.founder .team-photo';
      break;
    case 'raymond':
      // memberSelector = '.team-member:nth-child(3)'; // Unused variable
      nameSelector = '.team-member:nth-child(3) .member-name';
      titleSelector = '.team-member:nth-child(3) .member-title';
      bioSelector = '.team-member:nth-child(3) .member-bio';
      imageSelector = '.team-member:nth-child(3) .team-photo';
      break;
    case 'greg':
      // memberSelector = '.team-member:nth-child(2)'; // Unused variable
      nameSelector = '.team-member:nth-child(2) .member-name';
      titleSelector = '.team-member:nth-child(2) .member-title';
      bioSelector = '.team-member:nth-child(2) .member-bio';
      imageSelector = '.team-member:nth-child(2) .team-photo';
      break;
    default:
      // Unknown user key
      return;
  }

  // Update the team member information
  const nameElement = document.querySelector(nameSelector);
  const titleElement = document.querySelector(titleSelector);
  const bioElement = document.querySelector(bioSelector);
  const imageElement = document.querySelector(imageSelector);

  // Found elements for bio update

  if (nameElement && bioData.name) {
    // Ensure Gregory Bartley's name is always "Gregory Bartley" not "Greg Bartley"
    if (userKey === 'greg' && bioData.name === 'Greg Bartley') {
      nameElement.textContent = 'Gregory Bartley';
      // Updated name to: Gregory Bartley (corrected from Greg Bartley)
    } else {
      nameElement.textContent = bioData.name;
      // Updated name
    }
  }

  if (titleElement && bioData.title) {
    titleElement.textContent = bioData.title;
    // Updated title
  }

  if (bioElement && bioData.bio) {
    // Handle bio formatting - split by double newlines or periods followed by space
    let paragraphs = bioData.bio.split('\n\n').filter(p => p.trim());

    // If no double newlines, try splitting by sentences
    if (paragraphs.length <= 1) {
      const sentences = bioData.bio.split('. ').filter(s => s.trim());
      if (sentences.length > 1) {
        // Group sentences into paragraphs (2-3 sentences per paragraph)
        paragraphs = [];
        for (let i = 0; i < sentences.length; i += 2) {
          const paragraph = sentences.slice(i, i + 2).join('. ');
          if (paragraph.trim()) {
            paragraphs.push(paragraph + (paragraph.endsWith('.') ? '' : '.'));
          }
        }
      } else {
        paragraphs = [bioData.bio];
      }
    }

    bioElement.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    
    // IMPORTANT: Ensure bio stays hidden after content update
    bioElement.classList.remove('expanded');
    // Updated bio with paragraphs and ensured it stays hidden
  }

  if (imageElement && bioData.image) {
    // Only update image if bioData.image is a valid URL and not a localhost path
    if (bioData.image && bioData.image.startsWith('http') && !bioData.image.includes('127.0.0.1')) {
      imageElement.src = bioData.image;
      // Updated image
    } else {
      // Skipping image update - invalid or localhost URL
    }
  }
}

// Simple bio toggle function
function setupBioToggle() {
  const buttons = document.querySelectorAll('.bio-toggle-btn');
  // Found bio toggle buttons
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      // Button clicked
      
      const targetId = this.getAttribute('data-target');
      const bio = document.getElementById(targetId);
      
      if (bio) {
        // Found bio element
        
        if (bio.classList.contains('expanded')) {
          // Hide bio
          bio.classList.remove('expanded');
          this.classList.remove('expanded');
          // Bio hidden
        } else {
          // Show bio
          bio.classList.add('expanded');
          this.classList.add('expanded');
          // Bio shown
        }
      } else {
        // Bio not found
      }
    });
  });
}
