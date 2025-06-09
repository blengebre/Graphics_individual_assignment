import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createProduct, updateProductAnimation } from './createProduct.js';
import { setupLighting } from './lighting.js';
import { setupInteraction } from './interaction.js';
import { setupCameraAnimation } from './cameraAnimation.js';

/**
 * Main class for the 3D Product Viewer application
 * Handles scene setup, rendering, and animation
 */
class ProductViewer {
    constructor() {
        // Initialize core Three.js components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#product-viewer'),
            antialias: true
        });
        
        // Initialize animation timing
        this.clock = new THREE.Clock();
        
        this.init();
    }

    /**
     * Initialize the viewer with all necessary components
     */
    init() {
        // Setup renderer with optimal settings
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Position camera for optimal viewing
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Setup orbit controls for user interaction
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;

        // Create and add product to scene
        this.product = createProduct();
        this.scene.add(this.product);

        // Setup scene lighting
        setupLighting(this.scene);

        // Setup interaction handling
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        setupInteraction(this);

        // Setup camera animation
        this.cameraAnimation = setupCameraAnimation(this);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    /**
     * Handle window resize events
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Main animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Get elapsed time for animations
        const time = this.clock.getElapsedTime();
        
        // Update controls
        this.controls.update();
        
        // Update camera animation
        if (this.cameraAnimation) {
            this.cameraAnimation.update();
        }

        // Update product animations
        updateProductAnimation(this.product, time);

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the viewer when the page loads
window.addEventListener('load', () => {
    new ProductViewer();
}); 