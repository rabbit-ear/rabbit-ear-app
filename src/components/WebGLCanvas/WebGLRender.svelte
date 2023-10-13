<script>
	import {
		identity4x4,
		multiplyMatrices4,
	} from "rabbit-ear/math/matrix4.js";
	import {
		onMount,
		onDestroy,
		createEventDispatcher,
	} from "svelte";
	import initialize from "rabbit-ear/webgl/general/initialize.js";
	import {
		rebuildViewport,
		makeProjectionMatrix,
		makeModelMatrix,
	} from "rabbit-ear/webgl/general/view.js";
	import creasePattern from "rabbit-ear/webgl/creasePattern/index.js";
	import foldedForm from "rabbit-ear/webgl/foldedForm/index.js";
	import {
		drawProgram,
		deallocProgram,
	} from "rabbit-ear/webgl/program.js";
	import { vectorFromScreenLocation } from "./general.js";
	import { LayerGapScaled } from "../../stores/Style.js";

	export let graph = {};
	export let fov = 30.25;
	export let perspective = "orthographic";
	// export let perspective = "perspective";

	// bind to this
	let canvas;

	$: canvasSize = canvas ? [canvas.clientWidth, canvas.clientHeight] : [1, 1];

	// matrices
	let modelMatrix = identity4x4;
	export let viewMatrix = identity4x4;
	let projectionMatrix = identity4x4;

	// the WebGL instance and which version: 1 or 2
	let gl;
	let version;

	// all mesh and shader data
	let programs = [];

	$: modelMatrix = makeModelMatrix(graph);
	$: modelViewMatrix = multiplyMatrices4(viewMatrix, modelMatrix);
	$: projectionMatrix = makeProjectionMatrix(canvas, perspective, fov);

	// $: inferredScale = 1 / modelViewMatrix[0];
	// $: uniforms = programs.map(prog => prog.makeUniforms(gl, {
	// 	projectionMatrix,
	// 	modelViewMatrix,
	// 	canvas,
	// 	frontColor: "white",
	// 	backColor: "#369",
	// 	cpColor: "#272222", // variable --background-1
	// 	strokeWidth: inferredScale * 0.02,
	// 	opacity: 1,
	// }));

	$: rebuildAndDraw(graph, projectionMatrix, $LayerGapScaled);
	$: draw(modelViewMatrix, perspective, fov);

	const dealloc = () => {
		programs.forEach(program => deallocProgram(gl, program));
		programs = [];
	};

	const draw = () => {
		if (!gl) { return; }
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		const inferredScale = 1 / modelViewMatrix[0];
		const uniforms = programs.map(prog => prog.makeUniforms(gl, {
			projectionMatrix,
			modelViewMatrix,
			canvas,
			frontColor: "white",
			backColor: "#369",
			cpColor: "#272222", // variable --background-1
			strokeWidth: inferredScale * 0.02,
			opacity: 1,
		}));
		programs.forEach((program, i) => drawProgram(gl, version, program, uniforms[i]));
	};

	const rebuildAndDraw = () => {
		rebuildPrograms();
		draw();
	};

	const rebuildPrograms = () => {
		if (!gl) { return; }
		dealloc();
		const options = {
			B: [0.5, 0.5, 0.5],
			b: [0.5, 0.5, 0.5],
			F: [0.3, 0.3, 0.3],
			f: [0.3, 0.3, 0.3],
			layerNudge: $LayerGapScaled,
			// outlines: $showFoldedFaceOutlines,
			// edges: $showFoldedCreases,
			// faces: $showFoldedFaces,
			// dark: $colorMode === "dark",
		};
		const isFoldedForm = graph
			&& graph.frame_classes
			&& graph.frame_classes.length
			&& graph.frame_classes.includes("foldedForm");
		try {
			programs = isFoldedForm
				? foldedForm(gl, version, graph, options)
				: creasePattern(gl, version, graph, options);
		} catch (error) { }
	};

	const onResize = (event) => {
		// trigger a recalculation of canvasSize
		// canvasSize = [canvas.clientWidth, canvas.clientHeight];
		if (!canvas) { return; }
		canvas = canvas;
		rebuildViewport(gl, canvas);
		rebuildAndDraw();
	};

	onMount(() => {
		// force a particular WebGL version
		// const init = initialize(canvas, 1); // WebGL version 1
		// const init = initialize(canvas, 2); // WebGL version 2
		const init = initialize(canvas);
		gl = init.gl;
		version = init.version;
		if (!gl) {
			const msg = "WebGL is not supported.";
			alert(msg);
			throw new Error(msg);
		}
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		rebuildViewport(gl, canvas);
	});

	onDestroy(dealloc);

	const formatEvent = (event) => {
		const screenPoint = [event.offsetX, event.offsetY];
		const vector = vectorFromScreenLocation(screenPoint, canvasSize, projectionMatrix);
		Object.assign(event, { vector });
		return event;
	};

	const dispatch = createEventDispatcher();
	const mousedown = (e) => dispatch("press", formatEvent(e));
	const mousemove = (e) => dispatch("move", formatEvent(e));
	const mouseup = (e) => dispatch("release", formatEvent(e));
	const touchstart = (e) => dispatch("press", formatEvent(e));
	const touchmove = (e) => dispatch("move", formatEvent(e));
	const touchend = (e) => dispatch("release", formatEvent(e));
	const wheel = (e) => dispatch("scroll", e);
</script>

<svelte:window on:resize={onResize} />

<canvas
	bind:this={canvas}
	on:mousedown={mousedown}
	on:mousemove={mousemove}
	on:mouseup={mouseup}
	on:wheel={wheel}
	on:touchstart={touchstart}
	on:touchmove={touchmove}
	on:touchend={touchend}
/>

<!-- set the second parameter of the addEventListener to "false" -->

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
