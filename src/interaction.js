import * as THREE from 'three';

/**
 * Sets up interaction handling for the 3D product viewer
 * Implements raycasting for mouse interaction and visual feedback
 * @param {Object} viewer - The main ProductViewer instance
 * @returns {Function} Cleanup function to remove event listeners
 */
export function setupInteraction(viewer) {
    const { raycaster, mouse, product, camera, renderer } = viewer;
    let currentIntersection = null;

    /**
     * Updates mouse position based on event coordinates
     * Converts screen coordinates to normalized device coordinates (-1 to +1)
     * @param {MouseEvent} event - The mouse move event
     */
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    /**
     * Handles mouse click events on the product
     * Updates info panel and provides visual feedback
     * @param {MouseEvent} event - The mouse click event
     */
    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(product.children, true);

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            
            // Update info panel with part name
            const infoPanel = document.getElementById('part-name');
            if (infoPanel) {
                infoPanel.textContent = selectedObject.userData.name;
            }

            // Visual feedback: change material color
            selectedObject.material = selectedObject.userData.highlightMaterial;
            
            // Reset material after a short delay
            setTimeout(() => {
                selectedObject.material = selectedObject.userData.originalMaterial;
            }, 500);
        }
    }

    /**
     * Handles hover effects on product parts
     * Provides visual feedback when mouse hovers over parts
     */
    function onMouseMove() {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(product.children, true);

        // Reset previous intersection
        if (currentIntersection) {
            currentIntersection.material = currentIntersection.userData.originalMaterial;
            currentIntersection = null;
        }

        // Handle new intersection
        if (intersects.length > 0) {
            currentIntersection = intersects[0].object;
            currentIntersection.material = currentIntersection.userData.highlightMaterial;
        }
    }

    // Add event listeners for interaction
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Return cleanup function to remove event listeners
    return () => {
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('click', onClick);
    };
} 