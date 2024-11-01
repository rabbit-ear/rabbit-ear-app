import * as THREE from "three";

// positive value pushes polygon further away
const polygonOffsetFactor = 2;

export const front = new THREE.MeshPhongMaterial({
  flatShading: true,
  side: THREE.FrontSide,
  polygonOffset: true,
  polygonOffsetFactor,
  polygonOffsetUnits: 1,
  color: 0xec008b,
  emissive: 0x000000,
  specular: 0x111111,
  shininess: 20,
  reflectivity: 0,
  refractionRatio: 0,
});

export const back = new THREE.MeshPhongMaterial({
  flatShading: true,
  side: THREE.BackSide,
  polygonOffset: true,
  polygonOffsetFactor,
  polygonOffsetUnits: 1,
  color: 0xffffff,
  emissive: 0x000000,
  specular: 0x111111,
  shininess: 20,
  reflectivity: 0,
  refractionRatio: 0,
});

export const line = new THREE.LineBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.5,
});

export const strain = new THREE.MeshBasicMaterial({
  vertexColors: true,
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor,
  polygonOffsetUnits: 1,
});

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
