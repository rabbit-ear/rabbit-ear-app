import * as THREE from "three";

const strainClip = 0.5;

export const solveStep = (
	gpuMath,
	{ textureDim, textureDimCreases, textureDimFaces, integrationType },
) => {
	gpuMath.setProgram("normalCalc");
	gpuMath.setSize(textureDimFaces, textureDimFaces);
	gpuMath.step("normalCalc", ["u_faceVertexIndices", "u_lastPosition", "u_originalPosition"], "u_normals");
	gpuMath.setProgram("thetaCalc");
	gpuMath.setSize(textureDimCreases, textureDimCreases);
	gpuMath.step("thetaCalc", ["u_normals", "u_lastTheta", "u_creaseVectors", "u_lastPosition",
		"u_originalPosition"], "u_theta");
	gpuMath.setProgram("updateCreaseGeo");
	// already at textureDimCreasesxtextureDimCreases
	gpuMath.step("updateCreaseGeo", ["u_lastPosition", "u_originalPosition", "u_creaseMeta2"], "u_creaseGeo");
	switch (integrationType) {
	case "verlet":
		gpuMath.setProgram("positionCalcVerlet");
		gpuMath.setSize(textureDim, textureDim);
		gpuMath.step("positionCalcVerlet", ["u_lastPosition", "u_lastLastPosition", "u_lastVelocity", "u_originalPosition", "u_externalForces",
			"u_mass", "u_meta", "u_beamMeta", "u_creaseMeta", "u_nodeCreaseMeta", "u_normals", "u_theta", "u_creaseGeo",
			"u_meta2", "u_nodeFaceMeta", "u_nominalTriangles"], "u_position");
		gpuMath.step("velocityCalcVerlet", ["u_position", "u_lastPosition", "u_mass"], "u_velocity");
		gpuMath.swapTextures("u_lastPosition", "u_lastLastPosition");
		break;
	case "euler":
	default:
		gpuMath.setProgram("velocityCalc");
		gpuMath.setSize(textureDim, textureDim);
		gpuMath.step("velocityCalc", ["u_lastPosition", "u_lastVelocity", "u_originalPosition", "u_externalForces",
			"u_mass", "u_meta", "u_beamMeta", "u_creaseMeta", "u_nodeCreaseMeta", "u_normals", "u_theta", "u_creaseGeo",
			"u_meta2", "u_nodeFaceMeta", "u_nominalTriangles"], "u_velocity");
		gpuMath.step("positionCalc", ["u_velocity", "u_lastPosition", "u_mass"], "u_position");
		break;
	}
	gpuMath.swapTextures("u_theta", "u_lastTheta");
	gpuMath.swapTextures("u_velocity", "u_lastVelocity");
	gpuMath.swapTextures("u_position", "u_lastPosition");
};

/**
 * @description todo
 * @returns {number} the global error as a percent
 */
export const render = (gpuMath, model, { textureDim, axialStrain }) => {
	if (!gpuMath) { return 0; }
	const vectorLength = 4;
	gpuMath.setProgram("packToBytes");
	gpuMath.setUniformForProgram("packToBytes", "u_vectorLength", vectorLength, "1f");
	gpuMath.setUniformForProgram("packToBytes", "u_floatTextureDim", [textureDim, textureDim], "2f");
	gpuMath.setSize(textureDim * vectorLength, textureDim);
	gpuMath.step("packToBytes", ["u_lastPosition"], "outputBytes");

	if (!gpuMath.readyToRead()) { return 0; }
	const numPixels = model.nodes.length * vectorLength;
	const height = Math.ceil(numPixels / (textureDim * vectorLength));
	const pixels = new Uint8Array(height * textureDim * 4 * vectorLength);
	gpuMath.readPixels(0, 0, textureDim * vectorLength, height, pixels);
	const parsedPixels = new Float32Array(pixels.buffer);
	let globalError = 0;
	for (let i = 0; i < model.nodes.length; i += 1) {
		const rgbaIndex = i * vectorLength;
		let nodeError = parsedPixels[rgbaIndex + 3] * 100;
		globalError += nodeError;
		const nodePosition = new THREE.Vector3(
			parsedPixels[rgbaIndex],
			parsedPixels[rgbaIndex + 1],
			parsedPixels[rgbaIndex + 2],
		);
		nodePosition.add(model.nodes[i]._originalPosition);
		model.positions[3 * i] = nodePosition.x;
		model.positions[3 * i + 1] = nodePosition.y;
		model.positions[3 * i + 2] = nodePosition.z;
		if (axialStrain) {
			if (nodeError > strainClip) nodeError = strainClip;
			const scaledVal = (1 - nodeError / strainClip) * 0.7;
			const color = new THREE.Color();
			color.setHSL(scaledVal, 1, 0.5);
			model.colors[3 * i] = color.r;
			model.colors[3 * i + 1] = color.g;
			model.colors[3 * i + 2] = color.b;
		}
	}
	return globalError / model.nodes.length;
};
