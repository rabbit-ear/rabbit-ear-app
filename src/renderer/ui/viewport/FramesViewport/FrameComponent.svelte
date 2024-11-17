<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import type { FramesViewport } from "./FramesViewport.svelte.ts";
  import type { Frame } from "./Frame.svelte.ts";
  import SVGCanvas from "../../components/SVG/SVGCanvas.svelte";
  //import SVGFOLDVertices from "../../components/SVG/SVGFOLDVertices.svelte";
  import SVGFOLDEdges from "../../components/SVG/SVGFOLDEdges.svelte";
  import SVGFOLDFaces from "../../components/SVG/SVGFOLDFaces.svelte";
  import app from "../../../app/App.svelte.js";

  type PropsType = {
    viewport: FramesViewport;
    frame: Frame;
  };

  let { viewport, frame }: PropsType = $props();

  let graph: FOLD = $derived(frame.graph);
  let index: number = $derived(frame.index);

  const onclick = (): void => {
    if (!app.fileManager.file) {
      return;
    }
    app.fileManager.activeFrame = index;
  };

  const highlighted = $derived(index === app.fileManager.activeFrame);

  const matrix = $derived(
    frame.view.rightHanded ? [1, 0, 0, -1, 0, 0].join(", ") : undefined,
  );
</script>

<button
  class={["button-frame-item", highlighted ? "highlighted" : ""].join(" ")}
  data-frame-index={index}
  {onclick}
  onmousedown={(): void => viewport.mousedown(index)}
  onmousemove={(): void => viewport.mousemove(index)}
  onmouseup={(): void => viewport.mouseup(index)}>
  <!-- <WebGLRender {graph} {viewMatrix} /> -->
  <!-- <div class={isFoldedForm ? "folded-form" : "crease-pattern"}></div> -->
  <SVGCanvas viewBox={frame.view.viewBoxString} stroke-width={frame.style.strokeWidth}>
    {#if matrix}
      <g class="wrapper" style="transform: matrix({matrix})">
        <!-- <SVGFOLDVertices {graph} /> -->
        <SVGFOLDEdges {graph} />
        <SVGFOLDFaces {graph} />
      </g>
    {:else}
      <!-- <SVGFOLDVertices {graph} /> -->
      <SVGFOLDEdges {graph} />
      <SVGFOLDFaces {graph} />
    {/if}
  </SVGCanvas>
</button>

<style>
  button {
    all: unset;
    cursor: pointer;
    flex: 0 0 auto;
    width: 5rem;
    height: 5rem;
    /* margin: 0.5rem 0; */
    border: 2px solid transparent;
    border-radius: 4px;
  }

  button:hover {
    border-color: var(--highlight);
  }

  button.highlighted {
    border-color: var(--highlight);
  }

  button:focus {
    outline-offset: -2px;
    outline: 2px solid var(--uiblue);
  }
</style>
