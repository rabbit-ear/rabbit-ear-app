/**
 * Created by amandaghassaei on 2/25/17.
 */
import type { FOLD } from "../types.ts";
import { resize3 } from "../general/math.ts";

const makeVerticesFaces = ({
  vertices_coords,
  faces_vertices,
}: FOLD): (number | null | undefined)[][] => {
  const verticesFaces: (number | null | undefined)[][] = [];
  for (let i = 0; i < vertices_coords.length; i += 1) {
    verticesFaces.push([]);
  }
  for (let i = 0; i < faces_vertices.length; i += 1) {
    const face = faces_vertices[i];
    for (let j = 0; j < face.length; j += 1) {
      verticesFaces[face[j]].push(i);
    }
  }
  return verticesFaces;
};

const connectedByFace = (
  { faces_vertices }: FOLD,
  vertexFaces: (number | null | undefined)[],
  vert1: number,
  vert2: number,
): boolean => {
  if (vert1 === vert2) return false;
  for (let a = 0; a < vertexFaces.length; a += 1) {
    const f = vertexFaces[a];
    if (f === null || f === undefined) {
      continue;
    }
    const face = faces_vertices[f];
    if (face.indexOf(vert1) >= 0 && face.indexOf(vert2) >= 0) {
      return true;
    }
  }
  return false;
};

/**
 *
 */
const sortVerticesEdges = ({
  vertices_vertices,
  vertices_edges,
  edges_vertices,
}: FOLD): number[][] | undefined => {
  if (!vertices_vertices || !vertices_edges || !edges_vertices) {
    console.warn("sort vertices_edges early exit");
    return undefined;
  }
  for (let i = 0; i < vertices_vertices.length; i += 1) {
    const verticesVertices = vertices_vertices[i];
    const verticesEdges = vertices_edges[i];
    const sortedVerticesEdges: number[] = [];
    for (let j = 0; j < verticesVertices.length; j += 1) {
      let index = -1;
      for (let k = 0; k < verticesEdges.length; k += 1) {
        const edgeIndex = verticesEdges[k];
        const edge = edges_vertices[edgeIndex];
        if (edge.indexOf(verticesVertices[j]) >= 0) {
          index = edgeIndex;
          break;
        }
      }
      if (index < 0) {
        console.warn("origami simulator, no matching edge found");
      }
      sortedVerticesEdges.push(index);
    }
    vertices_edges[i] = sortedVerticesEdges;
  }
  return vertices_edges;
};

const splitCuts = ({
  vertices_coords,
  vertices_vertices,
  vertices_edges,
  edges_vertices,
  edges_assignment,
  edges_foldAngle,
  faces_vertices,
}: FOLD): FOLD => {
  vertices_edges = sortVerticesEdges({
    vertices_vertices,
    vertices_edges,
    edges_vertices,
  });
  const vertices_faces = makeVerticesFaces({ vertices_coords, faces_vertices });
  if (!vertices_vertices || !vertices_edges || !vertices_faces) {
    console.warn("split cuts early exit");
    return {
      vertices_coords,
      edges_vertices,
      edges_assignment,
      edges_foldAngle,
      faces_vertices,
    };
  }

  // go around each vertex and split cut in clockwise order
  for (let i = 0; i < vertices_edges.length; i += 1) {
    const groups: number[][] = [[]];
    let groupIndex = 0;
    const verticesEdges = vertices_edges[i];
    const verticesFaces = vertices_faces[i];
    for (let j = 0; j < verticesEdges.length; j += 1) {
      const edgeIndex = verticesEdges[j];
      const assignment = edges_assignment[edgeIndex];
      groups[groupIndex].push(edgeIndex);

      if (assignment === "C") {
        // split cut edge into two boundary edges
        groups.push([edges_vertices.length]);
        groupIndex += 1;
        const newEdgeIndex = edges_vertices.length;
        const edge = edges_vertices[edgeIndex];
        edges_vertices.push([edge[0], edge[1]]);
        edges_assignment[edgeIndex] = "B";
        // null was placed here before fold spec was formalized to not include nulls
        //fold.edges_foldAngle.push(null);
        edges_foldAngle.push(0);
        edges_assignment.push("B");

        // add new boundary edge to other vertex
        let otherVertex = edge[0];
        if (otherVertex === i) otherVertex = edge[1];
        const otherVertexEdges = vertices_edges[otherVertex];
        const otherVertexEdgeIndex = otherVertexEdges.indexOf(edgeIndex);
        otherVertexEdges.splice(otherVertexEdgeIndex, 0, newEdgeIndex);
      } else if (assignment === "B") {
        if (j === 0 && verticesEdges.length > 1) {
          // check if next edge is also boundary
          const nextEdgeIndex = verticesEdges[1];
          if (edges_assignment[nextEdgeIndex] === "B") {
            // check if this edge shares a face with the next
            const edge = edges_vertices[edgeIndex];
            let otherVertex = edge[0];
            if (otherVertex === i) {
              otherVertex = edge[1];
            }
            const nextEdge = edges_vertices[nextEdgeIndex];
            let nextVertex = nextEdge[0];
            if (nextVertex === i) {
              nextVertex = nextEdge[1];
            }
            if (
              connectedByFace(
                { faces_vertices },
                vertices_faces[i],
                otherVertex,
                nextVertex,
              )
            ) {
              // empty
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
    if (groups.length <= 1) {
      continue;
    }

    for (let k = groups[groupIndex].length - 1; k >= 0; k -= 1) {
      // put remainder of last group in first group
      groups[0].unshift(groups[groupIndex][k]);
    }

    groups.pop();

    for (let j = 1; j < groups.length; j += 1) {
      // for each extra group, assign new vertex. copy the vertex
      //const currentVertex: [number, number, number] = [...fold.vertices_coords[i]];
      const currentVertex: [number, number, number] = resize3(vertices_coords[i]);
      const vertIndex = vertices_coords.length;
      // @ts-ignore need to force FOLD to 3D vertices
      vertices_coords.push(currentVertex);
      const connectingIndices: number[] = [];

      for (let k = 0; k < groups[j].length; k += 1) {
        // update edges_vertices
        const edgeIndex = groups[j][k];
        const edge = edges_vertices[edgeIndex];
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
        for (let k = 1; k < connectingIndices.length; k += 1) {
          // update faces_vertices
          // i, k-1, k
          const thisConnectingVertIndex = connectingIndices[k];
          const previousConnectingVertIndex = connectingIndices[k - 1];
          let found = false;

          for (let a = 0; a < verticesFaces.length; a += 1) {
            const face = faces_vertices[verticesFaces[a]];
            const index1 = face.indexOf(thisConnectingVertIndex);
            const index2 = face.indexOf(previousConnectingVertIndex);
            const index3 = face.indexOf(i);
            if (
              index1 >= 0 &&
              index2 >= 0 &&
              index3 >= 0 &&
              (Math.abs(index1 - index3) === 1 ||
                Math.abs(index1 - index3) === face.length - 1) &&
              (Math.abs(index2 - index3) === 1 ||
                Math.abs(index2 - index3) === face.length - 1)
            ) {
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

  // these are all invalid now, do not return them:
  // vertices_vertices vertices_edges vertices_faces
  return {
    vertices_coords,
    edges_vertices,
    edges_assignment,
    edges_foldAngle,
    faces_vertices,
  };
};

export default splitCuts;
