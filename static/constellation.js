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

// Star properties
const stars = [];
const numStars = 200;  // Increased from default
const starSize = 2;  // Smaller particles for denser look
const connectionDistance = 150;  // Increased connection distance
const starSpeed = 1.5;  // Increased movement speed
const mouseRadius = 200;  // Radius of mouse influence
const mouseForce = 0.05;  // Strength of mouse attraction

// Orange color palette
function getStarColor(opacity = 1) {
    return document.body.classList.contains('dark') 
        ? `rgba(255, 140, 0, ${opacity})` // Dark mode: darker orange
        : `rgba(255, 165, 0, ${opacity})`; // Light mode: brighter orange
}

function getConnectionColor(opacity = 1) {
    return document.body.classList.contains('dark')
        ? `rgba(255, 127, 80, ${opacity})` // Dark mode: coral orange
        : `rgba(255, 99, 71, ${opacity})`; // Light mode: tomato orange
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
        constellationCtx.fillStyle = getStarColor(0.8);
        constellationCtx.fill();
    }
}

// Create star instances
for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

// Draw connections between stars
function drawConnections() {
    constellationCtx.strokeStyle = getConnectionColor(0.15);
    constellationCtx.lineWidth = 0.5;

    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * 0.15;
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
