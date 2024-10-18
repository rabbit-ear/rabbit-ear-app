<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import type { SVGAttributes } from "svelte/elements";
  import SVGFOLDVertices from "./SVGFOLDVertices.svelte";
  import SVGFOLDEdges from "./SVGFOLDEdges.svelte";
  import SVGFOLDFaces from "./SVGFOLDFaces.svelte";

  type PropsType = {
    graph?: FOLD;
  };

  const { graph = {}, ...props }: PropsType & SVGAttributes<SVGGElement> = $props();

  const file_classes = graph.file_classes || [];
  const frame_classes = graph.frame_classes || [];
  const className = file_classes.concat(frame_classes).join(" ");
</script>

<g class={className} {...props}>
  <g class="faces">
    <SVGFOLDFaces {graph} />
  </g>
  <g class="edges">
    <SVGFOLDEdges {graph} />
  </g>
  <g class="vertices">
    <!-- <SVGFOLDVertices {graph} /> -->
  </g>
</g>
