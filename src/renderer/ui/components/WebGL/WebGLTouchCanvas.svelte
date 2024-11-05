<script lang="ts">
  import type {
    ViewportEvents,
    ViewportMouseEvent,
    ViewportWheelEvent,
    ViewportTouchEvent,
  } from "../../viewport/ViewportTypes.ts";
  import { identity4x4 } from "rabbit-ear/math/matrix4.js";
  import { vectorFromScreenLocation } from "../../../general/matrix.ts";
  import WebGLCanvas from "./WebGLCanvas.svelte";

  type PropsType = ViewportEvents & {
    gl?: WebGLRenderingContext | WebGL2RenderingContext;
    version?: number;
    canvas?: HTMLCanvasElement;
    canvasSize?: [number, number];
    redraw?: () => void;
    projectionMatrix?: number[];
  };

  let {
    gl = $bindable(),
    version = $bindable(),
    canvas = $bindable(),
    canvasSize = $bindable([0, 0]),
    redraw = $bindable(),
    projectionMatrix = [...identity4x4],
    onmousedown: mousedown,
    onmousemove: mousemove,
    onmouseup: mouseup,
    onmouseleave: mouseleave,
    onwheel: wheel,
    ontouchmove: touchmove,
    ontouchstart: touchstart,
    ontouchend: touchend,
    ontouchcancel: touchcancel,
  }: PropsType = $props();

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

  const onmousedown = (e: MouseEvent): void => mousedown?.(formatMouseEvent(e));
  const onmousemove = (e: MouseEvent): void => mousemove?.(formatMouseEvent(e));
  const onmouseup = (e: MouseEvent): void => mouseup?.(formatMouseEvent(e));
  const onmouseleave = (e: MouseEvent): void => mouseleave?.(formatMouseEvent(e));
  const onwheel = (e: WheelEvent): void => wheel?.(formatWheelEvent(e));
  const ontouchmove = (e: TouchEvent): void => touchmove?.(formatTouchEvent(e));
  const ontouchstart = (e: TouchEvent): void => touchstart?.(formatTouchEvent(e));
  const ontouchend = (e: TouchEvent): void => touchend?.(formatTouchEvent(e));
  const ontouchcancel = (e: TouchEvent): void => touchcancel?.(formatTouchEvent(e));
</script>

<WebGLCanvas
  bind:gl
  bind:version
  bind:canvas
  bind:canvasSize
  bind:redraw
  {onmousedown}
  {onmousemove}
  {onmouseup}
  {onmouseleave}
  {onwheel}
  {ontouchstart}
  {ontouchmove}
  {ontouchend}
  {ontouchcancel} />
