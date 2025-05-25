// Advanced card hover effects
document.addEventListener('DOMContentLoaded', function() {
  // Enhanced mobile device detection
  function isMobileDevice() {
    const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const touchPoints = (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    const screenWidth = window.innerWidth <= 768;
    const touchStart = ('ontouchstart' in window);
    const maxTouch = (navigator.maxTouchPoints > 0);
    const msTouch = (navigator.msMaxTouchPoints > 0);
    
    console.log('Mobile Detection:', {
      userAgent,
      touchPoints,
      screenWidth,
      touchStart,
      maxTouch,
      msTouch,
      windowWidth: window.innerWidth
    });
    
    return userAgent || touchPoints || screenWidth || touchStart || maxTouch || msTouch;
  }

  // Check if mobile
  const isMobile = isMobileDevice();
  console.log('Is Mobile Device:', isMobile);

  // Exit early for mobile devices and add mobile-specific handlers
  if (isMobile) {
    // Add CSS class to body for mobile-specific styling
    document.body.classList.add('mobile-device');
    console.log('Added mobile-device class to body');
    
    // Simple approach - just add a class and let CSS handle everything
    const skillCards = document.querySelectorAll('.single-icon');
    console.log('Found skill cards for mobile:', skillCards.length);
    
    skillCards.forEach((card, index) => {
      card.classList.add('mobile-disabled');
      console.log(`Added mobile-disabled class to card ${index + 1}`);
    });
    
    return; // Exit completely for mobile devices
  }

  console.log('Desktop mode - initializing hover effects');

  // Wait a bit to ensure DOM is fully rendered
  setTimeout(() => {
    const cards = document.querySelectorAll('.single-icon');
    console.log('Found skill cards:', cards.length);
    
    // Remove inline styles that interfere with CSS hover effects
    cards.forEach(card => {
      // Remove the background that's blocking effects 
      card.style.background = 'none';
      
      // Make sure skill names are visible on hover
      const skillName = card.querySelector('.skill-name');
      if (skillName) {
        // Reset any inline styles that might be overriding our hover styles
        skillName.style.transition = 'all 0.3s ease';
      }
      
      const content = card.querySelector('.skill-card-content');
      if (content) {
        // Add highlight effect element if it doesn't exist
        let highlight = content.querySelector('.highlight-effect');
        if (!highlight) {
          highlight = document.createElement('div');
          highlight.className = 'highlight-effect';
          content.appendChild(highlight);
        }
      }
    });
    
    // Function to create a particle with theme-appropriate colors
    function createParticle(container, x, y) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Set position
      particle.style.left = `${x}px`;
      particle.style.bottom = '0';
      
      // Random horizontal direction
      const xOffset = (Math.random() - 0.5) * 50;
      particle.style.setProperty('--particle-x', `${xOffset}px`);
      
      // Random color based on the card's theme
      const darkModeColors = [
        'rgba(255, 255, 255, 0.6)',
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.5)'
      ];
      
      const lightModeColors = [
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.9)',
        'rgba(255, 255, 255, 0.6)'
      ];
      
      const colors = document.body.classList.contains('dark') ? darkModeColors : lightModeColors;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      // Add to container and remove when animation ends
      container.appendChild(particle);
      setTimeout(() => {
        if (particle.parentNode === container) {
          particle.remove();
        }
      }, 2000);
    }
    
    // Watch for theme changes
    const themeToggle = document.getElementById('checkbox');
    if (themeToggle) {
      themeToggle.addEventListener('change', function() {
        // Update all particles with new theme colors
        document.querySelectorAll('.particle').forEach(particle => {
          const darkModeColors = [
            'rgba(255, 255, 255, 0.6)',
            'rgba(255, 255, 255, 0.7)',
            'rgba(255, 255, 255, 0.5)'
          ];
          
          const lightModeColors = [
            'rgba(255, 255, 255, 0.7)',
            'rgba(255, 255, 255, 0.9)',
            'rgba(255, 255, 255, 0.6)'
          ];
          
          const colors = document.body.classList.contains('dark') ? darkModeColors : lightModeColors;
          particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        });
      });
    }
    
    cards.forEach((card, index) => {
      // Add card number as a data attribute for specific styling
      card.dataset.cardIndex = index + 1;
      
      // Add particle elements to each card
      const inner = card.querySelector('.skill-card-inner');
      if (inner) {
        // Create particles container if it doesn't exist
        let particles = inner.querySelector('.card-particles');
        if (!particles) {
          particles = document.createElement('div');
          particles.className = 'card-particles';
          inner.appendChild(particles);
        }
        
        // Generate particles on hover
        card.addEventListener('mouseover', function() {
          console.log('Card hover detected');
          
          // Show skill name
          const skillName = card.querySelector('.skill-name');
          if (skillName) {
            skillName.style.opacity = '1';
            skillName.style.transform = 'translateY(0)';
          }
          
          const skillContent = card.querySelector('.skill-card-content');
          if (skillContent) {
            skillContent.style.transform = 'scale(1.05)';
          }
          
          const interval = setInterval(() => {
            if (!card.matches(':hover')) {
              clearInterval(interval);
              return;
            }
            
            const rect = particles.getBoundingClientRect();
            const x = Math.random() * rect.width;
            createParticle(particles, x);
          }, 100);
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', function() {
          const skillName = card.querySelector('.skill-name');
          if (skillName) {
            skillName.style.opacity = '0';
            skillName.style.transform = 'translateY(30px)';
          }
          
          const skillContent = card.querySelector('.skill-card-content');
          if (skillContent) {
            skillContent.style.transform = 'scale(1)';
          }
        });
      }
      
      // Mouse move tilt effect
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 15; // max 15deg rotation
        const rotateX = ((centerY - y) / centerY) * 15; // max 15deg rotation
        
        // Apply 3D rotation to card inner
        const inner = this.querySelector('.skill-card-inner');
        if (inner) {
          inner.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        }
        
        this.style.setProperty('--rotateX', rotateX + 'deg');
        this.style.setProperty('--rotateY', rotateY + 'deg');
        
        // Calculate distance from center for glow effect
        const distanceX = Math.abs(x - centerX) / centerX;
        const distanceY = Math.abs(y - centerY) / centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Update glow intensity based on cursor position
        const glowIntensity = Math.min(distance * 1.5, 1);
        this.style.setProperty('--glow-intensity', glowIntensity);
        
        // Update highlight position
        const highlightX = ((x / rect.width) * 100);
        const highlightY = ((y / rect.height) * 100);
        this.style.setProperty('--highlight-x', highlightX + '%');
        this.style.setProperty('--highlight-y', highlightY + '%');
      });
      
      // Reset on mouse leave
      card.addEventListener('mouseleave', function() {
        // Reset the card inner transform
        const inner = this.querySelector('.skill-card-inner');
        if (inner) {
          inner.style.transform = '';
        }
        
        // Reset to default values
        this.style.setProperty('--rotateX', '10deg');
        this.style.setProperty('--rotateY', '10deg');
        this.style.setProperty('--glow-intensity', '0');
      });
    });
    
    console.log('Skill card effects initialized');
  }, 500); // Small delay to ensure DOM is ready
});