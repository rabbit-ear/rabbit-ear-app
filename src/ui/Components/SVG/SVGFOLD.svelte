<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import type { SVGAttributes } from "svelte/elements";
  import type { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte";
  import SVGFOLDVertices from "./SVGFOLDVertices.svelte";
  import SVGFOLDEdges from "./SVGFOLDEdges.svelte";
  import SVGFOLDFaces from "./SVGFOLDFaces.svelte";

  type PropsType = {
    viewport?: SVGViewport;
    graph?: FOLD;
  };

  const {
    viewport,
    graph = {},
    ...props
  }: PropsType & SVGAttributes<SVGGElement> = $props();

  const file_classes = $derived(graph.file_classes || []);
  const frame_classes = $derived(graph.frame_classes || []);
  const className = $derived(file_classes.concat(frame_classes).join(" "));

  const showVertices = $derived(viewport?.style.showVertices ?? false);
  const showEdges = $derived(viewport?.style.showEdges ?? true);
  const showFaces = $derived(viewport?.style.showFaces ?? true);
</script>

<g class={className} {...props}>
  {#if showFaces}
    <g class="faces">
      <SVGFOLDFaces {graph} />
    </g>
  {/if}
  {#if showEdges}
    <g class="edges">
      <SVGFOLDEdges {graph} />
    </g>
  {/if}
  {#if showVertices}
    <g class="vertices">
      <SVGFOLDVertices {graph} />
    </g>
  {/if}
</g>
