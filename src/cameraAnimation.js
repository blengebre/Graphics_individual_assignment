import * as THREE from 'three';

export function setupCameraAnimation(viewer) {
    const { camera, controls } = viewer;
    let isAutoRotating = true;
    let rotationSpeed = 0.5; // degrees per second
    let lastTime = performance.now();

    // Toggle auto-rotation when user interacts with controls
    controls.addEventListener('start', () => {
        isAutoRotating = false;
    });

    controls.addEventListener('end', () => {
        isAutoRotating = true;
    });

    return {
        update: () => {
            if (!isAutoRotating) return;

            const currentTime = performance.now();
            const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
            lastTime = currentTime;

            // Calculate new camera position using polar coordinates
            const radius = Math.sqrt(
                camera.position.x * camera.position.x +
                camera.position.z * camera.position.z
            );
            
            const currentAngle = Math.atan2(camera.position.z, camera.position.x);
            const newAngle = currentAngle + (rotationSpeed * deltaTime * Math.PI / 180);

            // Update camera position
            camera.position.x = radius * Math.cos(newAngle);
            camera.position.z = radius * Math.sin(newAngle);
            camera.lookAt(0, 0, 0);
        }
    };
} 