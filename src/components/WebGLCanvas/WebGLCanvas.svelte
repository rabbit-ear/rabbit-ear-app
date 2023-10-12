<script>
	import {
		magnitude2,
		subtract2,
	} from "rabbit-ear/math/vector.js";
	import {
		identity4x4,
		multiplyMatrices4,
		invertMatrix4,
		makeMatrix4Scale,
		makeMatrix4Translate,
	} from "rabbit-ear/math/matrix4.js";
	import {
		quaternionFromTwoVectors,
		matrix4FromQuaternion,
	} from "rabbit-ear/math/quaternion.js";
	import WebGLRender from "./WebGLRender.svelte";
	import {
		WebGLFoldedFormPointerEvent,
	} from "../../stores/FoldedFormTools.js";

	export let graph = {};

	let perspective = "perspective";
	// let perspective = "orthographic";
	let viewMatrix = identity4x4;

	const rotateViewMatrix = (vector, prevVector) => {
		switch (perspective) {
		case "perspective":
			const vectors = [
				[...prevVector, -0.2 * Math.atan(1 / magnitude2(prevVector))],
				[...vector, -0.2 * Math.atan(1 / magnitude2(vector))]
			];
			const quaternion = quaternionFromTwoVectors(...vectors);
			const matrix = matrix4FromQuaternion(quaternion);
			return multiplyMatrices4(matrix, viewMatrix);
		case "orthographic":
			const translateVector = subtract2(vector, prevVector);
			const translate = makeMatrix4Translate(...translateVector);
			const invertTranslate = invertMatrix4(translate);
			return multiplyMatrices4(invertTranslate, viewMatrix);
		default: return viewMatrix;
		}
	};

	const zoomViewMatrix = (delta) => {
		switch (perspective) {
		case "perspective":
			const translateMatrix = makeMatrix4Translate(0, 0, delta);
			return multiplyMatrices4(translateMatrix, viewMatrix);
		case "orthographic":
			const scale = 1 + delta;
			const scaleMatrix = makeMatrix4Scale([scale, scale, scale]);
			return multiplyMatrices4(scaleMatrix, viewMatrix);
		default: return viewMatrix;
		}
	};

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
			viewMatrix = rotateViewMatrix(vector, prevVector);
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
		viewMatrix = zoomViewMatrix(delta);
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
