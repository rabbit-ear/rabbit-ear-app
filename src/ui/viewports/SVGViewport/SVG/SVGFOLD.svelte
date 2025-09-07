<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import type { SVGAttributes } from "svelte/elements";
  import type { SVGViewport } from "../SVGViewport.svelte.ts";
  import SVGFOLDVertices from "./SVGFOLDVertices.svelte";
  import SVGFOLDEdges from "./SVGFOLDEdges.svelte";
  import SVGFOLDFaces from "./SVGFOLDFaces.svelte";

  type PropsType = {
    viewport?: SVGViewport;
    graph?: FOLD;
    faceGraph?: FOLD;
    edgeGraph?: FOLD;
    vertexGraph?: FOLD;
  };

  const {
    viewport,
    graph = {},
    faceGraph,
    edgeGraph,
    vertexGraph,
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
      <SVGFOLDFaces graph={faceGraph ?? graph} />
    </g>
  {/if}
  {#if showEdges}
    <g class="edges">
      <SVGFOLDEdges graph={edgeGraph ?? graph} />
    </g>
  {/if}
  {#if showVertices}
    <g class="vertices">
      <SVGFOLDVertices graph={vertexGraph ?? graph} />
    </g>
  {/if}
</g>
