import * as THREE from "three";
import * as Materials from "./materials.ts";
import { Model } from "../simulator/Model.ts";
import type { RayTouch } from "./RayTouch.ts";

// todo: idea- duplicate highlighted vertex, one obeys depthTest with full
// opacity, the other is always visible with half opacity.

/**
 * @description This manager goes hand in hand with the Raycasters()
 * manager. The touch object generated from a raycast intersection will
 * be the input for this Highlights manager.
 */
export class Highlights {
  parent: THREE.Object3D;
  model: Model;
  point: THREE.Points;
  vertex: THREE.Points;
  face: THREE.Mesh;

  constructor({ parent, model }: { parent?: THREE.Object3D; model?: Model }) {
    this.parent = parent;
    this.model = model;

    // setup highlighted point. does not adhere to depthTest
    const raycasterPointPositionAttr = new THREE.BufferAttribute(
      new Float32Array([0, 0, 0]),
      3,
    );
    raycasterPointPositionAttr.setUsage(THREE.DynamicDrawUsage);
    const raycasterPointBuffer = new THREE.BufferGeometry();
    raycasterPointBuffer.setAttribute("position", raycasterPointPositionAttr);
    this.point = new THREE.Points(raycasterPointBuffer, Materials.point);
    this.point.renderOrder = 1000;

    // setup highlighted vertex. does not adhere to depthTest
    const raycasterVertexPositionAttr = new THREE.BufferAttribute(
      new Float32Array([0, 0, 0]),
      3,
    );
    raycasterVertexPositionAttr.setUsage(THREE.DynamicDrawUsage);
    const raycasterVertexBuffer = new THREE.BufferGeometry();
    raycasterVertexBuffer.setAttribute("position", raycasterVertexPositionAttr);
    this.vertex = new THREE.Points(raycasterVertexBuffer, Materials.vertex);
    this.vertex.renderOrder = 1001;

    // setup highlighted face. two triangle faces, three vertices with x, y, z
    const raycasterFacePositionBuffer = new Float32Array(Array(2 * 3 * 3).fill(0.0));
    const raycasterFacePositionAttr = new THREE.BufferAttribute(
      raycasterFacePositionBuffer,
      3,
    );
    raycasterFacePositionAttr.setUsage(THREE.DynamicDrawUsage);
    const raycasterFaceBuffer = new THREE.BufferGeometry();
    raycasterFaceBuffer.setAttribute("position", raycasterFacePositionAttr);
    this.face = new THREE.Mesh(raycasterFaceBuffer, [
      Materials.frontFace,
      Materials.backFace,
    ]);

    if (parent) {
      this.setParent(parent);
    }
  }

  /**
   *
   */
  highlightPoint(touch: RayTouch) {
    this.point.visible = touch.point != null;
    if (!this.point.visible) {
      return;
    }
    this.point.geometry.attributes.position.array[0] = touch.point.x;
    this.point.geometry.attributes.position.array[1] = touch.point.y;
    this.point.geometry.attributes.position.array[2] = touch.point.z;
    this.point.geometry.attributes.position.needsUpdate = true;
  }

  /**
   *
   */
  highlightVertex(touch: RayTouch) {
    if (!this.model) { return; }
    this.vertex.visible = touch.vertex != null;
    if (!this.vertex.visible) {
      return;
    }
    const vertex_coords = [0, 1, 2].map(
      (i) => this.model.positions[touch.vertex * 3 + i],
    );
    this.vertex.geometry.attributes.position.array[0] = vertex_coords[0];
    this.vertex.geometry.attributes.position.array[1] = vertex_coords[1];
    this.vertex.geometry.attributes.position.array[2] = vertex_coords[2];
    this.vertex.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * @description Given a list of triangle indices, make a flat array
   * of vertices ready to be used in a BufferGeometry.
   * @param {number[]} triangles a list of triangle face indices
   */
  makeTrianglesVertexArray(triangles: number[]) {
    if (!this.model) { return; }
    const faces = triangles
      .map((f) => this.model.fold.faces_vertices[f])
      .map((tri) =>
        tri.map((v) => [0, 1, 2].map((i) => this.model.positions[v * 3 + i])),
      )
      //.map((tri) => tri.map((p) => ({ x: p[0], y: p[1], z: p[2] })));
      .map((tri) => tri.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
    // make a copy of the faces, reverse the winding. these are for the back
    return faces.concat(faces.map((f) => f.slice().reverse())).flat();
  }

  /**
   *
   */
  highlightFace(touch: RayTouch) {
    this.face.visible = touch.face != null;
    if (!this.face.visible) {
      return;
    }
    const points = this.makeTrianglesVertexArray(touch.triangles);
    // rebuild the triangle vertices buffer size
    const arraySize = 2 * touch.triangles.length * 3 * 3;
    const positionBuffer = new Float32Array(Array(arraySize).fill(0.0));
    const positionAttribute = new THREE.BufferAttribute(positionBuffer, 3);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    this.face.geometry.setAttribute("position", positionAttribute);
    // this will tell which face gets what material
    this.face.geometry.clearGroups();
    this.face.geometry.addGroup(0, touch.triangles.length * 3, 0);
    this.face.geometry.addGroup(
      touch.triangles.length * 3,
      touch.triangles.length * 3,
      1,
    );
    this.face.geometry.setFromPoints(points);
    this.face.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * @description Call this method and it will hide all geometry
   */
  clear() {
    this.point.visible = false;
    this.vertex.visible = false;
    this.face.visible = false;
  }

  /**
   *
   */
  dealloc() {
    if (this.point.geometry) {
      this.point.geometry.dispose();
    }
    if (this.vertex.geometry) {
      this.vertex.geometry.dispose();
    }
    if (this.face.geometry) {
      this.face.geometry.dispose();
    }
    this.model = undefined;
    this.point = undefined;
    this.vertex = undefined;
    this.face = undefined;
  }

  /**
   * @description The main interface for this class. Call this method
   * with a touch object, the result of the Raycasters() event handlers.
   * @param {object} touch a touch object the result of the Raycasters()
   * event handlers, what gets build inside makeTouches.js
   */
  highlightTouch(touch: RayTouch) {
    this.clear();
    if (touch === undefined) {
      return;
    }
    this.highlightPoint(touch);
    this.highlightVertex(touch);
    this.highlightFace(touch);
  }

  /**
   *
   */
  setParent(parent: THREE.Object3D) {
    // remove from previous parent
    this.point.removeFromParent();
    this.vertex.removeFromParent();
    this.face.removeFromParent();
    // add to new parent
    if (parent) {
      parent.add(this.point);
      parent.add(this.vertex);
      parent.add(this.face);
    }
  }
}
