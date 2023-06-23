/**
 * Created by ghassaei on 9/16/16.
 */
function Beam(nodes, { axialStiffness, dampingRatio }) {
	this.type = "beam";
	this.axialStiffness = axialStiffness;
	this.dampingRatio = dampingRatio;
	nodes[0].addBeam(this);
	nodes[1].addBeam(this);
	this.vertices = [nodes[0]._originalPosition, nodes[1]._originalPosition];
	this.nodes = nodes;
	this.originalLength = this.getLength();
}

Beam.prototype.getLength = function () {
	return this.getVector().length();
};
// Beam.prototype.getOriginalLength = function () {
// 	return this.originalLength;
// };
Beam.prototype.recalcOriginalLength = function () {
	this.originalLength = this.getVector().length();
};
Beam.prototype.isFixed = function () {
	return this.nodes[0].fixed && this.nodes[1].fixed;
};
Beam.prototype.getVector = function (fromNode) {
	if (fromNode === this.nodes[1]) {
		return this.vertices[0].clone().sub(this.vertices[1]);
	}
	return this.vertices[1].clone().sub(this.vertices[0]);
};

// dynamic solve
Beam.prototype.getK = function () {
	return this.axialStiffness / this.getLength();
};
Beam.prototype.getD = function () {
	return this.dampingRatio * 2 * Math.sqrt(this.getK() * this.getMinMass());
};
Beam.prototype.getNaturalFrequency = function () {
	return Math.sqrt(this.getK() / this.getMinMass());
};
Beam.prototype.getMinMass = function () {
	let minMass = this.nodes[0].getSimMass();
	if (this.nodes[1].getSimMass() < minMass) minMass = this.nodes[1].getSimMass();
	return minMass;
};
Beam.prototype.getOtherNode = function (node) {
	if (this.nodes[0] === node) return this.nodes[1];
	return this.nodes[0];
};

// deallocate
Beam.prototype.destroy = function () {
	const self = this;
	this.nodes.forEach(node => node.removeBeam(self));
	this.vertices = null;
	this.nodes = null;
};

export default Beam;
