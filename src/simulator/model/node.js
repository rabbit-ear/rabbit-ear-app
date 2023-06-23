/**
 * Created by ghassaei on 9/16/16.
 */
import * as THREE from "three";

function Node(position, index, model) {
	this.type = "node";
	this.index = index;
	this._originalPosition = position.clone();

	this.beams = [];
	this.creases = [];
	this.invCreases = [];
	this.externalForce = null;
	this.fixed = false;

	// todo: would be nice if node didn't need reference to the model.
	this.model = model;
	// this.render(new THREE.Vector3(0,0,0));
}

Node.prototype.setFixed = function (fixed) {
	this.fixed = fixed;
	if (this.externalForce) {
		if (fixed) {
			this.externalForce.hide();
		} else {
			this.externalForce.show();
		}
	}
};

Node.prototype.isFixed = function () {
	return this.fixed;
};

// forces

Node.prototype.addExternalForce = function (force) {
	// this.externalForce = force;
	// var position = this.getOriginalPosition();
	// this.externalForce.setOrigin(position);
	// if (this.fixed) this.externalForce.hide();
};

Node.prototype.getExternalForce = function () {
	return (!this.externalForce)
		? new THREE.Vector3(0, 0, 0)
		: this.externalForce.getForce();
};

Node.prototype.addCrease = function (crease) {
	this.creases.push(crease);
};

Node.prototype.removeCrease = function (crease) {
	if (this.creases === null) { return; }
	const index = this.creases.indexOf(crease);
	if (index >= 0) this.creases.splice(index, 1);
};

Node.prototype.addInvCrease = function (crease) {
	this.invCreases.push(crease);
};

Node.prototype.removeInvCrease = function (crease) {
	if (this.invCreases === null) { return; }
	const index = this.invCreases.indexOf(crease);
	if (index >= 0) this.invCreases.splice(index, 1);
};

Node.prototype.addBeam = function (beam) {
	this.beams.push(beam);
};

Node.prototype.removeBeam = function (beam) {
	if (this.beams === null) { return; }
	const index = this.beams.indexOf(beam);
	if (index >= 0) this.beams.splice(index, 1);
};

Node.prototype.getBeams = function () {
	return this.beams;
};

Node.prototype.numBeams = function () {
	return this.beams.length;
};

Node.prototype.isConnectedTo = function (node) {
	for (let i = 0; i < this.beams.length; i += 1) {
		if (this.beams[i].getOtherNode(this) === node) return true;
	}
	return false;
};

Node.prototype.numCreases = function () {
	return this.creases.length;
};

Node.prototype.getIndex = function () { // in nodes array
	return this.index;
};

// dynamic solve

Node.prototype.getOriginalPosition = function () {
	return this._originalPosition.clone();
};
Node.prototype.setOriginalPosition = function (x, y, z) {
	this._originalPosition.set(x, y, z);
};

Node.prototype.getPosition = function () {
	// const positions = this.getPositionsArray();
	const i = this.getIndex();
	return new THREE.Vector3(
		this.model.positions[3 * i],
		this.model.positions[3 * i + 1],
		this.model.positions[3 * i + 2],
	);
};

Node.prototype.moveManually = function (position) {
	// const positions = this.getPositionsArray();
	const i = this.getIndex();
	this.model.positions[3 * i] = position.x;
	this.model.positions[3 * i + 1] = position.y;
	this.model.positions[3 * i + 2] = position.z;
};

Node.prototype.getRelativePosition = function () {
	return this.getPosition().sub(this._originalPosition);
};

Node.prototype.getSimMass = function () {
	return 1;
};

Node.prototype.destroy = function () {
	this.object3D = null;
	this.beams = null;
	this.creases = null;
	this.invCreases = null;
	this.externalForce = null;
};

export default Node;
