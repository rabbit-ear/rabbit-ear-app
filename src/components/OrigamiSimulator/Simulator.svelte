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
		active,
		foldAmount,
		strain,
		tool,
		error,
		reset,
		exportModel,
	} from "../../stores/simulator.js";
	import {
		integration,
		axialStiffness,
		faceStiffness,
		joinStiffness,
		creaseStiffness,
		dampingRatio,
	} from "../../stores/solver.js";
	import {
		showTouches,
		showShadows,
		showFront,
		showBack,
		showBoundary,
		showMountain,
		showValley,
		showFlat,
		showJoin,
		showUnassigned,
		backgroundColor,
		frontColor,
		backColor,
		lineOpacity,
		boundaryColor,
		mountainColor,
		valleyColor,
		flatColor,
		joinColor,
		unassignedColor,
	} from "../../stores/style.js";
	import { graph } from "../../stores/graph.js";

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
		light.shadow.mapSize.width = 512; // default
		light.shadow.mapSize.height = 512; // default
		return light;
	});
	/**
	 * @description Origami Simulator solver just executed. This is attached
	 * to the window.requestAnimationFrame and will fire at the end of every loop
	 */
	const onCompute = (props) => {
		error.set(props.error);
		// The raycaster will update on a mousemove event, but if the origami is
		// in a folding animation, the raycaster will not update and the visuals
		// will mismatch, hence, the raycaster can fire on a frame update if needed
		raycasters.animate($tool === "pull");
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
		exportModel.set(simulator.export);
	};

	// load a new origami model. thrown errors are because of a bad file format
	$: {
		try {
			simulator.load($graph);
			const box = boundingBox($graph);
			modelSize = box ? Math.max(...box.span) : 1;
		} catch (error) {
			window.alert(error);
		}
	}

	// on model change, update camera position
	$: if (camera) {
		// scale is due to the camera's FOV
		const scale = 1.25;
		// the distance the camera should be to nicely fit the object
		const fitLength = camera.aspect > 1
			? modelSize * scale
			: modelSize * scale * (1 / camera.aspect);
		const length = fitLength / camera.position.length();
		camera.position.multiplyScalar(length);
		camera.lookAt(0, 0, 0);
		camera.far = modelSize * 100;
		camera.near = modelSize / 100;
	}

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
	$: reset.set(simulator.reset);

	/**
	 * settings from the Simulator store
	 */
	$: simulator.setActive($active);
	$: simulator.setFoldAmount($foldAmount);
	$: simulator.setStrain($strain);
	$: simulator.setIntegration($integration);
	$: simulator.setAxialStiffness($axialStiffness);
	$: simulator.setFaceStiffness($faceStiffness);
	$: simulator.setJoinStiffness($joinStiffness);
	$: simulator.setCreaseStiffness($creaseStiffness);
	$: simulator.setDampingRatio($dampingRatio);
	// show/hide things
	$: simulator.setShadows($showShadows);
	$: [0, 3, 4, 7].forEach(i => {
		lights[i % lights.length].castShadow = $showShadows;
	});
	$: $showTouches
		? highlights.highlightTouch(touches[0])
		: highlights.clear();
	$: simulator.getModel().frontMesh.visible = $showFront;
	$: simulator.getModel().backMesh.visible = $showBack;
	$: simulator.getLines().B.visible = $showBoundary;
	$: simulator.getLines().M.visible = $showMountain;
	$: simulator.getLines().V.visible = $showValley;
	$: simulator.getLines().F.visible = $showFlat;
	$: simulator.getLines().J.visible = $showJoin;
	$: simulator.getLines().U.visible = $showUnassigned;
	// colors
	$: simulator.setFrontColor($frontColor);
	$: simulator.setBackColor($backColor);
	$: Object.values(simulator.getMaterials().line)
		.forEach(m => { m.opacity = $lineOpacity; });
	$: simulator.setBoundaryColor($boundaryColor);
	$: simulator.setMountainColor($mountainColor);
	$: simulator.setValleyColor($valleyColor);
	$: simulator.setFlatColor($flatColor);
	$: simulator.setJoinColor($joinColor);
	$: simulator.setUnassignedColor($unassignedColor);
	$: if (scene) { scene.background = new THREE.Color($backgroundColor); }

	// nitpicky. upon tool change we need raycasterPullVertex to be undefined
	$: if (raycasters) { raycasters.raycasterReleaseHandler($tool); }

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
	enabled={$tool !== "pull"}
	maxDistance={modelSize * 30}
	minDistance={modelSize * 0.1}
	panSpeed={1}
	rotateSpeed={4}
	zoomSpeed={16}
	dynamicDampingFactor={1}
	didMount={didMount}
/>
