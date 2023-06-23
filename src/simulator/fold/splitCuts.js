/**
 * Created by amandaghassaei on 2/25/17.
 */
function facesVerticesToVerticesFaces(fold) {
	const verticesFaces = [];
	for (let i = 0; i < fold.vertices_coords.length; i += 1) {
		verticesFaces.push([]);
	}
	for (let i = 0; i < fold.faces_vertices.length; i += 1) {
		const face = fold.faces_vertices[i];
		for (let j = 0; j < face.length; j += 1) {
			verticesFaces[face[j]].push(i);
		}
	}
	fold.vertices_faces = verticesFaces;
	return fold;
}

function connectedByFace(fold, verticesFaces, vert1, vert2) {
	if (vert1 === vert2) return false;
	for (let a = 0; a < verticesFaces.length; a += 1) {
		const face = fold.faces_vertices[verticesFaces[a]];
		if (face.indexOf(vert1) >= 0 && face.indexOf(vert2) >= 0) {
			return true;
		}
	}
	return false;
}

function sortVerticesEdges(fold) {
	for (let i = 0; i < fold.vertices_vertices.length; i += 1) {
		const verticesVertices = fold.vertices_vertices[i];
		const verticesEdges = fold.vertices_edges[i];
		const sortedVerticesEdges = [];
		for (let j = 0; j < verticesVertices.length; j += 1) {
			let index = -1;
			for (let k = 0; k < verticesEdges.length; k += 1) {
				const edgeIndex = verticesEdges[k];
				const edge = fold.edges_vertices[edgeIndex];
				if (edge.indexOf(verticesVertices[j]) >= 0) {
					index = edgeIndex;
					break;
				}
			}
			if (index < 0) { console.warn("origami simulator, no matching edge found"); }
			sortedVerticesEdges.push(index);
		}
		fold.vertices_edges[i] = sortedVerticesEdges;
	}
	return fold;
}

const splitCuts = (fold) => {
	fold = sortVerticesEdges(fold);
	fold = facesVerticesToVerticesFaces(fold);
	// go around each vertex and split cut in clockwise order
	for (let i = 0; i < fold.vertices_edges.length; i += 1) {
		const groups = [[]];
		let groupIndex = 0;
		const verticesEdges = fold.vertices_edges[i];
		const verticesFaces = fold.vertices_faces[i];
		for (let j = 0; j < verticesEdges.length; j += 1) {
			const edgeIndex = verticesEdges[j];
			const assignment = fold.edges_assignment[edgeIndex];
			groups[groupIndex].push(edgeIndex);
			if (assignment === "C") {
				// split cut edge into two boundary edges
				groups.push([fold.edges_vertices.length]);
				groupIndex += 1;
				const newEdgeIndex = fold.edges_vertices.length;
				const edge = fold.edges_vertices[edgeIndex];
				fold.edges_vertices.push([edge[0], edge[1]]);
				fold.edges_assignment[edgeIndex] = "B";
				fold.edges_foldAngle.push(null);
				fold.edges_assignment.push("B");
				// add new boundary edge to other vertex
				let otherVertex = edge[0];
				if (otherVertex === i) otherVertex = edge[1];
				const otherVertexEdges = fold.vertices_edges[otherVertex];
				const otherVertexEdgeIndex = otherVertexEdges.indexOf(edgeIndex);
				otherVertexEdges.splice(otherVertexEdgeIndex, 0, newEdgeIndex);
			} else if (assignment === "B") {
				if (j === 0 && verticesEdges.length > 1) {
					// check if next edge is also boundary
					const nextEdgeIndex = verticesEdges[1];
					if (fold.edges_assignment[nextEdgeIndex] === "B") {
						// check if this edge shares a face with the next
						const edge = fold.edges_vertices[edgeIndex];
						let otherVertex = edge[0];
						if (otherVertex === i) { otherVertex = edge[1]; }
						const nextEdge = fold.edges_vertices[nextEdgeIndex];
						let nextVertex = nextEdge[0];
						if (nextVertex === i) { nextVertex = nextEdge[1]; }
						if (connectedByFace(fold, fold.vertices_faces[i], otherVertex, nextVertex)) {
						} else {
							groups.push([]);
							groupIndex += 1;
						}
					}
				} else if (groups[groupIndex].length > 1) {
					groups.push([]);
					groupIndex += 1;
				}
			}
		}
		if (groups.length <= 1) { continue; }
		for (let k = groups[groupIndex].length - 1; k >= 0; k -= 1) {
			// put remainder of last group in first group
			groups[0].unshift(groups[groupIndex][k]);
		}
		groups.pop();
		for (let j = 1; j < groups.length; j += 1) { // for each extra group, assign new vertex
			const currentVertex = fold.vertices_coords[i];
			const vertIndex = fold.vertices_coords.length;
			fold.vertices_coords.push(currentVertex.slice()); // make a copy
			const connectingIndices = [];
			for (let k = 0; k < groups[j].length; k += 1) { // update edges_vertices
				const edgeIndex = groups[j][k];
				const edge = fold.edges_vertices[edgeIndex];
				let otherIndex = edge[0];
				if (edge[0] === i) {
					edge[0] = vertIndex;
					otherIndex = edge[1];
				} else edge[1] = vertIndex;
				connectingIndices.push(otherIndex);
			}
			if (connectingIndices.length < 2) {
				console.warn("origami simulator, splitCuts problem");
			} else {
				for (let k = 1; k < connectingIndices.length; k += 1) { // update faces_vertices
					// i, k-1, k
					const thisConnectingVertIndex = connectingIndices[k];
					const previousConnectingVertIndex = connectingIndices[k - 1];
					let found = false;
					for (let a = 0; a < verticesFaces.length; a += 1) {
						const face = fold.faces_vertices[verticesFaces[a]];
						const index1 = face.indexOf(thisConnectingVertIndex);
						const index2 = face.indexOf(previousConnectingVertIndex);
						const index3 = face.indexOf(i);
						if (index1 >= 0 && index2 >= 0 && index3 >= 0
							&& (Math.abs(index1 - index3) === 1
								|| Math.abs(index1 - index3) === face.length - 1)
							&& (Math.abs(index2 - index3) === 1
								|| Math.abs(index2 - index3) === face.length - 1)) {
							found = true;
							face[index3] = vertIndex;
							break;
						}
					}
					if (!found) console.warn("origami simulator, splitCuts problem");
				}
			}
		}
	}
	// these are all incorrect now. delete them.
	delete fold.vertices_faces;
	delete fold.vertices_edges;
	delete fold.vertices_vertices;
	return fold;
};

export default splitCuts;
