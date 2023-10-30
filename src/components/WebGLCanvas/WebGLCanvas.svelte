<script>
	import { identity4x4 } from "rabbit-ear/math/matrix4.js";
	import WebGLRender from "./WebGLRender.svelte";
	import {
		WebGLFoldedFormPointerEvent,
	} from "../../stores/FoldedFormEvents.js";
	import {
		rotateViewMatrix,
		zoomViewMatrix,
		IsFoldedForm,
	} from "./general.js";
	import {
		WebGLViewMatrix,
	} from "../../stores/ViewBox.js";

	export let graph = {};

	// WebGLRender is always "orthographic" (until changed by the user).
	// even for folded forms, it will show them as orthographic.
	// WebGLRender is used throughout the app in many places.

	// WebGLCanvas, however, is used in one place, and is tied to the current
	// FoldedForm model, and its perspective will change depending.
	$: perspective = IsFoldedForm(graph) ? "perspective" : "orthographic";

	let prevVector;
	const onPress = ({ detail }) => {
		detail.preventDefault();
		const { point, vector } = detail;
		prevVector = vector;
		WebGLFoldedFormPointerEvent("press", { point, vector });
	};

	const onMove = ({ detail }) => {
		detail.preventDefault();
		const { point, vector } = detail;
		const buttons = prevVector ? 1 : 0;
		if (buttons) {
			$WebGLViewMatrix = rotateViewMatrix(perspective, $WebGLViewMatrix, vector, prevVector);
			prevVector = vector;
		}
		WebGLFoldedFormPointerEvent("move", { point, vector, buttons });
	};

	const onRelease = () => {
		prevVector = undefined;
		WebGLFoldedFormPointerEvent("release", {});
	};

	const onScroll = ({ detail }) => {
		detail.preventDefault();
		const scrollSensitivity = 1 / 100;
		const delta = -detail.deltaY * scrollSensitivity;
		if (Math.abs(delta) < 1e-3) { return; }
		$WebGLViewMatrix = zoomViewMatrix(perspective, $WebGLViewMatrix, delta);
	};
</script>

<WebGLRender
	{graph}
	{perspective}
	viewMatrix={$WebGLViewMatrix}
	on:press={onPress}
	on:move={onMove}
	on:release={onRelease}
	on:scroll={onScroll}
/>
