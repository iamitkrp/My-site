class BackgroundEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    isDarkMode() {
        return document.body.classList.contains('dark');
    }

    draw() {
        // Solid background color - white for light mode, dark grey for dark mode
        this.ctx.fillStyle = this.isDarkMode() ? '#070707' : '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Background manager to handle the effect
class BackgroundManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.effect = new BackgroundEffect(canvas);
        this.animate = this.animate.bind(this);

        // Listen for theme changes
        const observer = new MutationObserver(() => {
            this.effect.draw();
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    animate() {
        this.effect.draw();
        requestAnimationFrame(this.animate);
    }

    start() {
        this.animate();
    }
}

// Initialize
const canvas = document.getElementById('constellation-bg');
const manager = new BackgroundManager(canvas);
manager.start();

// Add effect switcher
document.addEventListener('keydown', (e) => {
    if (e.key === 'b' || e.key === 'B') {
        // No effect switcher for this simplified version
    }
});
