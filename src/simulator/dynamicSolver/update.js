import { float_type } from "./constants.js";

export const updateMaterials = (
	gpuMath,
	model,
	{ meta, beamMeta, textureDimEdges },
	initing = false,
) => {
	let index = 0;
	for (let i = 0; i < model.nodes.length; i += 1) {
		if (initing) {
			meta[4 * i] = index;
			meta[4 * i + 1] = model.nodes[i].numBeams();
		}
		for (let j = 0; j < model.nodes[i].beams.length; j += 1) {
			const beam = model.nodes[i].beams[j];
			beamMeta[4 * index] = beam.getK();
			beamMeta[4 * index + 1] = beam.getD();
			if (initing) {
				beamMeta[4 * index + 2] = beam.getLength();
				beamMeta[4 * index + 3] = beam.getOtherNode(model.nodes[i]).getIndex();
			}
			index += 1;
		}
	}
	gpuMath.initTextureFromData("u_beamMeta", textureDimEdges, textureDimEdges, float_type, beamMeta, true);
};

export const updateExternalForces = (gpuMath, model, { externalForces, textureDim }) => {
	for (let i = 0; i < model.nodes.length; i += 1) {
		const externalForce = model.nodes[i].getExternalForce();
		externalForces[4 * i] = externalForce.x;
		externalForces[4 * i + 1] = externalForce.y;
		externalForces[4 * i + 2] = externalForce.z;
	}
	gpuMath.initTextureFromData("u_externalForces", textureDim, textureDim, float_type, externalForces, true);
};

export const updateFixed = (gpuMath, model, { mass, textureDim }) => {
	for (let i = 0; i < model.nodes.length; i += 1) {
		mass[4 * i + 1] = (model.nodes[i].isFixed() ? 1 : 0);
	}
	gpuMath.initTextureFromData("u_mass", textureDim, textureDim, float_type, mass, true);
};

export const updateOriginalPosition = (gpuMath, model, { originalPosition, textureDim }) => {
	for (let i = 0; i < model.nodes.length; i += 1) {
		const origPosition = model.nodes[i].getOriginalPosition();
		originalPosition[4 * i] = origPosition.x;
		originalPosition[4 * i + 1] = origPosition.y;
		originalPosition[4 * i + 2] = origPosition.z;
	}
	gpuMath.initTextureFromData("u_originalPosition", textureDim, textureDim, float_type, originalPosition, true);
};

export const updateCreaseVectors = (gpuMath, model, { creaseVectors, textureDimCreases }) => {
	for (let i = 0; i < model.creases.length; i += 1) {
		const rgbaIndex = i * 4;
		const nodes = model.creases[i].edge.nodes;
		// this.vertices[1].clone().sub(this.vertices[0]);
		creaseVectors[rgbaIndex] = nodes[0].getIndex();
		creaseVectors[rgbaIndex + 1] = nodes[1].getIndex();
	}
	gpuMath.initTextureFromData("u_creaseVectors", textureDimCreases, textureDimCreases, float_type, creaseVectors, true);
};

export const updateCreasesMeta = (
	gpuMath,
	model,
	{ creaseMeta, textureDimCreases },
	initing = false,
) => {
	for (let i = 0; i < model.creases.length; i += 1) {
		const crease = model.creases[i];
		creaseMeta[i * 4] = crease.getK();
		// creaseMeta[i * 4 + 1] = crease.getD();
	}
	if (initing) {
		for (let i = 0; i < model.creases.length; i += 1) {
			const crease = model.creases[i];
			creaseMeta[i * 4 + 2] = crease.getTargetTheta();
		}
	}
	gpuMath.initTextureFromData("u_creaseMeta", textureDimCreases, textureDimCreases, float_type, creaseMeta, true);
};

export const updateLastPosition = (gpuMath, model, { lastPosition, textureDim }) => {
	for (let i = 0; i < model.nodes.length; i += 1) {
		const _position = model.nodes[i].getRelativePosition();
		lastPosition[4 * i] = _position.x;
		lastPosition[4 * i + 1] = _position.y;
		lastPosition[4 * i + 2] = _position.z;
	}
	gpuMath.initTextureFromData("u_lastPosition", textureDim, textureDim, float_type, lastPosition, true);
	gpuMath.initFrameBufferForTexture("u_lastPosition", true);
};
