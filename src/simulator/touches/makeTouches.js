import * as THREE from "three";
/**
 * @param {object} intersection a three.js ray caster intersection object,
 * containing: { distance, face, faceIndex, object, point }
 * https://threejs.org/docs/#api/en/core/Raycaster.intersectObject
 * @param {object} fold the FOLD file this model was loaded from
 */
const makeTouchObject = ({ distance, face, faceIndex, object, point }, fold) => {
	const vertices3d = object.geometry.attributes.position.array;
	const material = face.materialIndex;
	const normal = face.normal;
	const originalFace = fold.faces_backmap
		? fold.faces_backmap[faceIndex]
		: faceIndex;
	const triangle = faceIndex;
	const triangle_vertices = [face.a, face.b, face.c];
	const nearestFaceVertex = triangle_vertices
		.map(f => [0, 1, 2].map(n => vertices3d[f * 3 + n]))
		.map(v => new THREE.Vector3(...v))
		.map(p => p.distanceTo(point))
		.map((d, i) => ({ d, i }))
		.sort((a, b) => a.d - b.d)
		.map(el => el.i)
		.shift();
	const vertex = triangle_vertices[nearestFaceVertex];
	const triangles = fold.faces_nextmap
		? fold.faces_nextmap[originalFace]
		: faceIndex;
	return {
		point,
		vertex,
		face: originalFace,
		triangle,
		triangles,
		material,
		normal,
		distance,
	};
};
/**
 * @description Given a 3D model and a raycaster, gather helpful information
 * such as which face was intersected, what is the nearest vertex, etc..
 * @returns {object[]} array of touch objects, or empty array if none.
 */
const makeTouches = (model, raycaster) => {
	// simulator must have a model loaded
	if (!model) { return []; }
	// for every intersection point, fill it with additional
	// relevant information specific to the mesh graph.
	return raycaster
		.intersectObjects(model.getMesh())
		.map(touch => makeTouchObject(touch, model.fold));
};

export default makeTouches;
