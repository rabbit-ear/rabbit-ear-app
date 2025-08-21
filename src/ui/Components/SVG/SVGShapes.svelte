<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  import type { Shape } from "../../../shapes/Shape.ts";
  import { shapeToSVGElement } from "../../../shapes/svg.ts";
  import type { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte.ts";

  type PropsType = {
    shapes: Shape[] | undefined;
    viewport: SVGViewport;
  };

  const { shapes, viewport, ...props }: PropsType & SVGAttributes<SVGGElement> = $props();

  const shapesStyle = $derived({
    viewBox: viewport.view.viewBox,
    radius: viewport.style.circleRadius,
  });

  const shapesSVG: { nodeName: string; attributes: object }[] = $derived(
    (shapes ?? [])
      .map((shape) => shapeToSVGElement(shape, shapesStyle))
      .filter((a) => a !== undefined),
  );
</script>

<g {...props}>
  {#each shapesSVG as { nodeName, attributes }}
    {#if nodeName === "circle"}
      <circle {...attributes} />
    {:else if nodeName === "line"}
      <line {...attributes} />
    {/if}
  {/each}
</g>

<style>
  circle.circle {
    fill: none;
    stroke: var(--text);
  }
  circle.point {
    fill: var(--text);
    stroke: none;
  }
</style>
