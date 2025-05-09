// Advanced card hover effects
document.addEventListener('DOMContentLoaded', function() {
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
        skillName.style.opacity = '0';
        skillName.style.transform = 'translateY(30px)';
        skillName.style.visibility = 'hidden';
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
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Add animation
      particle.style.animation = `particle-float ${Math.random() * 2 + 1}s ease-out forwards`;
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
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
          particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        });
      });
    }
    
    // Add hover effects to each card
    cards.forEach(card => {
      const inner = card.querySelector('.skill-card-inner');
      if (!inner) return;
      
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
        const skillContent = card.querySelector('.skill-card-content');
        if (skillContent) {
          skillContent.style.transform = 'scale(1)';
        }
      });
    });
    
    console.log('Skill card effects initialized');
  }, 100);
}); 