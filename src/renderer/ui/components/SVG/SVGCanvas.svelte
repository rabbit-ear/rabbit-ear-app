<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  interface PropsType {
    svg?: SVGSVGElement;
    viewBox?: string;
    onmousedown?: (e: MouseEvent) => void;
    onmousemove?: (e: MouseEvent) => void;
    onmouseup?: (e: MouseEvent) => void;
    onmouseleave?: (e: MouseEvent) => void;
    onwheel?: (e: WheelEvent) => void;
    ontouchmove?: (e: TouchEvent) => void;
    ontouchstart?: (e: TouchEvent) => void;
    ontouchend?: (e: TouchEvent) => void;
    ontouchcancel?: (e: TouchEvent) => void;
    children?: Snippet;
    //props?: unknown[];
  }

  let {
    svg = $bindable(),
    viewBox = "0 0 1 1",
    onmousedown,
    onmousemove,
    onmouseup,
    onmouseleave,
    onwheel,
    ontouchmove,
    ontouchstart,
    ontouchend,
    ontouchcancel,
    children,
    ...props
  }: PropsType & SVGAttributes<SVGSVGElement> = $props();

  const onfocus = (): void => {};
  const onblur = (): void => {};
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  role="presentation"
  bind:this={svg}
  {onfocus}
  {onblur}
  {viewBox}
  {onmousedown}
  {onmousemove}
  {onmouseup}
  {onmouseleave}
  {onwheel}
  {ontouchstart}
  {ontouchmove}
  {ontouchend}
  {ontouchcancel}
  {...props}>
  {#if children}
    {@render children()}
  {/if}
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
  }

  /* Chrome (not Firefox) draws a focus border. remove it */
  svg:focus {
    outline-width: 0;
  }
</style>
