document.addEventListener('DOMContentLoaded', function() {
    // Mobile device detection
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
               window.innerWidth <= 768;
    }

    // Only initialize cursor on non-mobile devices
    if (isMobileDevice()) {
        // Restore default cursor on mobile devices
        document.body.style.cursor = 'auto';
        return; // Exit early for mobile devices
    }

    // Create Frutiger Aero cursor elements
    const aeroCursor = document.createElement('div');
    aeroCursor.className = 'aero-cursor';
    
    const aeroCircle = document.createElement('div');
    aeroCircle.className = 'aero-circle';
    
    const aeroHighlight = document.createElement('div');
    aeroHighlight.className = 'aero-highlight';
    
    const aeroDot = document.createElement('div');
    aeroDot.className = 'aero-dot';
    
    const aeroRing = document.createElement('div');
    aeroRing.className = 'aero-ring';
    
    // Assemble the cursor
    aeroCursor.appendChild(aeroCircle);
    aeroCursor.appendChild(aeroHighlight);
    aeroCursor.appendChild(aeroDot);
    aeroCursor.appendChild(aeroRing);
    document.body.appendChild(aeroCursor);
    
    // Initialize theme
    const checkbox = document.getElementById('checkbox');
    if (checkbox) {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            checkbox.checked = true;
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            checkbox.checked = false;
        }
        
        // Update theme on toggle
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }
    
    // Track mouse position with smooth movement
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // For more responsive feel, update dot position immediately
        aeroDot.style.left = `${(mouseX - cursorX) * 0.1 + 50}%`;
        aeroDot.style.top = `${(mouseY - cursorY) * 0.1 + 50}%`;
    });
    
    // Create subtle floating effect
    function floatingEffect() {
        // Only apply if not hovering or clicking
        if (!aeroCursor.classList.contains('hover') && !aeroCursor.classList.contains('click')) {
            // Subtle sine wave movement to simulate floating
            const time = Date.now() * 0.001;
            const floatX = Math.sin(time * 0.7) * 1.2;
            const floatY = Math.cos(time * 0.5) * 1.2;
            
            // Apply to highlight for subtle reflection movement
            aeroHighlight.style.transform = `rotate(-35deg) translate(${floatX}px, ${floatY}px)`;
        }
    }
    
    // Update floating effect regularly
    setInterval(floatingEffect, 16); // ~60fps for smoother animation
    
    // Animate cursor with smooth movement
    function animateCursor() {
        // Faster, more responsive tracking
        const ease = 0.35; // Increased from 0.2 for more responsiveness
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        aeroCursor.style.left = `${cursorX}px`;
        aeroCursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Interactive elements effect - faster response
    const interactiveElements = document.querySelectorAll('a, button, .btn-1, .btn-2, .social-media a, .resume-box, .theme');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            aeroCursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            aeroCursor.classList.remove('hover');
        });
    });
    
    // Click effect with more immediate feedback
    document.addEventListener('mousedown', () => {
        aeroCursor.classList.add('click');
        
        // Add slight blur effect on click to simulate focus
        aeroCircle.style.filter = 'blur(1px)';
        setTimeout(() => {
            aeroCircle.style.filter = 'none';
        }, 80); // Reduced from 100ms for faster response
    });
    
    document.addEventListener('mouseup', () => {
        aeroCursor.classList.remove('click');
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', e => {
        if (e.relatedTarget === null) {
            aeroCursor.style.opacity = '0';
        }
    });
    
    document.addEventListener('mouseover', () => {
        aeroCursor.style.opacity = '1';
    });
}); 