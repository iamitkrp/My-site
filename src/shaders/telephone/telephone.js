//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;

// Function to update model color based on dark mode
function updateModelColor(isDarkMode) {
  if (object) {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material.color = new THREE.Color(isDarkMode ? 0xff0000 : 0x4e545a); // Red in dark mode, Gray in light mode
      }
    });
  }
}

// Listen for dark mode changes
document.body.addEventListener('click', function(e) {
  if (e.target.classList.contains('theme-switch')) {
    const isDarkMode = document.body.classList.contains('dark');
    updateModelColor(isDarkMode);
  }
});

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'telephone';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `../../models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    
    // Scale down the model
    object.scale.set(0.4, 0.4, 0.4);
    
    // Change the color of the model
    object.traverse((child) => {
      if (child.isMesh) {
        // Set initial color based on current mode
        const isDarkMode = document.body.classList.contains('dark');
        child.material.color = new THREE.Color(isDarkMode ? 0xff0000 : 0x4e545a);
      }
    });
    
    scene.add(object);
    
    // Center the model
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.x += -center.x;
    object.position.y += -center.y;
    object.position.z += -center.z;
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth / 2.0, window.innerHeight / 2.0);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Set camera position
camera.position.z = 7;
camera.position.y = 2;

//Add the renderer to the DOM
document.getElementById("telephone3D").appendChild(renderer.domElement);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 3;
controls.maxDistance = 10;

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  if (object) {
    object.rotation.y += 0.005; // Only rotate on Y-axis for sideways rotation
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
});

//Start the 3D rendering
animate();
