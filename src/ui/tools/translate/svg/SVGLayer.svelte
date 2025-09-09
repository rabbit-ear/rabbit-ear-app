<script lang="ts">
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
  import { add2 } from "rabbit-ear/math/vector.js";

  type PropsType = {
    viewport: SVGViewport;
    getVector: () => [number, number] | undefined;
    getPressed: () => [number, number] | undefined;
    getIsPressed: () => boolean;
  };
  let { viewport, getVector, getPressed, getIsPressed }: PropsType = $props();

  const points = $derived(
    getIsPressed() && getPressed() !== undefined
      ? [getPressed(), add2(getPressed(), getVector())]
      : undefined,
  );
  const line = $derived(
    points !== undefined
      ? { x1: points[0][0], y1: points[0][1], x2: points[1][0], y2: points[1][1] }
      : undefined,
  );
</script>

{#if line}
  <line {...line} />
{/if}
