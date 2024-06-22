import * as THREE from "three";
import * as Materials from "./materials.js";

// todo: idea- duplicate highlighted vertex, one obeys depthTest with full
// opacity, the other is always visible with half opacity.
/**
 * @description This manager goes hand in hand with the Raycasters()
 * manager. The touch object generated from a raycast intersection will
 * be the input for this Highlights manager.
 */
const Highlights = ({ scene, simulator }) => {
	// setup highlighted point. does not adhere to depthTest
	const raycasterPointPositionAttr = new THREE.BufferAttribute(
		new Float32Array([0, 0, 0]),
		3,
	);
	raycasterPointPositionAttr.setUsage(THREE.DynamicDrawUsage);
	const raycasterPointBuffer = new THREE.BufferGeometry();
	raycasterPointBuffer.setAttribute("position", raycasterPointPositionAttr);
	const point = new THREE.Points(raycasterPointBuffer, Materials.point);
	point.renderOrder = 1000;

	// setup highlighted vertex. does not adhere to depthTest
	const raycasterVertexPositionAttr = new THREE.BufferAttribute(
		new Float32Array([0, 0, 0]),
		3,
	);
	raycasterVertexPositionAttr.setUsage(THREE.DynamicDrawUsage);
	const raycasterVertexBuffer = new THREE.BufferGeometry();
	raycasterVertexBuffer.setAttribute("position", raycasterVertexPositionAttr);
	const vertex = new THREE.Points(raycasterVertexBuffer, Materials.vertex);
	vertex.renderOrder = 1001;

	// setup highlighted face. two triangle faces, three vertices with x, y, z
	const raycasterFacePositionBuffer = new Float32Array(
		Array(2 * 3 * 3).fill(0.0),
	);
	const raycasterFacePositionAttr = new THREE.BufferAttribute(
		raycasterFacePositionBuffer,
		3,
	);
	raycasterFacePositionAttr.setUsage(THREE.DynamicDrawUsage);
	const raycasterFaceBuffer = new THREE.BufferGeometry();
	raycasterFaceBuffer.setAttribute("position", raycasterFacePositionAttr);
	const face = new THREE.Mesh(raycasterFaceBuffer, [
		Materials.frontFace,
		Materials.backFace,
	]);
	/**
	 *
	 */
	const highlightPoint = (touch) => {
		point.visible = touch.point != null;
		if (!point.visible) {
			return;
		}
		point.geometry.attributes.position.array[0] = touch.point.x;
		point.geometry.attributes.position.array[1] = touch.point.y;
		point.geometry.attributes.position.array[2] = touch.point.z;
		point.geometry.attributes.position.needsUpdate = true;
	};
	/**
	 *
	 */
	const highlightVertex = (touch) => {
		vertex.visible = touch.vertex != null;
		if (!vertex.visible) {
			return;
		}
		const vertex_coords = [0, 1, 2].map(
			(i) => simulator.model.positions[touch.vertex * 3 + i],
		);
		vertex.geometry.attributes.position.array[0] = vertex_coords[0];
		vertex.geometry.attributes.position.array[1] = vertex_coords[1];
		vertex.geometry.attributes.position.array[2] = vertex_coords[2];
		vertex.geometry.attributes.position.needsUpdate = true;
	};
	/**
	 * @description Given a list of triangle indices, make a flat array
	 * of vertices ready to be used in a BufferGeometry.
	 * @param {number[]} a list of triangle face indices
	 */
	const makeTrianglesVertexArray = (triangles) => {
		const faces = triangles
			.map((f) => simulator.model.fold.faces_vertices[f])
			.map((tri) =>
				tri.map((v) =>
					[0, 1, 2].map((i) => simulator.model.positions[v * 3 + i]),
				),
			)
			.map((tri) => tri.map((p) => ({ x: p[0], y: p[1], z: p[2] })));
		// make a copy of the faces, reverse the winding. these are for the back
		return faces.concat(faces.map((f) => f.slice().reverse())).flat();
	};
	/**
	 *
	 */
	const highlightFace = (touch) => {
		face.visible = touch.face != null;
		if (!face.visible) {
			return;
		}
		const points = makeTrianglesVertexArray(touch.triangles);
		// rebuild the triangle vertices buffer size
		const arraySize = 2 * touch.triangles.length * 3 * 3;
		const positionBuffer = new Float32Array(Array(arraySize).fill(0.0));
		const positionAttribute = new THREE.BufferAttribute(positionBuffer, 3);
		positionAttribute.setUsage(THREE.DynamicDrawUsage);
		face.geometry.setAttribute("position", positionAttribute);
		// this will tell which face gets what material
		face.geometry.clearGroups();
		face.geometry.addGroup(0, touch.triangles.length * 3, 0);
		face.geometry.addGroup(
			touch.triangles.length * 3,
			touch.triangles.length * 3,
			1,
		);
		face.geometry.setFromPoints(points);
		face.geometry.attributes.position.needsUpdate = true;
	};
	/**
	 * @description Call this method and it will hide all geometry
	 */
	const clear = () => {
		point.visible = false;
		vertex.visible = false;
		face.visible = false;
	};
	/**
	 *
	 */
	const dealloc = () => {
		if (point.geometry) {
			point.geometry.dispose();
		}
		if (vertex.geometry) {
			vertex.geometry.dispose();
		}
		if (face.geometry) {
			face.geometry.dispose();
		}
	};
	/**
	 * @description The main interface for this class. Call this method
	 * with a touch object, the result of the Raycasters() event handlers.
	 * @param {object} touch a touch object the result of the Raycasters()
	 * event handlers, what gets build inside makeTouches.js
	 */
	const highlightTouch = (touch) => {
		clear();
		if (touch === undefined) {
			return;
		}
		highlightPoint(touch);
		highlightVertex(touch);
		highlightFace(touch);
	};
	/**
	 *
	 */
	const setScene = (newScene) => {
		// remove from previous scene
		point.removeFromParent();
		vertex.removeFromParent();
		face.removeFromParent();
		// add to new scene
		if (newScene) {
			newScene.add(point);
			newScene.add(vertex);
			newScene.add(face);
		}
	};

	setScene(scene);

	return {
		point,
		vertex,
		face,
		setScene,
		highlightTouch,
		highlightPoint,
		highlightVertex,
		highlightFace,
		clear,
		dealloc,
	};
};

export default Highlights;
