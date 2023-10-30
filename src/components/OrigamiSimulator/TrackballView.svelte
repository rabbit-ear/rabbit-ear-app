<!--
	TrackballView for Svelte (c) Kraft
	MIT license
-->

<!-- 
	@component
	Extends the ThreeView component to include a three.js
	TrackballControls; otherwise, the functionality is the same as ThreeView.
	
	@props
	see ThreeView for its props, additionally, this
	component offers these optional props (none are required), all relate
	to the setup of the trackball controlls:
	- enabled (boolean)
	- maxDistance (number)
	- minDistance (number)
	- panSpeed (number)
	- rotateSpeed (number)
	- zoomSpeed (number)
	- dynamicDampingFactor (number)
-->
<script>
	import { onDestroy } from "svelte";
	import { TrackballControls } from "three/addons/controls/TrackballControls.js";
	import ThreeView from "./ThreeView.svelte";
	// ThreeView component
	export let didMount = () => {};
	export let didResize = () => {};
	export let animate = () => {};
	// this component
	export let enabled = true;
	export let maxDistance = 100;
	export let minDistance = 0.1;
	export let panSpeed = 1;
	export let rotateSpeed = 4;
	export let zoomSpeed = 16;
	export let dynamicDampingFactor;

	// export this method to the outside
	export let resetView = () => {};
	let trackball;

	$: if (trackball) { resetView = trackball.reset; }
	$: if (trackball) { trackball.enabled = enabled; }
	$: if (trackball) { trackball.maxDistance = maxDistance; }
	$: if (trackball) { trackball.minDistance = minDistance; }
	$: if (trackball) { trackball.panSpeed = panSpeed; }
	$: if (trackball) { trackball.rotateSpeed = rotateSpeed; }
	$: if (trackball) { trackball.zoomSpeed = zoomSpeed; }
	$: if (trackball) { trackball.dynamicDampingFactor = dynamicDampingFactor; }

	const didMountHandler = ({ renderer, scene, camera }) => {
		trackball = new TrackballControls(camera, renderer.domElement.parentNode);
		// bubble up event handler
		if (didMount) {
			didMount({ renderer, scene, camera });
		}
	};

	const didResizeHandler = (event) => {
		trackball.handleResize();
		// bubble up event handler
		if (didResize) {
			didResize(event);
		}
	};

	const animateHandler = () => {
		trackball.update();
		// bubble up event handler
		if (animate) {
			animate();
		}
	};

	onDestroy(() => trackball.dispose());
</script>

<ThreeView
	didMount={didMountHandler}
	didResize={didResizeHandler}
	animate={animateHandler}
/>
