<script lang="ts">
  import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
  import type { SVGFixedPoint } from "./SVGFixedPoint.svelte.ts";

  type PropsType = {
    fixedPoint: SVGFixedPoint;
    viewport: SVGViewport;
  };
  let { fixedPoint, viewport }: PropsType = $props();

  const highlighted = $derived(fixedPoint ? fixedPoint.highlighted : false);
  const className = $derived(highlighted ? "highlighted" : "");
  const origin = $derived(fixedPoint ? fixedPoint.origin : [0, 0]);
  const radius = $derived(viewport.style.circleRadius);

  // svg elements
  const originCircle1 = $derived({
    cx: origin[0],
    cy: origin[1],
    r: radius * 1.5,
  });
  const originCircle2 = $derived({
    cx: origin[0],
    cy: origin[1],
    r: radius * 2,
  });
  const originLine1 = $derived({
    x1: origin[0],
    y1: origin[1] - radius * 3,
    x2: origin[0],
    y2: origin[1] + radius * 3,
  });
  const originLine2 = $derived({
    x1: origin[0] - radius * 3,
    y1: origin[1],
    x2: origin[0] + radius * 3,
    y2: origin[1],
  });
</script>

<circle {...originCircle1} class={className} />
<circle {...originCircle2} class={className} />
<line {...originLine1} class={className} />
<line {...originLine2} class={className} />

<style>
  circle {
    fill: none;
    stroke: var(--text);
  }
  line {
    fill: none;
    stroke: var(--text);
  }
  .highlighted {
    stroke: #fb4;
  }
</style>
