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

	export let graph = {};

	let perspective = "perspective";
	// let perspective = "orthographic";
	let viewMatrix = identity4x4;

	let prevVector;
	const onPress = ({ detail }) => {
		detail.preventDefault();
		const { point, vector } = detail;
		prevVector = vector;
	};

	const onMove = ({ detail }) => {
		detail.preventDefault();
		if (!prevVector) { return; }
		const { point, vector } = detail;
		switch (perspective) {
			case "perspective": {
				const vectors = [
					[...prevVector, -0.2 * Math.atan(1 / magnitude2(prevVector))],
					[...vector, -0.2 * Math.atan(1 / magnitude2(vector))]
				];
				const quaternion = quaternionFromTwoVectors(...vectors);
				const matrix = matrix4FromQuaternion(quaternion);
				viewMatrix = multiplyMatrices4(matrix, viewMatrix);
			} break;
			case "orthographic": {
				const translateVector = subtract2(vector, prevVector);
				const translate = makeMatrix4Translate(...translateVector);
				const matrix = invertMatrix4(translate);
				viewMatrix = multiplyMatrices4(matrix, viewMatrix);
			} break;
		}
		prevVector = vector;
	};

	const onScroll = ({ detail }) => {
		detail.preventDefault();
		const scrollSensitivity = 1 / 100;
		const delta = -detail.deltaY * scrollSensitivity;
		if (Math.abs(delta) < 1e-3) { return; }
		switch (perspective) {
			case "perspective": {
				const translateMatrix = makeMatrix4Translate(0, 0, delta);
				viewMatrix = multiplyMatrices4(translateMatrix, viewMatrix);
			} break;
			case "orthographic": {
				const scale = 1 + delta;
				const scaleMatrix = makeMatrix4Scale([scale, scale, scale]);
				viewMatrix = multiplyMatrices4(scaleMatrix, viewMatrix);
			} break;
		}
	};

	const onRelease = () => {
		prevVector = undefined;
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
