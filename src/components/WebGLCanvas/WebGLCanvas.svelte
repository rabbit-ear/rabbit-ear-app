<script>
	import { identity4x4 } from "rabbit-ear/math/matrix4.js";
	import WebGLRender from "./WebGLRender.svelte";
	import {
		WebGLFoldedFormPointerEvent,
	} from "../../stores/FoldedFormEvents.js";
	import {
		rotateViewMatrix,
		zoomViewMatrix,
	} from "./general.js";

	export let graph = {};

	let perspective = "perspective";
	let viewMatrix = identity4x4;

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
			viewMatrix = rotateViewMatrix(perspective, viewMatrix, vector, prevVector);
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
		viewMatrix = zoomViewMatrix(perspective, viewMatrix, delta);
	};
</script>

<WebGLRender
	{graph}
	{viewMatrix}
	on:press={onPress}
	on:move={onMove}
	on:release={onRelease}
	on:scroll={onScroll}
/>
