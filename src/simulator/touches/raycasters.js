import * as THREE from "three";
import makeTouches from "./makeTouches.js";
/**
 * @description This raycaster object will manage all touch event
 * handlers which in turn calculate ray casting intersections with
 * the origami model.
 */
const Raycasters = ({ renderer, camera, simulator, setTouches }) => {
	// for the pull-vertex tool. "raycasterPullVertex" is the currently moving vertex
	let raycaster;
	let raycasterPlane;
	let raycasterPullVertex;
	// for the pull-vertex tool.
	// orient the raycaster plane towards the camera and move it to the selected FOLD vertex.
	const raycasterPressHandler = () => {
		const firstTouch = makeTouches(simulator.model, raycaster)[0];
		if (!firstTouch || firstTouch.vertex === undefined) {
			return;
		}
		raycasterPullVertex = firstTouch.vertex;
		const position = new THREE.Vector3(
			simulator.model.positions[firstTouch.vertex * 3 + 0],
			simulator.model.positions[firstTouch.vertex * 3 + 1],
			simulator.model.positions[firstTouch.vertex * 3 + 2],
		);
		const cameraOrientation = new THREE.Vector3();
		camera.getWorldDirection(cameraOrientation);
		const dist = position.dot(cameraOrientation);
		raycasterPlane.set(cameraOrientation, -dist);
	};

	const raycasterMoveHandler = (event) => {
		const bounds = renderer.domElement.getBoundingClientRect();
		const mouse = new THREE.Vector2(
			((event.clientX - bounds.x) / bounds.width) * 2 - 1,
			-((event.clientY - bounds.y) / bounds.height) * 2 + 1,
		);
		raycaster.setFromCamera(mouse, camera);
		const touches = makeTouches(simulator.model, raycaster);
		if (setTouches) {
			setTouches(touches);
		}
	};

	// for the pull-vertex tool. disable the pull motion when mouseup
	const raycasterReleaseHandler = () => {
		raycasterPullVertex = undefined;
	};
	/**
	 * @description todo
	 */
	const pullVertex = () => {
		const node = simulator.model.nodes[raycasterPullVertex];
		if (!node) {
			return;
		}
		const intersection = new THREE.Vector3();
		raycaster.ray.intersectPlane(raycasterPlane, intersection);
		node.moveManually(intersection);
		simulator.nodeDidMove();
	};

	// Touch detection is already happening in the moveHandler, but
	// in the special case where the model is being folded while
	// the cursor is hovering over the model and the cursor is not moving,
	// the touch data will not update, and there will be a visual disparity.
	// To fix this, during the animation loop, if the simulator is on,
	// calculate the touches under the cursor.
	const animate = (pullEnabled = false) => {
		if (!simulator.active) {
			return;
		}
		// console.log("pullEnabled, raycasterPullVertex", pullEnabled, raycasterPullVertex);
		const touches =
			pullEnabled && raycasterPullVertex !== undefined
				? []
				: makeTouches(simulator.model, raycaster);
		if (setTouches) {
			setTouches(touches);
		}
		// if the user is pulling on a node, manually move the node to the raycaster's
		// new intersection with the raycaster plane.
		if (pullEnabled && raycasterPullVertex !== undefined) {
			pullVertex();
		}
	};

	const dealloc = () => {
		renderer.domElement.removeEventListener(
			"mousedown",
			raycasterPressHandler,
			false,
		);
		renderer.domElement.removeEventListener(
			"mouseup",
			raycasterReleaseHandler,
			false,
		);
		renderer.domElement.removeEventListener(
			"mousemove",
			raycasterMoveHandler,
			false,
		);
	};

	// setup raycaster and plane (both will be dynamically updated)
	raycaster = new THREE.Raycaster();
	raycasterPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
	raycaster.setFromCamera({ x: Infinity, y: 0 }, camera);

	renderer.domElement.addEventListener(
		"mousedown",
		raycasterPressHandler,
		false,
	);
	renderer.domElement.addEventListener(
		"mouseup",
		raycasterReleaseHandler,
		false,
	);
	renderer.domElement.addEventListener(
		"mousemove",
		raycasterMoveHandler,
		false,
	);

	return {
		animate,
		dealloc,
		raycasterReleaseHandler,
	};
};

export default Raycasters;
