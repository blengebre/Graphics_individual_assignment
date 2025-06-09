import * as THREE from 'three';

/**
 * Sets up the lighting system for the 3D scene
 * Creates a combination of ambient, directional, and point lights for realistic illumination
 * @param {THREE.Scene} scene - The Three.js scene to add lights to
 */
export function setupLighting(scene) {
    // Add ambient light for general illumination and to prevent complete darkness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Main directional light (simulates sunlight)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    
    // Configure shadow properties for realistic shadows
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    
    scene.add(mainLight);

    // Add a second directional light from the opposite direction for better illumination
    // This helps reduce harsh shadows and provides more even lighting
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Add a point light for additional highlights and to create more depth
    // Positioned above the product to create subtle top-down illumination
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);
} 