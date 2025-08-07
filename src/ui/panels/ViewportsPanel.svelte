<script lang="ts">
  import context from "../../app/context.svelte.ts";
  import { SVGViewport } from "../viewports/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewports/WebGLViewport/WebGLViewport.svelte.ts";
  import t from "../../app/t.ts";

  const addSVGViewport = () => context.ui?.viewportManager.addViewport(new SVGViewport());
  const addWebGLViewport = () =>
    context.ui?.viewportManager.addViewport(new WebGLViewport());
</script>

<div class="column gap">
  <div class="row gap">
    <input
      type="checkbox"
      id="right-handed"
      bind:checked={context.ui!.settings.rightHanded.value} />
    <label for="right-handed">right handed</label>
  </div>

  <div class="row">
    <p>{context.ui?.viewportManager.viewports.length} {t("ui.viewports")}</p>
  </div>

  <div class="row gap">
    <button onclick={addSVGViewport}>+ {t("ui.viewports.SVG")}</button>
    <button onclick={addWebGLViewport}>+ {t("ui.viewports.WebGL")}</button>
  </div>

  <div class="row gap">
    <button onclick={(): void => context.ui?.viewportManager.resetCameras()}
      >reset cameras</button>
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
