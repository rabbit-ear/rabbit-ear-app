import * as THREE from "three";

/**
 * @description default materials for the highlighted components due
 * to raycaster / touch handlers (not materials for the model itself)
 */

// point
export const point = new THREE.PointsMaterial({
	sizeAttenuation: false,
	depthTest: false,
	color: 0x000000,
	size: 5,
});

// vertex
export const vertex = new THREE.PointsMaterial({
	sizeAttenuation: false,
	depthTest: false,
	color: 0x000000,
	size: 10,
});

// face
export const frontFace = new THREE.MeshBasicMaterial({
	side: THREE.FrontSide,
	color: 0xFF8800,
});
export const backFace = new THREE.MeshBasicMaterial({
	side: THREE.FrontSide,
	color: 0x888888,
});
