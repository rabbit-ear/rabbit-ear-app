<script lang="ts">
  import context from "../../app/context.svelte.ts";
  import { SVGViewport } from "../viewports/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewports/WebGLViewport/WebGLViewport.svelte.ts";

  const addSVGViewport = () => context.ui?.viewportManager.addViewport(new SVGViewport());
  const addWebGLViewport = () =>
    context.ui?.viewportManager.addViewport(new WebGLViewport());
  // const removeViewport = () =>
  //   context.ui?.viewportManager.removeViewport(context.ui?.viewportManager.viewports[0]);
  const removeViewport = () =>
    context.ui?.viewportManager.removeViewport(
      context.ui?.viewportManager.viewports[
        context.ui?.viewportManager.viewports.length - 1
      ],
    );
</script>

<div class="column gap">
  <div class="row">
    <p>{context.ui?.viewportManager.viewports.length} viewports</p>
  </div>

  <div class="row">
    <button onclick={addSVGViewport}>+ SVG</button>
    <button onclick={addWebGLViewport}>+ WebGL</button>
    <button onclick={removeViewport}>- Viewport</button>
  </div>
</div>

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
