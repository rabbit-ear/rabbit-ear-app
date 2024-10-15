<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import FrameItem from "./FrameItem.svelte";
  //import WebGlCanvas from "../../components/WebGL/WebGLCanvas.svelte";
  import SVGCanvas from "../../components/SVG/SVGCanvas.svelte";
  import SVGFOLDVertices from "../../components/SVG/SVGFOLDVertices.svelte";
  import SVGFOLDEdges from "../../components/SVG/SVGFOLDEdges.svelte";
  import SVGFOLDFaces from "../../components/SVG/SVGFOLDFaces.svelte";
  //import { VerticalUp } from "../../stores/App.js";
  //import { IsFoldedForm } from "../../js/graph.js";
  import app from "../../../app/App.svelte.js";

  type PropsType = {
    graph: FOLD;
    index: number;
    mousedown: (index: number) => void;
    mousemove: (index: number) => void;
    mouseup: (index: number) => void;
  };

  let { graph, index, mousedown, mouseup, mousemove }: PropsType = $props();

  const onclick = (): void => {
    //app.file.geometry.frameIndex = index;
  };

  //$: isFoldedForm = IsFoldedForm(graph);
  //$: invertVertical = $VerticalUp;

  // $: viewMatrix = [1, 0, 0, 0, 0, $VerticalUp ? 1 : -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
</script>

<FrameItem
  {onclick}
  onmousedown={(): void => mousedown(index)}
  onmousemove={(): void => mousemove(index)}
  onmouseup={(): void => mouseup(index)}
  highlighted={index === app.file.activeFrame}
  {index}>
  <!-- <WebGLRender {graph} {viewMatrix} /> -->
  <SVGCanvas>
    <SVGFOLDVertices {graph} />
    <SVGFOLDEdges {graph} />
    <SVGFOLDFaces {graph} />
  </SVGCanvas>
  <!--
  <div class={isFoldedForm ? "folded-form" : "crease-pattern"}>
    <SVGCanvas {graph} {invertVertical} />
  </div>
  -->
</FrameItem>
