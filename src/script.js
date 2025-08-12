import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import VertexShader from './shaders/test/vertex.glsl'
import FragmentShader from './shaders/test/fragment.glsl'
import { gsap } from 'gsap';
import SplitType from 'split-type';
import click from '../static/Audio/click.mp3';
import hover from '../static/Audio/hover.mp3';
import bg from '../static/Audio/bg.mp3';
import imageDark from '../static/textures/6.png';
import imageLight from '../static/textures/8.png';
import logo from '../static/images/logo_no_bg.png';


/** ===========================================================================================
 * *                                    DOM Manipulation
=========================================================================================== */

const mobile = window.matchMedia("(max-width: 985px)").matches;
const myText = new SplitType('.my-text:not(.loves)');

function Ticker(elem) {
    elem.lettering();
    this.done = false;
    this.cycleCount = 5;
    this.cycleCurrent = 0;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('');
    this.charsCount = this.chars.length;
    this.letters = elem.find('span');
    this.letterCount = this.letters.length;
    this.letterCurrent = 0;

    this.letters.each(function () {
        var $this = $(this);
        $this.attr('data-orig', $this.text());
        $this.text('-');
    });
}

Ticker.prototype.getChar = function () {
    return this.chars[Math.floor(Math.random() * this.charsCount)];
};

Ticker.prototype.reset = function () {
    this.done = false;
    this.cycleCurrent = 0;
    this.letterCurrent = 0;
    this.letters.each(function () {
        var $this = $(this);
        $this.text($this.attr('data-orig'));
        $this.removeClass('done');
    });
    this.loop();
};

Ticker.prototype.loop = function () {
    var self = this;

    this.letters.each(function (index, elem) {
        var $elem = $(elem);
        if (index >= self.letterCurrent) {
            if ($elem.text() !== ' ') {
                $elem.text(self.getChar());
                $elem.css('opacity', Math.random());
            }
        }
    });

    if (this.cycleCurrent < this.cycleCount) {
        this.cycleCurrent++;
    } else if (this.letterCurrent < this.letterCount) {
        var currLetter = this.letters.eq(this.letterCurrent);
        this.cycleCurrent = 0;
        currLetter.text(currLetter.attr('data-orig')).css('opacity', 1).addClass('done');
        this.letterCurrent++;
    } else {
        this.done = true;
    }

    if (!this.done) {
        requestAnimationFrame(function () {
            self.loop();
        });
    }
};

let $words = $('.word');

$words.each(function () {
    var $this = $(this),
        ticker = new Ticker($this).reset();
    $this.data('ticker', ticker);
});

let time = document.getElementById('time');

setInterval(() => {
    time.innerHTML = getTime();
}, 1000)


function getTime() {
    const date = new Date();
    return date;
}


let interval

const element1 = document.getElementById('scramble-1');
const element2 = document.getElementById('scramble-2');
const element3 = document.getElementById('scramble-3');
const element4 = document.getElementById('scramble-4');
const element5 = document.getElementById('scramble-5');
const element6 = document.getElementById('scramble-6');
const element7 = document.getElementById('scramble-7');
const element8 = document.getElementById('scramble-8');
const element9 = document.getElementById('scramble-9');
const element10 = document.getElementById('scramble-10');

// Skills section scramble elements
// const skillElement1 = document.getElementById('skill-scramble-1');
// const skillElement2 = document.getElementById('skill-scramble-2');
// const skillElement3 = document.getElementById('skill-scramble-3');
// const skillElement4 = document.getElementById('skill-scramble-4');
// const skillElement5 = document.getElementById('skill-scramble-5');
// const skillElement6 = document.getElementById('skill-scramble-6');
// const skillElement7 = document.getElementById('skill-scramble-7');
// const skillElement8 = document.getElementById('skill-scramble-8');
const elementSpan1 = document.getElementById('scrambleSpan-1');
const elementSpan2 = document.getElementById('scrambleSpan-2');
const elementSpan3 = document.getElementById('scrambleSpan-3');
const elementSpan4 = document.getElementById('scrambleSpan-4');
const elementSpan5 = document.getElementById('scrambleSpan-5');
const elementSpan6 = document.getElementById('scrambleSpan-6');
const elementSpan7 = document.getElementById('scrambleSpan-7');
const elementSpan8 = document.getElementById('scrambleSpan-8');
const elementSpan9 = document.getElementById('scrambleSpan-9');
const elementSpan10 = document.getElementById('scrambleSpan-10');

// Skills section scramble spans
// const skillSpan1 = document.getElementById('skillScrambleSpan-1');
// const skillSpan2 = document.getElementById('skillScrambleSpan-2');
// const skillSpan3 = document.getElementById('skillScrambleSpan-3');
// const skillSpan4 = document.getElementById('skillScrambleSpan-4');
// const skillSpan5 = document.getElementById('skillScrambleSpan-5');
// const skillSpan6 = document.getElementById('skillScrambleSpan-6');
// const skillSpan7 = document.getElementById('skillScrambleSpan-7');
// const skillSpan8 = document.getElementById('skillScrambleSpan-8');

const randomInt = max => Math.floor(Math.random() * max)
const randomFromArray = array => array[randomInt(array.length)]

const scrambleText = text => {
    const chars = '*?><[]&@#)(.%$-_:/;?!'.split('')
    return text
        .split('')
        .map(x => randomInt(3) > 1 ? randomFromArray(chars) : x)
        .join('')
}

// Attach scramble listeners using delegation OR keep individual listeners
// Let's refine the individual listeners slightly
const projectLinks = document.querySelectorAll('.projects .stripes a.scramble'); 

projectLinks.forEach(link => {
    let scrambleInterval; // Use local interval per link
    link.addEventListener('mouseover', function() {
        const span = this.querySelector('span');
        if (!span) return;
        const currentText = span.innerText;
        this.dataset.originalText = currentText; // Store current text ("EXPLORE" or "CLOSE")
        clearInterval(scrambleInterval); 
        scrambleInterval = setInterval(() => {
            span.innerText = scrambleText(currentText);
        }, 100);
    });
    link.addEventListener('mouseout', function() {
        clearInterval(scrambleInterval);
        const span = this.querySelector('span');
         if (!span) return;
        if (this.dataset.originalText) {
            span.innerText = this.dataset.originalText;
        }
    });
});


/** ===========================================================================================
 * *                                    Sizes
=========================================================================================== */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/** ===========================================================================================
 * *                                    Canvas
=========================================================================================== */
const canvas = document.querySelector('canvas.webgl');

/** ===========================================================================================
 * *                                    Scene
=========================================================================================== */
const scene = new THREE.Scene();

/** ===========================================================================================
 * *                                    Camera
=========================================================================================== */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0.0, 0.0, 4.0);
if(mobile){
    camera.position.set(0.0, 0.0, 5.0);
}
scene.add(camera);

/** ===========================================================================================
 * *                                    Loading manager
=========================================================================================== */
const musicBarsDiv = document.querySelector('.music-bars')
const musicBars = document.querySelectorAll('.stroke');
console.log(musicBars);
const progressBar = document.querySelector('.loading-progress');
let SoundPlaying = false;
musicBarsDiv.addEventListener('click', () => {
    ctx.resume();
    if (!SoundPlaying) {
        for (let i = 0; i < 5; i++) {
            musicBars[i].style.animationPlayState = 'running'
        }
        background.play();
        SoundPlaying = true;
    }
    else {
        for (let i = 0; i < 5; i++) {
            musicBars[i].style.animationPlayState = 'paused';
        }
        background.pause();
        SoundPlaying = false;
    }
})
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        // Wait a little
        window.setTimeout(() => {
            // Update loadingBarElement
            document.getElementById('main-page').style.display = "flex";
            gsap.to("#loader-page",
                {
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    yPercent: -300
                }
            );
            gsap.to(
                mesh.scale,
                {
                    delay: 0.5,
                    stagger: 0.1,
                    duration: 2,
                    ease: 'power2.out',
                    x: 1.7,
                    y: 1.7,
                    z: 1.7,
                }
            );
            setTimeout(() => {
                $words.each(function () {
                    var $this = $(this),
                        ticker = new Ticker($this).reset();
                    $this.data('ticker', ticker);
                });
            }, 700)


        }, 1500);
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = (itemsLoaded / itemsTotal) * 300;
        progressBar.style.width = `${progressRatio}px`;
    }
)


/** ===========================================================================================
 * *                                    Images Loader
=========================================================================================== */
const textureLoader = new THREE.TextureLoader(loadingManager);

textureLoader.load(imageDark);
textureLoader.load(imageLight);
textureLoader.load(logo);


/** ===========================================================================================
 * *                                    Audio
=========================================================================================== */
// instantiate a listener
const audioListener = new THREE.AudioListener();
camera.add(audioListener);
const ctx = new (window.AudioContext)();

// instantiate audio object
const hoverSound = new THREE.Audio(audioListener);
const clickSound = new THREE.Audio(audioListener);
const background = new THREE.Audio(audioListener);
scene.add(hoverSound);
scene.add(clickSound);
scene.add(background);

// instantiate a loader
const loader = new THREE.AudioLoader(loadingManager);
loader.load(
    // resource URL
    hover,
    // onLoad callback
    function (audioBuffer) {
        // set the audio object buffer to the loaded object
        hoverSound.setBuffer(audioBuffer);
        hoverSound.setVolume(0.5);
    }
);
loader.load(
    // resource URL
    click,
    // onLoad callback
    function (audioBuffer) {
        // set the audio object buffer to the loaded object
        clickSound.setBuffer(audioBuffer);
        clickSound.setVolume(1);
    }
);
loader.load(
    // resource URL
    bg,
    // onLoad callback
    function (audioBuffer) {
        // set the audio object buffer to the loaded object
        background.setBuffer(audioBuffer);
        background.setLoop(true);
        background.setVolume(0.6);
    }
);

/** ===========================================================================================
 * *                                    Meshes
=========================================================================================== */
let isDark = false;

const moreInfoBtnDark = document.querySelectorAll('.btn-2');
const moreInfoBtnLight = document.querySelectorAll('.btn-1');

if(!isDark){
    moreInfoBtnDark.forEach((btn)=>{
        btn.style.display = "none";
    })
}

// Geometry
const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    isDark = !isDark;
    material.uniforms.uTexture.value = isDark ? textureDark : textureLight;
    if(isDark){
        moreInfoBtnLight.forEach((btn)=>{
            btn.style.display = "none";
        })
        moreInfoBtnDark.forEach((btn)=>{
            btn.style.display = "flex";
        })
    }
    else{
        moreInfoBtnDark.forEach((btn)=>{
            btn.style.display = "none";
        })
        moreInfoBtnLight.forEach((btn)=>{
            btn.style.display = "flex";
        })
    }
})



const geometry = new THREE.IcosahedronGeometry(1, 1);
const textureDark = new THREE.TextureLoader().load(imageDark);
const textureLight = new THREE.TextureLoader().load(imageLight);
textureDark.wrapS = textureDark.wrapT = THREE.MirroredRepeatWrapping;
textureLight.wrapS = textureLight.wrapT = THREE.MirroredRepeatWrapping;

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    uniforms: {
        uTexture: { value: textureLight },
    },
    side: THREE.DoubleSide,
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.set(0);
scene.add(mesh);


/** ===========================================================================================
 * *                                    Orbit-controls
=========================================================================================== */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false;


/** ===========================================================================================
 * *                                    Renderer
=========================================================================================== */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    mesh.rotation.y = elapsedTime * 0.07;
    mesh.rotation.x = elapsedTime * 0.07;
    mesh.rotation.z = elapsedTime * 0.07;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick()

// --- Toggle Logic --- 
function toggleDetails(projectNumber) {
    let detailDiv = document.getElementById(`detail-${projectNumber}`);
    let projectItemDiv = document.getElementById(`project-item-${projectNumber}`);
    
    if (!detailDiv || !projectItemDiv) {
        return; 
    }

    let spanId1 = `scrambleSpan-${(projectNumber * 2) - 1}`;
    let spanId2 = `scrambleSpan-${projectNumber * 2}`;
    let span1 = document.getElementById(spanId1);
    let span2 = document.getElementById(spanId2);
    let link1 = span1 ? span1.closest('a') : null;
    let link2 = span2 ? span2.closest('a') : null;

    const exploreText = "EXPLORE";
    const closeText = "CLOSE";
    let currentTextState = exploreText; 

    if (detailDiv.style.display === "flex") {
        // Hiding with animation
        const projectContent = detailDiv.querySelector('.project-content');
        if (projectContent) {
            projectContent.classList.add('closing');
            
            setTimeout(() => {
                projectItemDiv.style.borderBottom = "1px solid #4e545a";
                detailDiv.style.borderBottom = "none";
                detailDiv.style.display = "none";
                projectContent.classList.remove('closing');
                projectItemDiv.classList.remove('active');
            }, 400); // Match the animation duration
        } else {
            projectItemDiv.style.borderBottom = "1px solid #4e545a";
            detailDiv.style.borderBottom = "none";
            detailDiv.style.display = "none";
            projectItemDiv.classList.remove('active');
        }
        currentTextState = exploreText;
    } else {
        // Showing with animation
        projectItemDiv.style.borderBottom = "none";
        detailDiv.style.borderBottom = "1px solid #4e545a";
        detailDiv.style.display = "flex";
        currentTextState = closeText;
        
        // Add active class to project item
        projectItemDiv.classList.add('active');
        
        // Reset animations for new content
        const projectContent = detailDiv.querySelector('.project-content');
        if (projectContent) {
            // Remove any existing animation classes
            projectContent.classList.remove('closing');
            
            // Force reflow to restart animations
            projectContent.style.animation = 'none';
            projectContent.offsetHeight; // Trigger reflow
            projectContent.style.animation = null;
        }
    }
    
    // Update text and dataset
    if (span1) span1.innerText = currentTextState;
    if (span2) span2.innerText = currentTextState;
    if (link1) link1.dataset.originalText = currentTextState;
    if (link2) link2.dataset.originalText = currentTextState;
}

// --- Click Event Delegation --- 
const projectsContainer = document.querySelector('.projects .stripes'); 
if (projectsContainer) {
    projectsContainer.addEventListener('click', function(event) {
        const clickedLink = event.target.closest('a.scramble');
        
        if (!clickedLink || !clickedLink.id.startsWith('scramble-')) return; 

        const linkIdNum = parseInt(clickedLink.id.split('-')[1]);
        const projectNumber = Math.ceil(linkIdNum / 2);

        if (projectNumber >= 1 && projectNumber <= 5) { 
             event.preventDefault(); 
             toggleDetails(projectNumber);
        }
    });
}

// Ensure project links work properly
document.addEventListener('DOMContentLoaded', function() {
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow the link to work normally
            console.log('Project link clicked:', this.href);
        });
    });

    // Horizontal gallery interactions
    const gallery = document.getElementById('project-gallery');
    const prevBtn = document.querySelector('.project-nav .prev');
    const nextBtn = document.querySelector('.project-nav .next');

    if (gallery) {
        // 3D tilt effect on hover/move
        const enableTilt = (card) => {
            const handleMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotX = ((y - cy) / cy) * -6; // tilt up/down
                const rotY = ((x - cx) / cx) * 6;  // tilt left/right
                card.style.setProperty('--rx', rotX + 'deg');
                card.style.setProperty('--ry', rotY + 'deg');
                card.style.setProperty('--mx', (x / rect.width) * 100 + '%');
                card.style.setProperty('--my', (y / rect.height) * 100 + '%');
            };
            const resetMove = () => {
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
                card.classList.remove('is-tilting');
            };
            card.addEventListener('mouseenter', () => card.classList.add('is-tilting'));
            card.addEventListener('mousemove', handleMove);
            card.addEventListener('mouseleave', resetMove);
        };

        const cards = Array.from(gallery.querySelectorAll('.project-card'));
        cards.forEach(enableTilt);

        // Update nav button disabled state
        const updateNav = () => {
            if (!prevBtn || !nextBtn) return;
            const maxScroll = gallery.scrollWidth - gallery.clientWidth - 1; // tolerance
            prevBtn.disabled = gallery.scrollLeft <= 0;
            nextBtn.disabled = gallery.scrollLeft >= maxScroll;
        };

        // Smooth scroll helper
        const smoothScrollBy = (delta) => {
            gallery.scrollBy({ left: delta, behavior: 'smooth' });
        };

        // Click navigation only (disable scroll, drag, and swipe navigation)
        if (prevBtn) prevBtn.addEventListener('click', () => smoothScrollBy(-gallery.clientWidth * 0.8));
        if (nextBtn) nextBtn.addEventListener('click', () => smoothScrollBy(gallery.clientWidth * 0.8));

        // Block horizontal wheel/trackpad scrolling while allowing vertical page scroll
        gallery.addEventListener('wheel', (e) => {
            const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (horizontalIntent) {
                e.preventDefault();
            }
        }, { passive: false });

        // Prevent horizontal swipe on touch devices while allowing vertical page scroll
        let touchStartX = 0;
        let touchStartY = 0;
        gallery.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length === 0) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        gallery.addEventListener('touchmove', (e) => {
            if (!e.touches || e.touches.length === 0) return;
            const dx = Math.abs(e.touches[0].clientX - touchStartX);
            const dy = Math.abs(e.touches[0].clientY - touchStartY);
            if (dx > dy) {
                // horizontal intent → block
                e.preventDefault();
            }
        }, { passive: false });

        // Keep nav state fresh
        gallery.addEventListener('scroll', updateNav);

        // Initialize
        updateNav();
        window.addEventListener('resize', updateNav);
    }
});