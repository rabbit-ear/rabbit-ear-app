/**
 * Created by amandaghassaei on 2/25/17.
 */
/**
 * @description this has been refactored from a method which returned
 * its elements in an array, where each item required knowing the
 * indices encoded: face1Ind, vertInd, face2Ind, ver2Ind, edgeInd, angle.
 * Now, it returns the same data, just inside a more descriptive object:
 * {
 *   edge: edge_index,
 *   foldAngle: foldAngle,
 *   faces: [face0, face1],
 *   vertices: [vert0, vert1],
 * }
 * Additionally, this method used to be hidden inside of the method
 * which currently resides in "prepare.js", activated by sending along
 * an optional second parameter. Now it is called directly from model/index.
 */
const getFacesAndVerticesForEdges = (fold) => {
	const allCreaseParams = [];
	const faces = fold.faces_vertices;
	for (let i = 0; i < fold.edges_vertices.length; i += 1) {
		const assignment = fold.edges_assignment[i];
		if (
			assignment !== "M" &&
			assignment !== "V" &&
			assignment !== "F" &&
			assignment !== "J"
		) {
			continue;
		}
		const edge = fold.edges_vertices[i];
		const v1 = edge[0];
		const v2 = edge[1];
		let creaseParams = [];
		const params = {};
		for (let j = 0; j < faces.length; j += 1) {
			const face = faces[j];
			const faceVerts = [face[0], face[1], face[2]];
			const v1Index = faceVerts.indexOf(v1);
			if (v1Index >= 0) {
				const v2Index = faceVerts.indexOf(v2);
				if (v2Index >= 0) {
					creaseParams.push(j);
					if (v2Index > v1Index) {
						faceVerts.splice(v2Index, 1);
						faceVerts.splice(v1Index, 1);
					} else {
						faceVerts.splice(v1Index, 1);
						faceVerts.splice(v2Index, 1);
					}
					creaseParams.push(faceVerts[0]);
					if (creaseParams.length === 4) {
						if (v2Index - v1Index === 1 || v2Index - v1Index === -2) {
							creaseParams = [
								creaseParams[2],
								creaseParams[3],
								creaseParams[0],
								creaseParams[1],
							];
						}
						creaseParams.push(i);
						const angle = fold.edges_foldAngle[i];
						creaseParams.push(angle);
						// new model instead
						params.faces = [creaseParams[0], creaseParams[2]];
						params.vertices = [creaseParams[1], creaseParams[3]];
						params.edge = creaseParams[4];
						params.foldAngle = creaseParams[5];
						// allCreaseParams.push(creaseParams);
						allCreaseParams.push(params);
						break;
					}
				}
			}
		}
	}
	return allCreaseParams;
};

export default getFacesAndVerticesForEdges;
