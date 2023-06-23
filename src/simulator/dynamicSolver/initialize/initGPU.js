import DEFAULTS from "./defaults.js";
import { float_type } from "../constants.js";
import {
	vertexShader,
	positionCalcShader,
	velocityCalcVerletShader,
	velocityCalcShader,
	positionCalcVerletShader,
	thetaCalcShader,
	normalCalc,
	packToBytesShader,
	zeroTexture,
	zeroThetaTexture,
	centerTexture,
	copyTexture,
	updateCreaseGeo,
} from "../shaders/shaders.js";
/**
 * @description This method is called when a new model is loaded.
 * This allocates all space needed for communication back and forth
 * with the GPU.
 * @param {object} options these options are not required, if empty it
 * will default to origami simulator's default settings.
 */
const initGPU = (gpuMath, {
	textureDim,
	textureDimEdges,
	textureDimFaces,
	textureDimCreases,
	textureDimNodeFaces,
	textureDimNodeCreases,
	position,
	lastPosition,
	lastLastPosition,
	velocity,
	lastVelocity,
	meta,
	meta2,
	normals,
	faceVertexIndices,
	nodeFaceMeta,
	nominalTriangles,
	nodeCreaseMeta,
	creaseMeta2,
	creaseGeo,
	theta,
	lastTheta,
}, options = {}) => {
	const defaults = { ...DEFAULTS, ...options };

	gpuMath.initTextureFromData("u_position", textureDim, textureDim, float_type, position, true);
	gpuMath.initTextureFromData("u_lastPosition", textureDim, textureDim, float_type, lastPosition, true);
	gpuMath.initTextureFromData("u_lastLastPosition", textureDim, textureDim, float_type, lastLastPosition, true);
	gpuMath.initTextureFromData("u_velocity", textureDim, textureDim, float_type, velocity, true);
	gpuMath.initTextureFromData("u_lastVelocity", textureDim, textureDim, float_type, lastVelocity, true);
	gpuMath.initTextureFromData("u_theta", textureDimCreases, textureDimCreases, float_type, theta, true);
	gpuMath.initTextureFromData("u_lastTheta", textureDimCreases, textureDimCreases, float_type, lastTheta, true);
	gpuMath.initTextureFromData("u_normals", textureDimFaces, textureDimFaces, float_type, normals, true);

	gpuMath.initFrameBufferForTexture("u_position", true);
	gpuMath.initFrameBufferForTexture("u_lastPosition", true);
	gpuMath.initFrameBufferForTexture("u_lastLastPosition", true);
	gpuMath.initFrameBufferForTexture("u_velocity", true);
	gpuMath.initFrameBufferForTexture("u_lastVelocity", true);
	gpuMath.initFrameBufferForTexture("u_theta", true);
	gpuMath.initFrameBufferForTexture("u_lastTheta", true);
	gpuMath.initFrameBufferForTexture("u_normals", true);

	gpuMath.initTextureFromData("u_meta", textureDim, textureDim, float_type, meta, true);
	gpuMath.initTextureFromData("u_meta2", textureDim, textureDim, float_type, meta2, true);
	gpuMath.initTextureFromData("u_nominalTrinagles", textureDimFaces, textureDimFaces, float_type, nominalTriangles, true);
	gpuMath.initTextureFromData("u_nodeCreaseMeta", textureDimNodeCreases, textureDimNodeCreases, float_type, nodeCreaseMeta, true);
	gpuMath.initTextureFromData("u_creaseMeta2", textureDimCreases, textureDimCreases, float_type, creaseMeta2, true);
	gpuMath.initTextureFromData("u_nodeFaceMeta", textureDimNodeFaces, textureDimNodeFaces, float_type, nodeFaceMeta, true);
	gpuMath.initTextureFromData("u_creaseGeo", textureDimCreases, textureDimCreases, float_type, creaseGeo, true);
	gpuMath.initFrameBufferForTexture("u_creaseGeo", true);
	gpuMath.initTextureFromData("u_faceVertexIndices", textureDimFaces, textureDimFaces, float_type, faceVertexIndices, true);
	gpuMath.initTextureFromData("u_nominalTriangles", textureDimFaces, textureDimFaces, float_type, nominalTriangles, true);

	gpuMath.createProgram("positionCalc", vertexShader, positionCalcShader);
	gpuMath.setUniformForProgram("positionCalc", "u_velocity", 0, "1i");
	gpuMath.setUniformForProgram("positionCalc", "u_lastPosition", 1, "1i");
	gpuMath.setUniformForProgram("positionCalc", "u_mass", 2, "1i");
	gpuMath.setUniformForProgram("positionCalc", "u_textureDim", [textureDim, textureDim], "2f");

	gpuMath.createProgram("velocityCalcVerlet", vertexShader, velocityCalcVerletShader);
	gpuMath.setUniformForProgram("velocityCalcVerlet", "u_position", 0, "1i");
	gpuMath.setUniformForProgram("velocityCalcVerlet", "u_lastPosition", 1, "1i");
	gpuMath.setUniformForProgram("velocityCalcVerlet", "u_mass", 2, "1i");
	gpuMath.setUniformForProgram("velocityCalcVerlet", "u_textureDim", [textureDim, textureDim], "2f");

	gpuMath.createProgram("velocityCalc", vertexShader, velocityCalcShader);
	gpuMath.setUniformForProgram("velocityCalc", "u_lastPosition", 0, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_lastVelocity", 1, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_originalPosition", 2, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_externalForces", 3, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_mass", 4, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_meta", 5, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_beamMeta", 6, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_creaseMeta", 7, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_nodeCreaseMeta", 8, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_normals", 9, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_theta", 10, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_creaseGeo", 11, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_meta2", 12, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_nodeFaceMeta", 13, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_nominalTriangles", 14, "1i");
	gpuMath.setUniformForProgram("velocityCalc", "u_textureDim", [textureDim, textureDim], "2f");
	gpuMath.setUniformForProgram("velocityCalc", "u_textureDimEdges", [textureDimEdges, textureDimEdges], "2f");
	gpuMath.setUniformForProgram("velocityCalc", "u_textureDimFaces", [textureDimFaces, textureDimFaces], "2f");
	gpuMath.setUniformForProgram("velocityCalc", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");
	gpuMath.setUniformForProgram("velocityCalc", "u_textureDimNodeCreases", [textureDimNodeCreases, textureDimNodeCreases], "2f");
	gpuMath.setUniformForProgram("velocityCalc", "u_textureDimNodeFaces", [textureDimNodeFaces, textureDimNodeFaces], "2f");
	gpuMath.setUniformForProgram("velocityCalc", "u_creasePercent", defaults.creasePercent, "1f");
	gpuMath.setUniformForProgram("velocityCalc", "u_axialStiffness", defaults.axialStiffness, "1f");
	gpuMath.setUniformForProgram("velocityCalc", "u_faceStiffness", defaults.faceStiffness, "1f");
	gpuMath.setUniformForProgram("velocityCalc", "u_calcFaceStrain", defaults.calcFaceStrain, "1f");

	gpuMath.createProgram("positionCalcVerlet", vertexShader, positionCalcVerletShader);
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_lastPosition", 0, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_lastLastPosition", 1, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_lastVelocity", 2, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_originalPosition", 3, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_externalForces", 4, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_mass", 5, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_meta", 6, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_beamMeta", 7, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_creaseMeta", 8, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_nodeCreaseMeta", 9, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_normals", 10, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_theta", 11, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_creaseGeo", 12, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_meta2", 13, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_nodeFaceMeta", 14, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_nominalTriangles", 15, "1i");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDim", [textureDim, textureDim], "2f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimEdges", [textureDimEdges, textureDimEdges], "2f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimFaces", [textureDimFaces, textureDimFaces], "2f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimNodeCreases", [textureDimNodeCreases, textureDimNodeCreases], "2f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimNodeFaces", [textureDimNodeFaces, textureDimNodeFaces], "2f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_creasePercent", defaults.creasePercent, "1f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_axialStiffness", defaults.axialStiffness, "1f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_faceStiffness", defaults.faceStiffness, "1f");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_calcFaceStrain", defaults.calcFaceStrain, "1f");

	gpuMath.createProgram("thetaCalc", vertexShader, thetaCalcShader);
	gpuMath.setUniformForProgram("thetaCalc", "u_normals", 0, "1i");
	gpuMath.setUniformForProgram("thetaCalc", "u_lastTheta", 1, "1i");
	gpuMath.setUniformForProgram("thetaCalc", "u_creaseVectors", 2, "1i");
	gpuMath.setUniformForProgram("thetaCalc", "u_lastPosition", 3, "1i");
	gpuMath.setUniformForProgram("thetaCalc", "u_originalPosition", 4, "1i");
	gpuMath.setUniformForProgram("thetaCalc", "u_textureDim", [textureDim, textureDim], "2f");
	gpuMath.setUniformForProgram("thetaCalc", "u_textureDimFaces", [textureDimFaces, textureDimFaces], "2f");
	gpuMath.setUniformForProgram("thetaCalc", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");

	gpuMath.createProgram("normalCalc", vertexShader, normalCalc);
	gpuMath.setUniformForProgram("normalCalc", "u_faceVertexIndices", 0, "1i");
	gpuMath.setUniformForProgram("normalCalc", "u_lastPosition", 1, "1i");
	gpuMath.setUniformForProgram("normalCalc", "u_originalPosition", 2, "1i");
	gpuMath.setUniformForProgram("normalCalc", "u_textureDim", [textureDim, textureDim], "2f");
	gpuMath.setUniformForProgram("normalCalc", "u_textureDimFaces", [textureDimFaces, textureDimFaces], "2f");

	gpuMath.createProgram("packToBytes", vertexShader, packToBytesShader);
	gpuMath.initTextureFromData("outputBytes", textureDim * 4, textureDim, "UNSIGNED_BYTE", null, true);
	gpuMath.initFrameBufferForTexture("outputBytes", true);
	gpuMath.setUniformForProgram("packToBytes", "u_floatTextureDim", [textureDim, textureDim], "2f");
	gpuMath.setUniformForProgram("packToBytes", "u_floatTexture", 0, "1i");

	gpuMath.createProgram("zeroTexture", vertexShader, zeroTexture);
	gpuMath.createProgram("zeroThetaTexture", vertexShader, zeroThetaTexture);
	gpuMath.setUniformForProgram("zeroThetaTexture", "u_theta", 0, "1i");
	gpuMath.setUniformForProgram("zeroThetaTexture", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");

	gpuMath.createProgram("centerTexture", vertexShader, centerTexture);
	gpuMath.setUniformForProgram("centerTexture", "u_lastPosition", 0, "1i");
	gpuMath.setUniformForProgram("centerTexture", "u_textureDim", [textureDim, textureDim], "2f");

	gpuMath.createProgram("copyTexture", vertexShader, copyTexture);
	gpuMath.setUniformForProgram("copyTexture", "u_orig", 0, "1i");
	gpuMath.setUniformForProgram("copyTexture", "u_textureDim", [textureDim, textureDim], "2f");

	gpuMath.createProgram("updateCreaseGeo", vertexShader, updateCreaseGeo);
	gpuMath.setUniformForProgram("updateCreaseGeo", "u_lastPosition", 0, "1i");
	gpuMath.setUniformForProgram("updateCreaseGeo", "u_originalPosition", 1, "1i");
	gpuMath.setUniformForProgram("updateCreaseGeo", "u_creaseMeta2", 2, "1i");
	gpuMath.setUniformForProgram("updateCreaseGeo", "u_textureDim", [textureDim, textureDim], "2f");
	gpuMath.setUniformForProgram("updateCreaseGeo", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");

	gpuMath.setSize(textureDim, textureDim);
};

export default initGPU;
