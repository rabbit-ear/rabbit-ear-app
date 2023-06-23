import verticesFaces from "../../model/verticesFaces.js";

const calcTextureSize = (numNodes) => {
	if (numNodes === 1) return 2;
	for (let i = 0; i < numNodes; i += 1) {
		if ((2 ** (2 * i)) >= numNodes) {
			return (2 ** i);
		}
	}
	console.warn(`no texture size found for ${numNodes} items`);
	return 2;
};

const initArrays = (gpuMath, model) => {
	const numNodeFaces = verticesFaces(model)
		.reduce((a, b) => a + b.length, 0);
	const numEdges = model.nodes
		.map(n => n.numBeams())
		.reduce((a, b) => a + b, 0);
	const numFaces = model.faces_vertices.length;
	const numCreases = model.creases.length;
	// numNodeCreases + reactions
	const numNodeCreases = (numCreases * 2) + model.nodes
		.map(n => n.numCreases())
		.reduce((a, b) => a + b, 0);
	const textureDim = calcTextureSize(model.nodes.length);
	const textureDimNodeFaces = calcTextureSize(numNodeFaces);
	const textureDimEdges = calcTextureSize(numEdges);
	const textureDimCreases = calcTextureSize(numCreases);
	const textureDimNodeCreases = calcTextureSize(numNodeCreases);
	const textureDimFaces = calcTextureSize(numFaces);
	const position = new Float32Array(textureDim * textureDim * 4);
	const lastPosition = new Float32Array(textureDim * textureDim * 4);
	const lastLastPosition = new Float32Array(textureDim * textureDim * 4);
	const velocity = new Float32Array(textureDim * textureDim * 4);
	const lastVelocity = new Float32Array(textureDim * textureDim * 4);
	const meta = new Float32Array(textureDim * textureDim * 4);
	const meta2 = new Float32Array(textureDim * textureDim * 4);
	const normals = new Float32Array(textureDimFaces * textureDimFaces * 4);
	const faceVertexIndices = new Float32Array(textureDimFaces * textureDimFaces * 4);
	const nodeFaceMeta = new Float32Array(textureDimNodeFaces * textureDimNodeFaces * 4);
	const nominalTriangles = new Float32Array(textureDimFaces * textureDimFaces * 4);
	const nodeCreaseMeta = new Float32Array(textureDimNodeCreases * textureDimNodeCreases * 4);
	const creaseMeta2 = new Float32Array(textureDimCreases * textureDimCreases * 4);
	const creaseGeo = new Float32Array(textureDimCreases * textureDimCreases * 4);
	const theta = new Float32Array(textureDimCreases * textureDimCreases * 4);
	const lastTheta = new Float32Array(textureDimCreases * textureDimCreases * 4);
	return {
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
	};
};

export default initArrays;
