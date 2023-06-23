/**
 * Created by amandaghassaei on 2/24/17.
 */
import * as THREE from "three";
import Node from "./node.js";
import Beam from "./beam.js";
import Crease from "./crease.js";
import * as Materials from "./materials.js";
import getFacesAndVerticesForEdges from "../fold/creaseParams.js";
import prepare from "../fold/prepare.js";
import exportFold from "./exportFold.js";

// buffer geometry has materialIndex property. use this for front/back colors

// no "cut" assignment. all cuts have now been turned into boundaries
const assignments = Array.from("BMVFJU");

function Model({ scene }) {
	// if the user chooses to export the 3D model, we need to reference
	// the original FOLD data. "this.fold" contains triangulated faces.
	this.fold = {};
	this.foldUnmodified = {};
	this.geometry = null;
	this.materials = {};
	this.materials.front = Materials.front;
	this.materials.back = Materials.back;
	this.materials.strain = Materials.strain;
	this.materials.line = {};
	assignments.forEach(key => {
		this.materials.line[key] = Materials.line.clone();
	});
	this.frontMesh = new THREE.Mesh(); // front face of mesh
	this.backMesh = new THREE.Mesh(); // back face of mesh (different color)
	this.lines = {};
	assignments.forEach(key => {
		this.lines[key] = new THREE.LineSegments(
			new THREE.BufferGeometry(),
			this.materials.line[key],
		);
	});
	// by default, "join" edges (result of triangulation) are not visible
	this.lines.J.visible = false;
	this.strain = false;
	this.axialStiffness = 20;
	this.joinStiffness = 0.7;
	this.creaseStiffness = 0.7;
	this.dampingRatio = 0.45;
	// vertex / color buffer arrays for GPU
	this.positions = null;
	this.colors = null;
	// these contain a bunch of information for the solver.
	this.nodes = [];
	this.edges = [];
	this.creases = [];
	this.faces_vertices = [];

	this.frontMesh.castShadow = true;
	this.frontMesh.receiveShadow = true;
	// this.backMesh.castShadow = true;
	this.backMesh.receiveShadow = true;

	this.makeNewGeometries();
	this.materialDidUpdate();
	this.setScene(scene);
}

Model.prototype.setScene = function (scene) {
	// remove from previous scene
	[this.frontMesh, this.backMesh]
		.filter(el => el.removeFromParent)
		.forEach(side => side.removeFromParent());
	Object.values(this.lines)
		.filter(el => el.removeFromParent)
		.forEach(line => line.removeFromParent());
	// add to new scene
	if (scene) {
		scene.add(this.frontMesh);
		scene.add(this.backMesh);
		Object.values(this.lines).forEach(line => scene.add(line));
	}
};

Model.prototype.makeNewGeometries = function () {
	this.geometry = new THREE.BufferGeometry();
	this.geometry.dynamic = true;
	this.frontMesh.geometry = this.geometry;
	this.backMesh.geometry = this.geometry;
	// todo: do we need to set frontside/backside dynamic?
	// this.geometry.verticesNeedUpdate = true;
	Object.values(this.lines).forEach((line) => {
		line.geometry = new THREE.BufferGeometry();
		line.geometry.dynamic = true;
		// line.geometry.verticesNeedUpdate = true;
	});
};

Model.prototype.faceMaterialDidUpdate = function () {
	this.frontMesh.material = this.strain
		? this.materials.strain
		: this.materials.front;
	this.backMesh.material = this.materials.back;
	// hide the back mesh if strain is currently enabled
	this.backMesh.visible = !this.strain;
	// this.frontMesh.material.depthWrite = false;
	// this.backMesh.material.depthWrite = false;
	this.frontMesh.material.needsUpdate = true;
	this.backMesh.material.needsUpdate = true;
};

Model.prototype.lineMaterialDidUpdate = function () {
	assignments.forEach(key => {
		this.lines[key].material = this.materials.line[key] || Materials.line.clone();
		this.lines[key].material.needsUpdate = true;
	});
};

Model.prototype.materialDidUpdate = function () {
	this.faceMaterialDidUpdate();
	this.lineMaterialDidUpdate();
};

Model.prototype.setStrain = function (strain) {
	this.strain = strain;
	this.faceMaterialDidUpdate();
};

Model.prototype.getMesh = function () { return [this.frontMesh, this.backMesh]; };

Model.prototype.needsUpdate = function () {
	if (!this.positions) { return; }
	this.geometry.attributes.position.needsUpdate = true;
	if (this.strain) { this.geometry.attributes.color.needsUpdate = true; }
	// if (vrEnabled) this.geometry.computeBoundingBox();
	// this is needed for the raycaster. even if VR is not enabled.
	this.geometry.computeBoundingBox();
};

Model.prototype.makeObjects = function (fold) {
	const options = {
		axialStiffness: this.axialStiffness,
		joinStiffnes: this.joinStiffnes,
		creaseStiffness: this.creaseStiffness,
		dampingRatio: this.dampingRatio,
	};
	this.nodes = fold.vertices_coords
		.map(vertex => new THREE.Vector3(...vertex))
		.map((vector, i) => new Node(vector.clone(), i, this));
	this.edges = fold.edges_vertices
		.map(ev => ev.map(v => this.nodes[v]))
		.map(nodes => new Beam(nodes, options));
	this.creases = getFacesAndVerticesForEdges(fold)
		.map((param, i) => new Crease(
			options,
			this.edges[param.edge],
			param.faces[0],
			param.faces[1],
			param.foldAngle * (Math.PI / 180), // up until now everything has been in degrees
			param.foldAngle !== 0 ? 1 : 0, // type
			this.nodes[param.vertices[0]],
			this.nodes[param.vertices[1]],
			i,
		));
	this.faces_vertices = fold.faces_vertices;
};

Model.prototype.makeTypedArrays = function (fold) {
	const positions = new Float32Array(fold.vertices_coords.length * 3);
	const colors = new Float32Array(fold.vertices_coords.length * 3);
	const indices = new Uint16Array(fold.faces_vertices.length * 3);
	// keys are assignments (M, V ...), values are Uint16Array
	const lineIndices = {};
	for (let i = 0; i < fold.vertices_coords.length; i += 1) {
		positions[3 * i] = fold.vertices_coords[i][0];
		positions[3 * i + 1] = fold.vertices_coords[i][1];
		positions[3 * i + 2] = fold.vertices_coords[i][2];
	}
	for (let i = 0; i < fold.faces_vertices.length; i += 1) {
		indices[3 * i] = fold.faces_vertices[i][0];
		indices[3 * i + 1] = fold.faces_vertices[i][1];
		indices[3 * i + 2] = fold.faces_vertices[i][2];
	}
	// each key is an assignment type: M, V ... the values are arrays
	// each array is a stride-2 of vertices where each pair describes
	// an edge, like [2, 5, 9, 5, ...] meaning edge between 2 & 5, 9 & 5...
	const assignmentEdgeVertices = {};
	assignments.forEach(key => { assignmentEdgeVertices[key] = []; });
	fold.edges_assignment
		.map(assignment => assignment.toUpperCase())
		.forEach((assignment, i) => {
			assignmentEdgeVertices[assignment].push(fold.edges_vertices[i][0]);
			assignmentEdgeVertices[assignment].push(fold.edges_vertices[i][1]);
		});
	// todo, do we need to release memory from last time?
	assignments.forEach((key) => {
		lineIndices[key] = new Uint16Array(assignmentEdgeVertices[key].length);
		for (let i = 0; i < assignmentEdgeVertices[key].length; i += 1) {
			lineIndices[key][i] = assignmentEdgeVertices[key][i];
		}
	});
	return {
		positions,
		colors,
		indices,
		lineIndices,
	};
};

Model.prototype.setGeometryBuffers = function ({
	positions, colors, indices, lineIndices,
}) {
	const positionsAttribute = new THREE.BufferAttribute(positions, 3);
	this.geometry.setAttribute("position", positionsAttribute);
	this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
	this.geometry.setIndex(new THREE.BufferAttribute(indices, 1));
	assignments.forEach((key) => {
		this.lines[key].geometry.setAttribute("position", positionsAttribute);
		this.lines[key].geometry.setIndex(new THREE.BufferAttribute(lineIndices[key], 1));
		// this.lines[key].geometry.attributes.position.needsUpdate = true;
		// this.lines[key].geometry.index.needsUpdate = true;
		this.lines[key].geometry.computeBoundingBox();
		this.lines[key].geometry.computeBoundingSphere();
		this.lines[key].geometry.center();
	});
	// geometry.attributes.position.needsUpdate = true;
	// geometry.index.needsUpdate = true;
	// geometry.verticesNeedUpdate = true;
	// re-scale object to unit-space and center it at the origin.
	this.geometry.computeVertexNormals();
	this.geometry.computeBoundingBox();
	this.geometry.computeBoundingSphere();
	this.geometry.center();
};
/**
 *
 */
Model.prototype.dealloc = function () {
	// console.log("--- dealloc: Model()");
	// dispose geometries
	[this.geometry, this.frontMesh.geometry, this.backMesh.geometry]
		.filter(geo => geo)
		.forEach(geo => geo.dispose());
	this.geometry = null;
	this.frontMesh.geometry = null;
	this.backMesh.geometry = null;
	Object.values(this.lines)
		.filter(line => line.geometry)
		.forEach((line) => line.geometry.dispose());
	// dispose materials
	[this.frontMesh.material, this.backMesh.material]
		.filter(material => material)
		.forEach(material => material.dispose());
	Object.values(this.lines)
		.filter(line => line.material)
		.forEach(line => line.material.dispose());
	// dispose class objects
	this.nodes.forEach(node => node.destroy());
	this.edges.forEach(edge => edge.destroy());
	this.creases.forEach(crease => crease.destroy());
	this.nodes = [];
	this.edges = [];
	this.creases = [];
};
/**
 * @description Load a new FOLD object into origami simulator.
 * Immediately following this method the solver should call .setModel()
 */
Model.prototype.load = function (foldObject) {
	this.dealloc();
	this.makeNewGeometries();
	const fold = prepare(foldObject);
	this.foldUnmodified = foldObject;
	this.fold = fold;
	this.makeObjects(fold);
	const { positions, colors, indices, lineIndices } = this.makeTypedArrays(fold);
	this.setGeometryBuffers({ positions, colors, indices, lineIndices });
	// initialize original state data
	this.nodes.forEach((node, i) => node.setOriginalPosition(
		positions[3 * i + 0],
		positions[3 * i + 1],
		positions[3 * i + 2],
	));
	this.edges.forEach(edge => edge.recalcOriginalLength());
	// save these for the solver to modify
	this.positions = positions;
	this.colors = colors;
};
/**
 *
 */
Model.prototype.export = function () {
	return exportFold(this, this.foldUnmodified, this.fold);
};
/**
 *
 */
Model.prototype.setAxialStiffness = function (value) {
	this.axialStiffness = parseFloat(value);
	this.edges.forEach(edge => { edge.axialStiffness = this.axialStiffness; });
};
/**
 *
 */
Model.prototype.setJoinStiffness = function (value) {
	this.joinStiffness = parseFloat(value);
	this.creases.forEach(crease => { crease.joinStiffness = this.joinStiffness; });
};
/**
 *
 */
Model.prototype.setCreaseStiffness = function (value) {
	this.creaseStiffness = parseFloat(value);
	this.creases.forEach(crease => { crease.creaseStiffness = this.creaseStiffness; });
};
/**
 *
 */
Model.prototype.setDampingRatio = function (value) {
	this.dampingRatio = parseFloat(value);
	this.creases.forEach(crease => { crease.dampingRatio = this.dampingRatio; });
	this.edges.forEach(edge => { edge.dampingRatio = this.dampingRatio; });
};
/**
 *
 */
Model.prototype.setFrontColor = function (color) {
	this.materials.front.color.set(color);
	this.frontMesh.material.needsUpdate = true;
};
Model.prototype.setBackColor = function (color) {
	this.materials.back.color.set(color);
	this.backMesh.material.needsUpdate = true;
};
Model.prototype.setBoundaryColor = function (color) {
	this.materials.line.B.color.set(color);
	this.lines.B.material.needsUpdate = true;
};
Model.prototype.setMountainColor = function (color) {
	this.materials.line.M.color.set(color);
	this.lines.M.material.needsUpdate = true;
};
Model.prototype.setValleyColor = function (color) {
	this.materials.line.V.color.set(color);
	this.lines.V.material.needsUpdate = true;
};
Model.prototype.setFlatColor = function (color) {
	this.materials.line.F.color.set(color);
	this.lines.F.material.needsUpdate = true;
};
Model.prototype.setUnassignedColor = function (color) {
	this.materials.line.U.color.set(color);
	this.lines.U.material.needsUpdate = true;
};
Model.prototype.setJoinColor = function (color) {
	this.materials.line.J.color.set(color);
	this.lines.J.material.needsUpdate = true;
};
Model.prototype.setLineColor = function (color) {
	assignments.forEach(key => {
		this.materials.line[key].color.set(color);
	});
	this.lineMaterialDidUpdate();
};
/**
 *
 */
const setNewFaceMaterial = (model, material, key) => {
	if (model.materials[key]) { model.materials[key].dispose(); }
	model.materials[key] = material;
	model.faceMaterialDidUpdate();
};
Model.prototype.setMaterialFront = function (material) {
	setNewFaceMaterial(this, material, "front");
};
Model.prototype.setMaterialBack = function (material) {
	setNewFaceMaterial(this, material, "back");
};
Model.prototype.setMaterialStrain = function (material) {
	setNewFaceMaterial(this, material, "strain");
};
/**
 * @param {object} material a three js material
 * @param {string} assignments a list of the assignment(s)
 * you want to apply this material to.
 */
Model.prototype.setMaterialLine = function (material, assignmentsOptions = []) {
	const keys = assignmentsOptions.length
		? assignmentsOptions
			.filter(a => typeof a === "string")
			.map(str => str.toUpperCase())
		: assignments;
	keys.forEach(key => this.materials.line[key].dispose());
	keys.forEach(key => { this.materials.line[key] = material; });
	this.lineMaterialDidUpdate();
};

export default Model;
