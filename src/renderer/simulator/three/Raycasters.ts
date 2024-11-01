import * as THREE from "three";
import { type RayTouch, makeTouches } from "./RayTouch.ts";
import { Model } from "../simulator/Model.ts";
import { MeshThree } from "../three/MeshThree.ts";

/**
 * @description This raycaster object will manage all touch event
 * handlers which in turn calculate ray casting intersections with
 * the origami model.
 */
export class Raycasters {
  // for the pull-vertex tool. "raycasterPullVertex" is the currently moving vertex
  raycaster: THREE.Raycaster;
  raycasterPlane: THREE.Plane;
  raycasterPullVertex: number;

  renderer: THREE.Renderer;
  camera: THREE.Camera;
  #model: Model;
  #mesh: MeshThree;
  setTouches: (touches: RayTouch[]) => void;

  constructor({
    renderer,
    camera,
    setTouches,
  }: {
    renderer: THREE.Renderer;
    camera: THREE.Camera;
    setTouches: (touches: RayTouch[]) => void;
  }) {
    this.renderer = renderer;
    this.camera = camera;
    this.setTouches = setTouches;

    // setup raycaster and plane (both will be dynamically updated)
    this.raycaster = new THREE.Raycaster();
    this.raycasterPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
    this.raycaster.setFromCamera(new THREE.Vector2(Infinity, 0), camera);

    this.renderer.domElement.addEventListener(
      "mousedown",
      this.raycasterPressHandler.bind(this),
      false,
    );
    this.renderer.domElement.addEventListener(
      "mouseup",
      this.raycasterReleaseHandler.bind(this),
      false,
    );
    this.renderer.domElement.addEventListener(
      "mousemove",
      this.raycasterMoveHandler.bind(this),
      false,
    );
  }

  set model(model: Model) {
    this.#model = model;
  }

  set mesh(mesh: MeshThree) {
    this.#mesh = mesh;
  }

  // for the pull-vertex tool.
  // orient the raycaster plane towards the camera
  // and move it to the selected FOLD vertex.
  raycasterPressHandler() {
    if (!this.#model || !this.#mesh) {
      return;
    }
    const firstTouch = makeTouches(this.#model, this.#mesh, this.raycaster)[0];
    if (!firstTouch || firstTouch.vertex === undefined) {
      return;
    }
    this.raycasterPullVertex = firstTouch.vertex;
    const position = new THREE.Vector3(
      this.#model.positions[firstTouch.vertex * 3 + 0],
      this.#model.positions[firstTouch.vertex * 3 + 1],
      this.#model.positions[firstTouch.vertex * 3 + 2],
    );
    const cameraOrientation = new THREE.Vector3();
    this.camera.getWorldDirection(cameraOrientation);
    const dist = position.dot(cameraOrientation);
    this.raycasterPlane.set(cameraOrientation, -dist);
  }

  raycasterMoveHandler(event: MouseEvent) {
    if (!this.#model || !this.#mesh) {
      return;
    }
    const bounds = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - bounds.x) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.y) / bounds.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(mouse, this.camera);
    const touches = makeTouches(this.#model, this.#mesh, this.raycaster);
    this?.setTouches(touches);
  }

  // for the pull-vertex tool. disable the pull motion when mouseup
  raycasterReleaseHandler() {
    console.log("Raycasters.ts raycasterReleaseHandler()");
    this.raycasterPullVertex = undefined;
  }

  /**
   * @description todo
   */
  pullVertex() {
    if (!this.#model || !this.#mesh) {
      return;
    }
    //console.log("pull vertex", this.raycasterPullVertex);
    const node = this.#model.nodes[this.raycasterPullVertex];
    if (!node) {
      return;
    }
    const intersection = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.raycasterPlane, intersection);
    this.#model.positions[node.index * 3 + 0] = intersection.x;
    this.#model.positions[node.index * 3 + 1] = intersection.y;
    this.#model.positions[node.index * 3 + 2] = intersection.z;
    this.#model.nodeDidMove();
    this.#mesh.sync();
  }

  // Touch detection is already happening in the moveHandler, but
  // in the special case where the model is being folded while
  // the cursor is hovering over the model and the cursor is not moving,
  // the touch data will not update, and there will be a visual disparity.
  // To fix this, during the animation loop, if the simulator is on,
  // calculate the touches under the cursor.
  animate({ active = false, pull = false }) {
    if (!this.#model || !this.#mesh || !active) {
      return;
    }
    const touches =
      pull && this.raycasterPullVertex !== undefined
        ? []
        : makeTouches(this.#model, this.#mesh, this.raycaster);
    this?.setTouches(touches);
    // if the user is pulling on a node, manually move the node to the raycaster's
    // new intersection with the raycaster plane.
    if (pull && this.raycasterPullVertex !== undefined) {
      this.pullVertex();
    }
  }

  dealloc() {
    this.renderer.domElement.removeEventListener(
      "mousedown",
      this.raycasterPressHandler,
      false,
    );
    this.renderer.domElement.removeEventListener(
      "mouseup",
      this.raycasterReleaseHandler,
      false,
    );
    this.renderer.domElement.removeEventListener(
      "mousemove",
      this.raycasterMoveHandler,
      false,
    );
    this.raycaster = undefined;
    this.raycasterPlane = undefined;
    this.raycasterPullVertex = undefined;
    this.renderer = undefined;
    this.camera = undefined;
    this.#model = undefined;
    this.#mesh = undefined;
    this.setTouches = undefined;
  }
}
