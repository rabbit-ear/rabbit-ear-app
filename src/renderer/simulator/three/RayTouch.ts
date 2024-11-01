import * as THREE from "three";
import type { FOLDMesh } from "../types.ts";
import type { Model } from "../simulator/Model.ts";
import type { MeshThree } from "../three/MeshThree.ts";
import { distance as Distance } from "../general/math.ts";

export type RayTouch = {
  point: THREE.Vector3;
  vertex: number;
  face: number;
  triangle: number;
  triangles: number[];
  material: number;
  normal: THREE.Vector3;
  distance: number;
};

/**
 * @param {object} intersection a three.js ray caster intersection object,
 * containing: { distance, face, faceIndex, object, point }
 * https://threejs.org/docs/#api/en/core/Raycaster.intersectObject
 * @param {object} fold the FOLD file this model was loaded from
 */

const makeTouchObject = (
  { distance, face, faceIndex, object, point }: THREE.Intersection<THREE.Mesh>,
  fold: FOLDMesh,
): RayTouch => {
  const point3 = [point.x, point.y, point.z];
  const vertices3d = object.geometry.attributes.position.array;

  const material = face.materialIndex;
  const normal = face.normal;
  const originalFace = fold.faces_backmap ? fold.faces_backmap[faceIndex] : faceIndex;
  const triangle = faceIndex;
  const triangle_vertices = [face.a, face.b, face.c];

  const nearestFaceVertex = triangle_vertices
    .map((f) => [0, 1, 2].map((n) => vertices3d[f * 3 + n]))
    .map((v) => Distance(v, point3))
    .map((d, i) => ({ d, i }))
    .sort((a, b) => a.d - b.d)
    .map((el) => el.i)
    .shift();

  const vertex = triangle_vertices[nearestFaceVertex];
  const triangles = fold.faces_nextmap ? fold.faces_nextmap[originalFace] : faceIndex;

  return {
    point,
    vertex,
    face: originalFace,
    triangle,
    triangles,
    material,
    normal,
    distance,
  };
};

/**
 * @description Given a 3D model and a raycaster, gather helpful information
 * such as which face was intersected, what is the nearest vertex, etc..
 * @returns {object[]} array of touch objects, or empty array if none.
 */
export const makeTouches = (
  model: Model,
  mesh: MeshThree,
  raycaster: THREE.Raycaster,
): RayTouch[] => !model
    ? []
    : raycaster
      // for every intersection point, fill it with additional
      // relevant information specific to the mesh graph.
      .intersectObjects([mesh.frontMesh, mesh.backMesh])
      .map((touch: THREE.Intersection<THREE.Mesh>) => makeTouchObject(touch, model.fold));
