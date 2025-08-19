<script lang="ts">
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
  import type { GlobalState } from "./GlobalState.svelte.ts";

  type PropsType = {
    getGlobalState: () => GlobalState;
    viewport: SVGViewport;
  };
  let { getGlobalState, viewport }: PropsType = $props();

  const vertexInfo = $derived(getGlobalState().nearestVertex);
  const edgeInfo = $derived(getGlobalState().nearestEdge);
  const faceInfo = $derived(getGlobalState().nearestFace);

  const vertexCoords = $derived(vertexInfo?.coords);
  const edgeCoords = $derived(edgeInfo?.coords);
  const faceCoords = $derived(faceInfo?.poly);
  const facePoints = $derived((faceCoords ?? []).map(([x, y]) => `${x},${y}`).join(" "));

  // const vertex = $derived(vertexInfo?.index);
  // const edge = $derived(edgeInfo?.index);
  // const face = $derived(edgeInfo?.index);
</script>

{#if vertexCoords}
  <circle cx={vertexCoords[0]} cy={vertexCoords[1]} r="var(--circle-radius)" />
{/if}

{#if edgeCoords}
  <line
    x1={edgeCoords[0][0]}
    y1={edgeCoords[0][1]}
    x2={edgeCoords[1][0]}
    y2={edgeCoords[1][1]} />
{/if}

{#if facePoints}
  <polygon points={facePoints} />
{/if}

<style>
  polygon {
    stroke: none;
    fill: var(--highlight);
    opacity: 0.25;
  }
  circle {
    stroke: none;
    fill: var(--highlight);
  }
  line {
    stroke: var(--highlight);
  }
</style>
