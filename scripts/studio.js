console.log('=== STUDIO.JS LOADED ===');

// Test if we can find buttons immediately
console.log('Immediate button check:', document.querySelectorAll('.bio-toggle-btn').length);

document.addEventListener('DOMContentLoaded', () => {
  console.log('=== DOM CONTENT LOADED ===');
  console.log('Buttons found on DOM ready:', document.querySelectorAll('.bio-toggle-btn').length);
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
  console.log('Setting up bio toggle...');
  console.log('Current window width:', window.innerWidth);
  
  // Test button visibility
  const buttons = document.querySelectorAll('.bio-toggle-btn');
  buttons.forEach((btn, i) => {
    console.log(`Button ${i}:`, btn);
    console.log(`Button display:`, window.getComputedStyle(btn).display);
  });
  
  setupBioToggle();
  
  // Load updated team member bios from localStorage AFTER bio toggle is set up
  loadUpdatedBios();
  
  // Debug function - call this in console to test
  window.testBioToggle = function() {
    console.log('=== TESTING BIO TOGGLE ===');
    const buttons = document.querySelectorAll('.bio-toggle-btn');
    console.log('Found buttons:', buttons.length);
    buttons.forEach((btn, i) => {
      console.log(`Button ${i}:`, btn);
      console.log(`Button style display:`, window.getComputedStyle(btn).display);
      console.log(`Button visible:`, btn.offsetWidth > 0 && btn.offsetHeight > 0);
      console.log(`Button text:`, btn.textContent);
    });
    
    const bios = document.querySelectorAll('.member-bio');
    console.log('Found bios:', bios.length);
    bios.forEach((bio, i) => {
      console.log(`Bio ${i}:`, bio);
      console.log(`Bio classes:`, bio.className);
      console.log(`Bio style max-height:`, window.getComputedStyle(bio).maxHeight);
      console.log(`Bio style opacity:`, window.getComputedStyle(bio).opacity);
      console.log(`Bio style display:`, window.getComputedStyle(bio).display);
    });
    
    // Try manual toggle
    const firstBio = document.getElementById('craig-bio');
    if (firstBio) {
      console.log('Testing manual toggle on Craig bio...');
      firstBio.classList.add('expanded');
      console.log('Added expanded class');
      console.log('Bio classes after:', firstBio.className);
    }
  };
  
  // Simple test function
  window.simpleTest = function() {
    console.log('=== SIMPLE TEST ===');
    const button = document.querySelector('.bio-toggle-btn');
    const bio = document.getElementById('craig-bio');
    
    console.log('Button found:', !!button);
    console.log('Bio found:', !!bio);
    
    if (button) {
      console.log('Button display:', window.getComputedStyle(button).display);
      console.log('Button clickable:', button.offsetWidth > 0 && button.offsetHeight > 0);
    }
    
    if (bio) {
      console.log('Bio max-height:', window.getComputedStyle(bio).maxHeight);
      console.log('Bio opacity:', window.getComputedStyle(bio).opacity);
    }
  };
});

function loadUpdatedBios() {
  const studioBios = JSON.parse(localStorage.getItem('studioBios') || '{}');

  console.log('Loading studio bios:', studioBios);
  
  // Clear any localhost image URLs from localStorage
  let needsClearing = false;
  Object.keys(studioBios).forEach(key => {
    if (studioBios[key].image && studioBios[key].image.includes('127.0.0.1')) {
      console.log('Clearing localhost image URL for', key);
      delete studioBios[key].image;
      needsClearing = true;
    }
  });
  
  if (needsClearing) {
    localStorage.setItem('studioBios', JSON.stringify(studioBios));
    console.log('Updated localStorage to remove localhost URLs');
  }

  // Update Craig Cox bio
  if (studioBios.craig) {
    console.log('Updating Craig bio:', studioBios.craig);
    updateTeamMemberBio('craig', studioBios.craig);
  }

  // Update Raymond Gross bio
  if (studioBios.raymond) {
    console.log('Updating Raymond bio:', studioBios.raymond);
    updateTeamMemberBio('raymond', studioBios.raymond);
  }

  // Update Gregory Bartley bio
  if (studioBios.greg) {
    console.log('Updating Gregory bio:', studioBios.greg);
    updateTeamMemberBio('greg', studioBios.greg);
  }
}

function updateTeamMemberBio(userKey, bioData) {
  // let memberSelector, // Unused variable
  let nameSelector, titleSelector, bioSelector, imageSelector;

  console.log(`Updating bio for ${userKey}:`, bioData);

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
      console.log('Unknown user key:', userKey);
      return;
  }

  // Update the team member information
  const nameElement = document.querySelector(nameSelector);
  const titleElement = document.querySelector(titleSelector);
  const bioElement = document.querySelector(bioSelector);
  const imageElement = document.querySelector(imageSelector);

  console.log('Found elements:', {
    name: nameElement,
    title: titleElement,
    bio: bioElement,
    image: imageElement
  });

  if (nameElement && bioData.name) {
    // Ensure Gregory Bartley's name is always "Gregory Bartley" not "Greg Bartley"
    if (userKey === 'greg' && bioData.name === 'Greg Bartley') {
      nameElement.textContent = 'Gregory Bartley';
      console.log('Updated name to: Gregory Bartley (corrected from Greg Bartley)');
    } else {
      nameElement.textContent = bioData.name;
      console.log('Updated name to:', bioData.name);
    }
  }

  if (titleElement && bioData.title) {
    titleElement.textContent = bioData.title;
    console.log('Updated title to:', bioData.title);
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
    console.log('Updated bio with paragraphs and ensured it stays hidden:', paragraphs);
  }

  if (imageElement && bioData.image) {
    // Only update image if bioData.image is a valid URL and not a localhost path
    if (bioData.image && bioData.image.startsWith('http') && !bioData.image.includes('127.0.0.1')) {
      imageElement.src = bioData.image;
      console.log('Updated image to:', bioData.image);
    } else {
      console.log('Skipping image update - invalid or localhost URL:', bioData.image);
    }
  }
}

// Simple bio toggle function
function setupBioToggle() {
  const buttons = document.querySelectorAll('.bio-toggle-btn');
  console.log('Found', buttons.length, 'bio toggle buttons');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Button clicked!');
      
      const targetId = this.getAttribute('data-target');
      const bio = document.getElementById(targetId);
      
      if (bio) {
        console.log('Found bio element:', targetId);
        
        if (bio.classList.contains('expanded')) {
          // Hide bio
          bio.classList.remove('expanded');
          this.classList.remove('expanded');
          console.log('Bio hidden');
        } else {
          // Show bio
          bio.classList.add('expanded');
          this.classList.add('expanded');
          console.log('Bio shown');
        }
      } else {
        console.error('Bio not found:', targetId);
      }
    });
  });
}
