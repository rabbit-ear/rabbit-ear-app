import * as THREE from "three";

// positive value pushes polygon further away
const polygonOffsetFactor = 0.5;

const front = new THREE.MeshPhongMaterial({
	flatShading: true,
	side: THREE.FrontSide,
	polygonOffset: true,
	polygonOffsetFactor,
	polygonOffsetUnits: 1,
	color: 0xFFFFFF,
	emissive: 0x000000,
	specular: 0x111111,
	shininess: 20,
	reflectivity: 0,
	refractionRatio: 0,
});

const back = new THREE.MeshPhongMaterial({
	flatShading: true,
	side: THREE.BackSide,
	polygonOffset: true,
	polygonOffsetFactor,
	polygonOffsetUnits: 1,
	color: 0xEC008B,
	emissive: 0x000000,
	specular: 0x111111,
	shininess: 20,
	reflectivity: 0,
	refractionRatio: 0,
});

const line = new THREE.LineBasicMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.5,
});

const strain = new THREE.MeshBasicMaterial({
	vertexColors: true,
	side: THREE.DoubleSide,
	polygonOffset: true,
	polygonOffsetFactor,
	polygonOffsetUnits: 1,
});

export {
	front,
	back,
	line,
	strain,
};
