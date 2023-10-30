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
	import {
		IsFoldedForm,
		vectorFromScreenLocation,
	} from "./general.js";
	import {
		FoldedFrontColor,
		FoldedBackColor,
		CPColor,
		LayerGapScaled,
	} from "../../stores/Style.js";

	export let graph = {};
	export let fov = 30.25;
	export let perspective = "orthographic";
	export let viewMatrix = identity4x4;

	let gl;
	let version;
	let canvas;
	let programs = [];

	$: canvasSize = canvas ? [canvas.clientWidth, canvas.clientHeight] : [1, 1];
	$: modelMatrix = makeModelMatrix(graph);
	$: modelViewMatrix = multiplyMatrices4(viewMatrix, modelMatrix);
	$: projectionMatrix = makeProjectionMatrix(canvas, perspective, fov);
	$: inferredScale = 1 / modelViewMatrix[0];
	$: isFoldedForm = IsFoldedForm(graph);

	$: uniformOptions = {
		projectionMatrix,
		modelViewMatrix,
		canvas,
		frontColor: $FoldedFrontColor,
		backColor: $FoldedBackColor,
		cpColor: $CPColor,
		strokeWidth: inferredScale * 0.02,
		opacity: 1, // $LayerOrderKnown ? 1 : 0.25,
	};

	$: programOptions = {
		B: [0.5, 0.5, 0.5],
		b: [0.5, 0.5, 0.5],
		F: [0.3, 0.3, 0.3],
		f: [0.3, 0.3, 0.3],
		layerNudge: $LayerGapScaled,
		// outlines: $showFoldedFaceOutlines,
		// edges: $showFoldedCreases,
		// faces: $showFoldedFaces,
	};

	$: uniforms = programs
		.map((prog, i) => prog
			.makeUniforms(gl, uniformOptions));

	$: {
		try {
			dealloc();
			programs = isFoldedForm
				? foldedForm(gl, version, graph, programOptions)
				: creasePattern(gl, version, graph, programOptions);
		} catch (error) { }
	};

	$: if (gl) {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		programs.forEach((program, i) => drawProgram(gl, version, program, uniforms[i]));
	};

	const dealloc = () => {
		programs.forEach(program => deallocProgram(gl, program));
		programs = [];
	};

	const onResize = () => {
		if (!canvas) { return; }
		canvas = canvas;
		rebuildViewport(gl, canvas);
	};

	onMount(() => {
		const init = initialize(canvas); // initialize(canvas, 1); // WebGL 1
		gl = init.gl;
		version = init.version;
		if (!gl) {
			const msg = "WebGL is not supported.";
			return alert(msg);
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

<!-- previously, the second parameter of addEventListener was "false" -->

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
