<script lang="ts">
	import { type FOLD } from "rabbit-ear/types.js";
	import { identity4x4 } from "rabbit-ear/math/matrix4.js";
	import WebGLCanvas from "./WebGLCanvas.svelte";
	import type {
		ViewportMouseEvent,
		ViewportWheelEvent,
		ViewportTouchEvent,
	} from "../../viewport/events.ts";
	import { vectorFromScreenLocation } from "../../../general/matrix.ts";

	type WebGLTouchCanvasProps = {
		graph: FOLD;
		perspective: string;
		renderStyle: string;
		// projectionMatrix: number[],
		viewMatrix: number[];
		layerNudge?: number;
		fov?: number;
		darkMode?: boolean;
		frontColor?: string;
		backColor?: string;
		outlineColor?: string;
		cpColor?: string;
		strokeWidth?: number;
		opacity?: number;
		showFoldedFaceOutlines?: boolean;
		showFoldedCreases?: boolean;
		showFoldedFaces?: boolean;
		onmousedown?: (e: ViewportMouseEvent) => void;
		onmousemove?: (e: ViewportMouseEvent) => void;
		onmouseup?: (e: ViewportMouseEvent) => void;
		onmouseleave?: (e: ViewportMouseEvent) => void;
		onwheel?: (e: ViewportWheelEvent) => void;
		ontouchmove?: (e: ViewportTouchEvent) => void;
		ontouchstart?: (e: ViewportTouchEvent) => void;
		ontouchend?: (e: ViewportTouchEvent) => void;
		ontouchcancel?: (e: ViewportTouchEvent) => void;
		redraw?: Function;
	};

	let {
		graph = {},
		perspective = "orthographic",
		renderStyle = "creasePattern",
		// projectionMatrix = [...identity4x4],
		viewMatrix = [...identity4x4],
		layerNudge = 0.01,
		fov = 30.25,
		darkMode = true,
		frontColor = "#17F",
		backColor = "#fff",
		strokeWidth = 0.0025,
		opacity = 1,
		showFoldedFaceOutlines = true,
		showFoldedCreases = false,
		showFoldedFaces = true,
		onmousedown: mousedown,
		onmousemove: mousemove,
		onmouseup: mouseup,
		onmouseleave: mouseleave,
		onwheel: wheel,
		ontouchmove: touchmove,
		ontouchstart: touchstart,
		ontouchend: touchend,
		ontouchcancel: touchcancel,
		redraw = $bindable(),
	}: WebGLTouchCanvasProps = $props();

	let projectionMatrix: number[] = $state([...identity4x4]);
	let canvasSize: [number, number] = $state([0, 0]);

	const formatMouseEvent = (e: MouseEvent): ViewportMouseEvent =>
		Object.assign(e, {
			point: vectorFromScreenLocation(
				[e.offsetX, e.offsetY],
				canvasSize,
				projectionMatrix,
			),
		});

	const formatTouchEvent = (e: TouchEvent): ViewportTouchEvent =>
		Object.assign(e, {
			point: vectorFromScreenLocation(
				[e.touches[0]?.clientX || 0, e.touches[0]?.clientY || 0],
				canvasSize,
				projectionMatrix,
			),
		});

	const formatWheelEvent = (e: WheelEvent): ViewportWheelEvent =>
		Object.assign(e, {
			point: vectorFromScreenLocation(
				[e.offsetX, e.offsetY],
				canvasSize,
				projectionMatrix,
			),
		});

	const onmousedown = (e: MouseEvent) => mousedown?.(formatMouseEvent(e));
	const onmousemove = (e: MouseEvent) => mousemove?.(formatMouseEvent(e));
	const onmouseup = (e: MouseEvent) => mouseup?.(formatMouseEvent(e));
	const onmouseleave = (e: MouseEvent) => mouseleave?.(formatMouseEvent(e));
	const onwheel = (e: WheelEvent) => wheel?.(formatWheelEvent(e));
	const ontouchmove = (e: TouchEvent) => touchmove?.(formatTouchEvent(e));
	const ontouchstart = (e: TouchEvent) => touchstart?.(formatTouchEvent(e));
	const ontouchend = (e: TouchEvent) => touchend?.(formatTouchEvent(e));
	const ontouchcancel = (e: TouchEvent) => touchcancel?.(formatTouchEvent(e));

	// <!-- viewMatrix={Renderer.ViewMatrix} -->
</script>

<WebGLCanvas
	{graph}
	{perspective}
	{renderStyle}
	bind:canvasSize
	bind:projectionMatrix
	{viewMatrix}
	{layerNudge}
	{fov}
	{darkMode}
	{frontColor}
	{backColor}
	{strokeWidth}
	{opacity}
	{showFoldedFaceOutlines}
	{showFoldedCreases}
	{showFoldedFaces}
	{onmousedown}
	{onmousemove}
	{onmouseup}
	{onmouseleave}
	{onwheel}
	{ontouchstart}
	{ontouchmove}
	{ontouchend}
	{ontouchcancel}
	bind:redraw></WebGLCanvas>
