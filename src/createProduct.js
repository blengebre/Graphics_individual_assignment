import * as THREE from 'three';

/**
 * Creates a 3D product (chair) using basic geometries with animation capabilities
 * @returns {THREE.Group} A group containing all chair parts with animation properties
 */
export function createProduct() {
    // Create a group to hold all product parts
    const productGroup = new THREE.Group();

    // Create materials with realistic properties
    const material = new THREE.MeshStandardMaterial({
        color: 0x808080,
        metalness: 0.5,
        roughness: 0.5,
    });

    // Highlight material for interaction feedback
    const highlightMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a90e2,
        metalness: 0.7,
        roughness: 0.3,
    });

    // Create chair base (platform)
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.2, 2),
        material.clone()
    );
    base.position.y = 0.1;
    base.userData = { 
        name: 'Chair Base',
        originalY: 0.1,
        pulseAmplitude: 0.05,
        pulseSpeed: 1.5
    };
    productGroup.add(base);

    // Create chair legs using cylinders
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const legPositions = [
        [-0.8, 0.5, -0.8],
        [0.8, 0.5, -0.8],
        [-0.8, 0.5, 0.8],
        [0.8, 0.5, 0.8]
    ];

    legPositions.forEach((pos, index) => {
        const leg = new THREE.Mesh(legGeometry, material.clone());
        leg.position.set(...pos);
        leg.userData = { 
            name: `Chair Leg ${index + 1}`,
            originalY: pos[1],
            pulseAmplitude: 0.05,
            pulseSpeed: 1.5 + (index * 0.2) // Slightly different speeds for each leg
        };
        productGroup.add(leg);
    });

    // Create chair back
    const back = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1.5, 0.2),
        material.clone()
    );
    back.position.set(0, 1.25, -0.9);
    back.userData = { 
        name: 'Chair Back',
        originalY: 1.25,
        pulseAmplitude: 0.03,
        pulseSpeed: 1.2
    };
    productGroup.add(back);

    // Create chair seat
    const seat = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.2, 1.8),
        material.clone()
    );
    seat.position.set(0, 0.6, 0);
    seat.userData = { 
        name: 'Chair Seat',
        originalY: 0.6,
        pulseAmplitude: 0.04,
        pulseSpeed: 1.3
    };
    productGroup.add(seat);

    // Add hover effect and animation properties to all parts
    productGroup.children.forEach(part => {
        part.userData.originalMaterial = part.material;
        part.userData.highlightMaterial = highlightMaterial.clone();
        part.userData.originalScale = new THREE.Vector3(1, 1, 1);
        part.userData.pulsePhase = Math.random() * Math.PI * 2; // Random start phase for each part
    });

    return productGroup;
}

/**
 * Updates the animation state of all parts in the product
 * @param {THREE.Group} productGroup - The product group containing all parts
 * @param {number} time - The current time in seconds
 */
export function updateProductAnimation(productGroup, time) {
    productGroup.children.forEach(part => {
        if (part.userData.originalY !== undefined) {
            // Calculate new Y position using sine wave for smooth floating effect
            const newY = part.userData.originalY + 
                Math.sin(time * part.userData.pulseSpeed + part.userData.pulsePhase) * 
                part.userData.pulseAmplitude;
            part.position.y = newY;

            // Add subtle rotation for more dynamic movement
            part.rotation.x = Math.sin(time * 0.5 + part.userData.pulsePhase) * 0.02;
            part.rotation.z = Math.cos(time * 0.5 + part.userData.pulsePhase) * 0.02;
        }
    });
} 