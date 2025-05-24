// Constellation background effect
const constellationCanvas = document.getElementById('constellation-bg');
const constellationCtx = constellationCanvas.getContext('2d');

// Set canvas size
function resizeConstellationCanvas() {
    constellationCanvas.width = window.innerWidth;
    constellationCanvas.height = window.innerHeight;
}

// Initial resize
resizeConstellationCanvas();

// Handle window resize
window.addEventListener('resize', resizeConstellationCanvas);

// Mouse position
let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Star properties - reduced for minimal density
const stars = [];
const numStars = 20;  // Reduced from 200 for very minimal density
const starSize = 1;  // Smaller particles
const connectionDistance = 120;  // Reduced connection distance
const starSpeed = 0.5;  // Slower movement speed
const mouseRadius = 150;  // Smaller radius of mouse influence
const mouseForce = 0.02;  // Weaker mouse attraction

// Subtle color palette matching background
function getStarColor(opacity = 1) {
    return document.body.classList.contains('dark') 
        ? `rgba(25, 25, 25, ${opacity * 0.3})` // Very subtle dark gray for dark mode
        : `rgba(240, 240, 240, ${opacity * 0.4})`; // Very subtle light gray for light mode
}

function getConnectionColor(opacity = 1) {
    return document.body.classList.contains('dark')
        ? `rgba(30, 30, 30, ${opacity * 0.2})` // Extremely subtle for dark mode
        : `rgba(230, 230, 230, ${opacity * 0.3})`; // Extremely subtle for light mode
}

// Create stars
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * constellationCanvas.width;
        this.y = Math.random() * constellationCanvas.height;
        this.vx = (Math.random() - 0.5) * starSpeed;  // More volatile movement
        this.vy = (Math.random() - 0.5) * starSpeed;
        this.radius = Math.random() * starSize;
        this.originalX = this.x;
        this.originalY = this.y;
    }

    update() {
        // More erratic movement
        this.vx += (Math.random() - 0.5) * 0.2;
        this.vy += (Math.random() - 0.5) * 0.2;
        
        // Speed limits
        this.vx = Math.max(Math.min(this.vx, starSpeed), -starSpeed);
        this.vy = Math.max(Math.min(this.vy, starSpeed), -starSpeed);
        
        // Mouse attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
            this.vx += (dx / distance) * mouseForce;
            this.vy += (dy / distance) * mouseForce;
        }

        // Return to original position when far from mouse
        const homeForce = 0.01;
        this.vx += (this.originalX - this.x) * homeForce;
        this.vy += (this.originalY - this.y) * homeForce;

        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges with random velocity change
        if (this.x < 0 || this.x > constellationCanvas.width) {
            this.vx = -this.vx * Math.random();
            this.x = Math.max(0, Math.min(this.x, constellationCanvas.width));
        }
        if (this.y < 0 || this.y > constellationCanvas.height) {
            this.vy = -this.vy * Math.random();
            this.y = Math.max(0, Math.min(this.y, constellationCanvas.height));
        }
    }

    draw() {
        constellationCtx.beginPath();
        constellationCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        constellationCtx.fillStyle = getStarColor(0.2); // Much lower opacity for very subtle stars
        constellationCtx.fill();
    }
}

// Create star instances
for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

// Draw connections between stars
function drawConnections() {
    constellationCtx.strokeStyle = getConnectionColor(0.05); // Very low opacity
    constellationCtx.lineWidth = 0.3; // Thinner lines

    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * 0.03; // Much lower opacity
                constellationCtx.strokeStyle = getConnectionColor(opacity);
                constellationCtx.beginPath();
                constellationCtx.moveTo(stars[i].x, stars[i].y);
                constellationCtx.lineTo(stars[j].x, stars[j].y);
                constellationCtx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    constellationCtx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);

    // Update and draw stars
    for (const star of stars) {
        star.update();
        star.draw();
    }

    drawConnections();
    requestAnimationFrame(animate);
}

// Start animation
animate();
