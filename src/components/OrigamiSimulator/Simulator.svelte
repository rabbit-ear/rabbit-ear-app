<!-- 
	Origami Simulator for Svelte (c) Kraft
	MIT license
 -->

<!-- 
	@component
	Svelte component and interface for Origami Simulator by Amanda Ghassaei.
	@props
	These props are hard coded into the app and are currently required:
	- props.origami (the origami model in FOLD format)
	- props.active (the active state of the folding engine, on or off)
	- props.foldAmount (the amount the model is folded, 0.0 - 1.0)
	- props.strain (override the material to show strain forces)
	- props.tool (the UI tool, currently there are two: "trackball", "pull")
	- props.showTouches (highlight the vertex/face underneath the cursor)
	- props.showShadows (turn on three.js shadows)
	new ones
	- props.reset (reset the vertices of the origami model)
 -->
<script>
	import { onDestroy } from "svelte";
	import * as THREE from "three";
	import TrackballView from "./TrackballView.svelte";
	import OrigamiSimulator from "../../simulator/index";
	import Highlights from "../../simulator/touches/highlights";
	import Raycasters from "../../simulator/touches/raycasters";
	import boundingBox from "../../simulator/fold/boundingBox";
	import {
		Active,
		FoldAmount,
		Strain,
		SimulatorTool,
		VertexError,
		Reset,
		ExportModel,
		ResetView,
	} from "../../stores/simulator.js";
	import {
		Integration,
		AxialStiffness,
		FaceStiffness,
		JoinStiffness,
		CreaseStiffness,
		DampingRatio,
	} from "../../stores/solver.js";
	import {
		ShowTouches,
		ShowShadows,
		ShowFront,
		ShowBack,
		ShowBoundary,
		ShowMountain,
		ShowValley,
		ShowFlat,
		ShowJoin,
		ShowUnassigned,
		BackgroundColor,
		SimulatorFrontColor,
		SimulatorBackColor,
		LineOpacity,
		BoundaryColor,
		MountainColor,
		ValleyColor,
		FlatColor,
		JoinColor,
		UnassignedColor,
	} from "../../stores/style.js";
	import { CreasePattern } from "../../stores/ModelCP.js";

	const lightVertices = [
		[+1, +1, +1],
		[-1, +1, +1],
		[+1, -1, +1],
		[-1, -1, +1],
		[+1, +1, -1],
		[-1, +1, -1],
		[+1, -1, -1],
		[-1, -1, -1],
	];
	const lightRadius = 10;
	// model size will update the position of the lights, camera, and
	// trackball controlls, allowing for models to be of vastly different scales
	let modelSize = 1;
	// "touches" arises from the cursor position, it is an array containing
	// a point object for every raycasted intersection with the mesh.
	let touches = [];
	// origami simulator
	let simulator = OrigamiSimulator();
	// all raycaster methods for the user interface
	let raycasters;
	// highlighted geometry indicating the selected vertex/face
	let highlights = Highlights({ simulator });
	// trackballView exposes its ".reset()" function, bound to this variable
	let trackballViewReset = () => {};
	// three.js
	let scene;
	let camera;
	// three.js lights for this scene
	let lights = lightVertices.map(pos => {
		const light = new THREE.PointLight();
		light.position.set(...pos);
		light.position.setLength(lightRadius);
		light.distance = lightRadius * Math.E;
		light.castShadow = false;
		light.shadow.mapSize.width = 2048; // default
		light.shadow.mapSize.height = 2048; // default
		return light;
	});
	/**
	 * @description Origami Simulator solver just executed. This is attached
	 * to the window.requestAnimationFrame and will fire at the end of every loop
	 */
	const onCompute = (props) => {
		VertexError.set(props.error);
		// The raycaster will update on a mousemove event, but if the origami is
		// in a folding animation, the raycaster will not update and the visuals
		// will mismatch, hence, the raycaster can fire on a frame update if needed
		raycasters.animate($SimulatorTool === "pull");
	};
	/**
	 * @description This is the callback from ThreeView after three.js has
	 * finished initializing. This is not the JS framework's builtin function.
	 */
	const didMount = ({ renderer, scene: _scene, camera: _camera }) => {
		scene = _scene;
		camera = _camera;
		// initialize origami simulator
		simulator.setScene(scene);
		simulator.setOnCompute(onCompute);
		highlights.setScene(scene);
		raycasters = Raycasters({
			renderer,
			camera,
			simulator,
			setTouches: t => { touches = t; },
		});
		lights.forEach(light => scene.add(light));
		ExportModel.set(simulator.export);
	};

	// load a new origami model. thrown errors are because of a bad file format
	$: {
		try {
			simulator.load($CreasePattern);
			const box = boundingBox($CreasePattern);
			modelSize = box ? Math.max(...box.span) : 1;
		} catch (error) {
			// window.alert(error);
		}
	}

	const resetCamera = (camera, modelSize) => {
		if (!camera) { return; }
		const scale = 1.33;
		// the distance the camera should be to nicely fit the object
		const fitLength = camera.aspect > 1
			? modelSize * scale
			: modelSize * scale * (1 / camera.aspect);
		const length = fitLength / camera.position.length();
		camera.position.multiplyScalar(length);
		camera.lookAt(0, 0, 0);
		camera.far = modelSize * 100;
		camera.near = modelSize / 100;
	};

	// this Reset function is bound to a store held on by the app.
	// this allows the user to be able to call this any time to reset the view.
	$ResetView = () => {
		// this will reset the trackball rotation and zoom level, however,
		// the zoom level will be a fixed distance from the origin. we need to
		// call resetCamera to adjust the zoom to be the appropriate distance
		// away from the model, depending on the model's dimensions.
		trackballViewReset();
		resetCamera(camera, modelSize);
	};

	// on model change, update camera position
	$: resetCamera(camera, modelSize);

	// on model change, update the position of the lights
	$: {
		const radius = modelSize * Math.SQRT1_2;
		// todo, might need these inside the initialize method
		lightVertices.forEach((pos, i) => {
			lights[i].position.set(...pos);
			lights[i].position.setLength(radius * lightRadius);
			lights[i].distance = radius * lightRadius * Math.E;
			lights[i].shadow.camera.near = radius / 10; // 0.5 default
			lights[i].shadow.camera.far = radius * 10; // 500 default
		});
	}

	$: Reset.set(simulator.reset);

	/**
	 * settings from the Simulator store
	 */
	$: simulator.setActive($Active);
	$: simulator.setFoldAmount($FoldAmount);
	$: simulator.setStrain($Strain);
	$: simulator.setIntegration($Integration);
	$: simulator.setAxialStiffness($AxialStiffness);
	$: simulator.setFaceStiffness($FaceStiffness);
	$: simulator.setJoinStiffness($JoinStiffness);
	$: simulator.setCreaseStiffness($CreaseStiffness);
	$: simulator.setDampingRatio($DampingRatio);
	// show/hide things
	$: simulator.setShadows($ShowShadows);
	$: [0, 3, 4, 7].forEach(i => {
		lights[i % lights.length].castShadow = $ShowShadows;
	});
	$: $ShowTouches
		? highlights.highlightTouch(touches[0])
		: highlights.clear();
	$: simulator.getModel().frontMesh.visible = $ShowFront;
	$: simulator.getModel().backMesh.visible = $ShowBack;
	$: simulator.getLines().B.visible = $ShowBoundary;
	$: simulator.getLines().M.visible = $ShowMountain;
	$: simulator.getLines().V.visible = $ShowValley;
	$: simulator.getLines().F.visible = $ShowFlat;
	$: simulator.getLines().J.visible = $ShowJoin;
	$: simulator.getLines().U.visible = $ShowUnassigned;
	// colors
	$: simulator.setFrontColor($SimulatorFrontColor);
	$: simulator.setBackColor($SimulatorBackColor);
	$: Object.values(simulator.getMaterials().line)
		.forEach(m => { m.opacity = $LineOpacity; });
	$: simulator.setBoundaryColor($BoundaryColor);
	$: simulator.setMountainColor($MountainColor);
	$: simulator.setValleyColor($ValleyColor);
	$: simulator.setFlatColor($FlatColor);
	$: simulator.setJoinColor($JoinColor);
	$: simulator.setUnassignedColor($UnassignedColor);
	$: if (scene) { scene.background = new THREE.Color($BackgroundColor); }

	// nitpicky. upon tool change we need raycasterPullVertex to be undefined
	$: if (raycasters) { raycasters.raycasterReleaseHandler($SimulatorTool); }

	/**
	 * @description cleanup all memory associated with origami simulator
	 */
	onDestroy(() => {
		if (raycasters) { raycasters.dealloc(); }
		if (simulator) { simulator.dealloc(); }
		if (highlights) { highlights.dealloc(); }
	});
</script>

<TrackballView
	enabled={$SimulatorTool !== "pull"}
	maxDistance={modelSize * 30}
	minDistance={modelSize * 0.1}
	panSpeed={1}
	rotateSpeed={4}
	zoomSpeed={16}
	dynamicDampingFactor={1}
	didMount={didMount}
	bind:resetView={trackballViewReset}
/>
