<script lang="ts">
  import type { Snippet } from "svelte";
  import SVGCanvas from "./SVGCanvas.svelte";
  import type {
    ViewportMouseEvent,
    ViewportWheelEvent,
    ViewportTouchEvent,
  } from "../../viewport/events.ts";
  import { convertToViewBox, findInParents } from "../../../general/dom.ts";

  interface PropsType {
    svg?: SVGSVGElement;
    viewBox?: string;
    invertVertical?: boolean;
    onmousedown?: (e: ViewportMouseEvent) => void;
    onmousemove?: (e: ViewportMouseEvent) => void;
    onmouseup?: (e: ViewportMouseEvent) => void;
    onmouseleave?: (e: ViewportMouseEvent) => void;
    onwheel?: (e: ViewportWheelEvent) => void;
    ontouchmove?: (e: ViewportTouchEvent) => void;
    ontouchstart?: (e: ViewportTouchEvent) => void;
    ontouchend?: (e: ViewportTouchEvent) => void;
    ontouchcancel?: (e: ViewportTouchEvent) => void;
    children?: Snippet;
    rest?: any[];
  }

  let {
    svg = $bindable(),
    viewBox = "0 0 1 1",
    invertVertical = false,
    onmousedown: mousedown,
    onmousemove: mousemove,
    onmouseup: mouseup,
    onmouseleave: mouseleave,
    onwheel: wheel,
    ontouchmove: touchmove,
    ontouchstart: touchstart,
    ontouchend: touchend,
    ontouchcancel: touchcancel,
    children,
    ...rest
  }: PropsType = $props();

  const getSVG = (e: MouseEvent | TouchEvent): SVGSVGElement => {
    if (svg) {
      return svg;
    }
    const foundSVG = findInParents(e.target, "svg") as SVGSVGElement;
    return foundSVG;
  };

  let scale = 1;
  const unwrap = (point: [number, number]): [number, number] => [
    (1 / scale) * point[0],
    (1 / scale) * point[1] * (invertVertical ? -1 : 1),
  ];

  const formatMouseEvent = (e: MouseEvent): ViewportMouseEvent =>
    Object.assign(e, {
      point: unwrap(convertToViewBox(getSVG(e), [e.x, e.y])),
    });

  const formatTouchEvent = (e: TouchEvent): ViewportTouchEvent =>
    Object.assign(e, {
      point: unwrap(
        convertToViewBox(getSVG(e), [e.touches[0].clientX, e.touches[0].clientY]),
      ),
    });

  const formatWheelEvent = (e: WheelEvent): ViewportWheelEvent =>
    Object.assign(e, {
      point: convertToViewBox(getSVG(e), [e.x, e.y]),
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
</script>

<SVGCanvas
  bind:svg
  {viewBox}
  {invertVertical}
  {onmousedown}
  {onmousemove}
  {onmouseup}
  {onmouseleave}
  {onwheel}
  {ontouchstart}
  {ontouchmove}
  {ontouchend}
  {ontouchcancel}
  {...rest}>
  {#if children}
    {@render children()}
  {/if}
</SVGCanvas>
