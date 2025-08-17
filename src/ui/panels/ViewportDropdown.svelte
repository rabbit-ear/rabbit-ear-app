<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Viewport } from "../viewports/Viewport.ts";
  import { SVGViewport } from "../viewports/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewports/WebGLViewport/WebGLViewport.svelte.ts";
  import Wrapper from "./Wrapper.svelte";
  import context from "../../app/context.svelte.ts";

  let {
    index,
    viewport,
    children,
  }: { index: number; viewport: Viewport; children: Snippet } = $props();

  // these match with the Viewport.embeddingName property
  const modelTypes = ["creasePattern", "foldedForm", "simulator"];
  // convert the above into what is shown on screen (abbreviated if necessary)
  const modelTypeNames = { creasePattern: "cp", foldedForm: "folded", simulator: "sim" };

  const swapSVG = (): void =>
    context.ui.viewportManager.replaceViewportWithName(index, "SVGViewport");
  const swapWebGL = (): void =>
    context.ui.viewportManager.replaceViewportWithName(index, "WebGLViewport");
  const removeViewport = () => {
    if (viewport) {
      context.ui.viewportManager.removeViewport(viewport);
    }
  };

  const isFolded = $derived(
    context.fileManager.document?.data.frameAttributes.isFoldedForm,
  );

  const computedStatesInfo: { [key: string]: string } = $derived({
    creasePattern: isFolded
      ? "frame is folded, no crease pattern available"
      : "frame is a crease pattern",
    foldedForm: isFolded ? "frame is already folded" : "folded form has been computed",
  });

  const computedInfo: string | undefined = $derived(
    computedStatesInfo[viewport?.embeddingName ?? ""],
  );

  let pad = "0.5rem";
  // background-color: #0002;
  let style = $derived(`position: absolute; top: ${pad}; right: ${pad};`);
</script>

<Wrapper title={"▼"} {style} expanded={false}>
  <div class="column gap">
    <div class="row">
      <button onclick={removeViewport}>- Remove</button>
    </div>

    <hr />

    <div class="row gap">
      <p>View Model</p>
      <div class="row toggle-row">
        {#each modelTypes as name}
          <button
            class={viewport.embeddingName === name ? "highlighted" : ""}
            onclick={() => {
              viewport.embeddingName = name;
            }}>{modelTypeNames[name]}</button>
        {/each}
      </div>
    </div>

    {#if computedInfo}
      <div class="row">
        <p>{computedInfo}</p>
      </div>
    {/if}

    <hr />

    <div class="row gap">
      <p>Renderer</p>
      <div class="row toggle-row">
        <button
          class={viewport?.constructor === SVGViewport ? "highlighted" : ""}
          onclick={swapSVG}>SVG</button>
        <button
          class={viewport?.constructor === WebGLViewport ? "highlighted" : ""}
          onclick={swapWebGL}>WebGL</button>
      </div>
    </div>
    <hr />
    {@render children?.()}
  </div>
</Wrapper>

<style>
  .column {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .gap {
    gap: var(--form-gap);
  }
</style>
