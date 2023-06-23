<!-- 
	ThreeView for Svelte (c) Kraft
	MIT license
 -->

<!-- 
	@component
	This will create a three.js canvas, start an animation loop,
	and watch for changes to the screen so that the three.js scene can
	refresh its aspect ratio and projection matrix. The camera's view matrix
	is not automatically refreshed- if you would like to do so, listen to the
	didResize method and didMount where you are given a pointer to camera.
	
	@props
	this component does not require any props. However,
	it does offer these optional prop bindings, all are event handlers.
	- didMount({ renderer, scene, camera }), will be called just after three.js
	  has finished initialization, but before the animation loop has started.
	- didResize(event), will be called following a window "resize" event.
	- animate(), will be called inside the animation loop, right before the
	  renderer draws to the screen.
 -->

<script>
	import { onMount, onDestroy } from "svelte";
	import * as THREE from "three";
	export let didMount = () => {};
	export let didResize = () => {};
	export let animate = () => {};
	// these will be initialized and managed by this component
	let renderer;
	let scene;
	let camera;
	// the parent of the <canvas> element
	let parentNode;
	// the value returned from window.requestAnimationFrame
	let animationID;
	/**
	 * @description Update the projection matrix, aspect ratio, and size
	 * of the renderer.
	 */
	const updateProjection = () => {
		const width = parentNode.clientWidth;
		const height = parentNode.clientHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};
	/**
	 * @description Update the camera's view matrix. The camera will look
	 * at the origin (0, 0, 0), and position itself along the +Z axis
	 * so that the model will be aspect fit and should be nicely visible.
	 * @param {number} modelSize the diameter across the largest size
	 * of the model; used to aspect fit the model in view.
	 */
	const updateView = (modelSize = 1.0) => {
		const scale = 1.25;
		const fitLength = camera.aspect > 1
			? modelSize * scale
			: modelSize * scale * (1 / camera.aspect);
		camera.position.set(0, 0, fitLength);
		camera.up = new THREE.Vector3(0, 1, 0);
		camera.lookAt(0, 0, 0);
		camera.far = modelSize * 100;
		camera.near = modelSize / 100;
	};
	/**
	 * @description Setup one three.js canvas with a renderer, scene, and camera
	 */
	const initializeThreeJS = () => {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, 1 / 1, 0.1, 1000);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		// THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap, THREE.VSMShadowMap
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		updateProjection();
		updateView();
		parentNode.appendChild(renderer.domElement);
	};
	/**
	 * @description Begin the animation loop, maintain a reference to the
	 * return value of requestAnimationFrame so that the animation loop
	 * can be canceled at any time (like in the deallocate method).
	 */
	const initializeAnimationLoop = () => {
		const animateLoop = () => {
			animationID = window.requestAnimationFrame(animateLoop);
			// bubble up animation event just before the scene is rendered
			if (animate) {
				animate();
			}
			renderer.render(scene, camera);
		};
		animateLoop();
	};
	/**
	 * @description The method attached to the window's "resize" event.
	 */
	const onResize = (event) => {
		parentNode.removeChild(renderer.domElement);
		updateProjection();
		parentNode.appendChild(renderer.domElement);
		// bubble up window's "resize" event
		if (didResize) {
			didResize(event);
		}
	};
	/**
	 * @description onMount (built-in function) will setup three.js, then
	 * bubble up the didMount event, and lastly, start the animation loop,
	 * ensuring that animation begins after all setup is (presumably) done.
	 */
	onMount(() => {
		initializeThreeJS();
		window.addEventListener("resize", onResize);
		// bubble up the didMount event before starting the animation loop
		if (didMount) {
			didMount({ renderer, scene, camera });
		}
		initializeAnimationLoop();
	});
	/**
	 * @description Free all memory associated with this three.js instance.
	 * This allows you to destroy and re-instance this component many times
	 * throughout the lifecycle of the app.
	 */
	onDestroy(() => {
		window.removeEventListener("resize", onResize);
		window.cancelAnimationFrame(animationID);
		scene.clear();
		renderer.renderLists.dispose();
		renderer.dispose();
		camera = null;
		parentNode.removeChild(renderer.domElement);
	});
</script>

<div class="container" bind:this={parentNode} />

<style>
	.container {
		width: 100%;
		height: 100%;
	}
</style>
