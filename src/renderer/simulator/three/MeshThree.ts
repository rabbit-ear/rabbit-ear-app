import * as THREE from "three";
import * as Materials from "./materials.ts";
import type { Model } from "../simulator/Model.ts";

// no "cut" assignment. all cuts have now been turned into boundaries
const allAssignments: string[] = Array.from("BMVFJU");

export class MeshThree {
  // mesh
  geometry: THREE.BufferGeometry;
  frontMesh: THREE.Mesh; // front face of mesh
  backMesh: THREE.Mesh; // back face of mesh (different color)
  lines: { [key: string]: THREE.LineSegments };

  // materials
  // it seems that ThreeJS is capable of having an array of Material
  // types set to the .material property, this is not supported here.
  // if you manually set .material, please set it to a THREE.Material type.
  materials: { [key: string]: THREE.Material };
  lineMaterials: { [key: string]: THREE.Material };

  #strain: boolean;

  constructor(model: Model) {
    // materials
    this.materials = {};
    this.lineMaterials = {};
    this.materials.front = Materials.front;
    this.materials.back = Materials.back;
    this.materials.strain = Materials.strain;
    allAssignments.forEach((key) => {
      this.lineMaterials[key] = Materials.line.clone();
    });

    this.frontMesh = new THREE.Mesh(); // front face of mesh
    this.backMesh = new THREE.Mesh(); // back face of mesh (different color)
    this.geometry = new THREE.BufferGeometry();
    this.frontMesh.geometry = this.geometry;
    this.backMesh.geometry = this.geometry;
    this.lines = {};
    allAssignments.forEach((key) => {
      this.lines[key] = new THREE.LineSegments(
        new THREE.BufferGeometry(),
        this.lineMaterials[key],
      );
    });

    this.frontMesh.castShadow = true;
    this.frontMesh.receiveShadow = true;
    // this.backMesh.castShadow = true;
    this.backMesh.receiveShadow = true;
    // by default, "join" edges (result of triangulation) are not visible
    this.lines.J.visible = false;

    this.#faceMaterialDidUpdate();
    this.#lineMaterialDidUpdate();
    this.#setGeometryBuffers(model);
  }

  sync(): void {
    this.needsUpdate();
  }

  needsUpdate(): void {
    this.geometry.attributes.position.needsUpdate = true;
    if (this.#strain) {
      this.geometry.attributes.color.needsUpdate = true;
    }
    // this is needed for the raycaster, otherwise not needed.
    this.geometry.computeBoundingBox();
  }

  dealloc(): void {
    this.#removeFromParent();
    // dispose geometries
    this.geometry?.dispose();
    this.frontMesh?.geometry?.dispose();
    this.backMesh?.geometry?.dispose();
    Object.values(this.lines).forEach((line) => line?.geometry?.dispose());
    this.frontMesh.geometry = null;
    this.backMesh.geometry = null;
    this.geometry = null;

    // dispose materials
    (this.frontMesh?.material as THREE.Material)?.dispose();
    (this.backMesh?.material as THREE.Material)?.dispose();
    Object.values(this.lines)
      .filter(line => (line?.material as THREE.Material)?.dispose)
      .forEach((line) => (line?.material as THREE.Material)?.dispose());
  }

  set strain(strain: boolean) {
    this.#strain = strain;
    this.#faceMaterialDidUpdate();
  }

  set scene(scene: THREE.Scene) {
    // remove from previous scene
    this.#removeFromParent();
    // add to new scene
    scene.add(this.frontMesh);
    scene.add(this.backMesh);
    Object.values(this.lines).forEach((line) => scene.add(line));
  }

  set frontColor(color: number | string) {
    if ((this.materials.front as THREE.MeshBasicMaterial).color != null) {
      (this.materials.front as THREE.MeshBasicMaterial).color.set(color);
      (this.frontMesh.material as THREE.Material).needsUpdate = true;
    }
  }

  set backColor(color: number | string) {
    if ((this.materials.back as THREE.MeshBasicMaterial).color != null) {
      (this.materials.back as THREE.MeshBasicMaterial).color.set(color);
      (this.backMesh.material as THREE.Material).needsUpdate = true;
    }
  }

  set boundaryColor(color: number | string) {
    const material = this.lineMaterials.B as THREE.LineBasicMaterial;
    material?.color.set(color);
    (this.lines.B.material as THREE.Material).needsUpdate = true;
  }

  set mountainColor(color: number | string) {
    const material = this.lineMaterials.M as THREE.LineBasicMaterial;
    material?.color.set(color);
    (this.lines.M.material as THREE.Material).needsUpdate = true;
  }

  set valleyColor(color: number | string) {
    const material = this.lineMaterials.V as THREE.LineBasicMaterial;
    material?.color.set(color);
    (this.lines.V.material as THREE.Material).needsUpdate = true;
  }

  set flatColor(color: number | string) {
    const material = this.lineMaterials.F as THREE.LineBasicMaterial;
    material?.color.set(color);
    (this.lines.F.material as THREE.Material).needsUpdate = true;
  }

  set unassignedColor(color: number | string) {
    const material = this.lineMaterials.U as THREE.LineBasicMaterial;
    material?.color.set(color);
    (this.lines.U.material as THREE.Material).needsUpdate = true;
  }

  set joinColor(color: number | string) {
    const material = this.lineMaterials.J as THREE.LineBasicMaterial;
    material?.color.set(color);
    (this.lines.J.material as THREE.Material).needsUpdate = true;
  }

  // set all line types to the same color
  set lineColor(color: number | string) {
    allAssignments.forEach((key) => {
      const material = this.lineMaterials[key] as THREE.LineBasicMaterial;
      material.color.set(color);
    });
    this.#lineMaterialDidUpdate();
  }

  set frontMaterial(material: THREE.Material) {
    this.#setNewFaceMaterial(material, "front");
  }

  set backMaterial(material: THREE.Material) {
    this.#setNewFaceMaterial(material, "back");
  }

  set strainMaterial(material: THREE.Material) {
    this.#setNewFaceMaterial(material, "strain");
  }

  /**
   * @description This is a convenient setter method to be able to
   * @param {THREE.Material} material a three js material
   * @param {string[]} [assignments] list of assignment keys like ["M", "B"]
   * the material will be applied to these assignments only. If left empty,
   * the material will be applied to all line types.
   */
  setLineMaterial(material: THREE.Material, assignments?: string[]) {
    const keys = assignments && assignments.length
      ? assignments
        .filter((a) => typeof a === "string")
        .map((str: string) => str.toUpperCase())
      : allAssignments;
    keys.forEach((key) => this.lineMaterials[key].dispose());
    keys.forEach((key) => {
      this.lineMaterials[key] = material;
    });
    this.#lineMaterialDidUpdate();
  }

  #setGeometryBuffers({
    positions,
    colors,
    indices,
    lineIndices,
  }: {
    positions: Float32Array;
    colors: Float32Array;
    indices: Uint16Array;
    lineIndices: { [key: string]: Uint16Array };
  }): void {
    const positionsAttribute = new THREE.BufferAttribute(positions, 3);
    this.geometry.setAttribute("position", positionsAttribute);
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    allAssignments.forEach((key) => {
      this.lines[key].geometry.setAttribute("position", positionsAttribute);
      this.lines[key].geometry.setIndex(new THREE.BufferAttribute(lineIndices[key], 1));
      // this.lines[key].geometry.attributes.position.needsUpdate = true;
      // this.lines[key].geometry.index.needsUpdate = true;
      this.lines[key].geometry.computeBoundingBox();
      this.lines[key].geometry.computeBoundingSphere();
      this.lines[key].geometry.center();
    });
    //this.geometry.attributes.position.needsUpdate = true;
    //this.geometry.index.needsUpdate = true;
    //this.geometry.verticesNeedUpdate = true;
    // re-scale object to unit-space and center it at the origin.
    this.geometry.computeVertexNormals();
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();
    this.geometry.center();
  }

  #removeFromParent(): void {
    [this.frontMesh, this.backMesh]
      .filter((el) => el.removeFromParent)
      .forEach((side) => side.removeFromParent());
    Object.values(this.lines)
      .filter((el) => el.removeFromParent)
      .forEach((line) => line.removeFromParent());
  }

  #setNewFaceMaterial(material: THREE.Material, key: string) {
    if (this.materials[key]) {
      this.materials[key].dispose();
    }
    this.materials[key] = material;
    this.#faceMaterialDidUpdate();
  }

  #faceMaterialDidUpdate(): void {
    this.frontMesh.material = this.#strain ? this.materials.strain : this.materials.front;
    this.backMesh.material = this.materials.back;
    // hide the back mesh if strain is currently enabled
    this.backMesh.visible = !this.#strain;
    // this.frontMesh.material.depthWrite = false;
    // this.backMesh.material.depthWrite = false;
    this.frontMesh.material.needsUpdate = true;
    this.backMesh.material.needsUpdate = true;
  }

  #lineMaterialDidUpdate(): void {
    allAssignments.forEach((key) => {
      this.lines[key].material = this.lineMaterials[key] || Materials.line.clone();
      this.lines[key].material.needsUpdate = true;
    });
  }
}
