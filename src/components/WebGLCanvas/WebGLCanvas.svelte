<script>
	import {
		onMount,
		onDestroy,
	} from "svelte";
	import { identity4x4 } from "rabbit-ear/math/algebra/matrix4.js";
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
	import { Graph } from "../../stores/Model.js";

	let canvas;

	// the WebGL instance and which version: 1 or 2
	let gl;
	let version;

	// all mesh and shader data
	let programs = [];

	// matrices
	let projectionMatrix = identity4x4;
	let modelViewMatrix = identity4x4;

	$: rebuildAndDraw($Graph);

	const rebuildAndDraw = () => {
		modelViewMatrix = makeModelMatrix($Graph);
		rebuildPrograms();
		draw();
	};

	const draw = () => {
		if (!gl) { return; }
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		const uniforms = programs.map(prog => prog.makeUniforms(gl, {
			projectionMatrix,
			modelViewMatrix,
			canvas,
			frontColor: "#369",
			backColor: "white",
			cpColor: "#333",
			strokeWidth: 0.02,
			opacity: 1,
		}));
		programs.forEach((program, i) => drawProgram(gl, version, program, uniforms[i]));
	};

	const dealloc = () => {
		programs.forEach(program => deallocProgram(gl, program));
		programs = [];
	};

	const rebuildPrograms = () => {
		if (!gl) { return; }
		dealloc();
		const options = {
			F: [0.3, 0.3, 0.3],
			f: [0.3, 0.3, 0.3],
			// layerNudge: $layerNudge,
			// outlines: $showFoldedFaceOutlines,
			// edges: $showFoldedCreases,
			// faces: $showFoldedFaces,
			// dark: $colorMode === "dark",
		};
		const isFoldedForm = $Graph
			&& $Graph.frame_classes
			&& $Graph.frame_classes.length
			&& $Graph.frame_classes.includes("foldedForm");
		programs = isFoldedForm
			? foldedForm(gl, version, $Graph)
			: creasePattern(gl, version, $Graph, options);
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
		projectionMatrix = makeProjectionMatrix(canvas, "orthographic");
		rebuildAndDraw();
	});

	onDestroy(dealloc);
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
