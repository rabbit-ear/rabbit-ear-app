<script lang="ts">
  import { untrack } from "svelte";
  import context from "../../app/context.svelte.ts";
  import { SVGViewport } from "../viewports/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewports/WebGLViewport/WebGLViewport.svelte.ts";
  import t from "../../app/t.ts";

  const addSVGViewport = () => context.ui.viewportManager.addViewport(new SVGViewport());
  const addWebGLViewport = () =>
    context.ui.viewportManager.addViewport(new WebGLViewport());

  let strokeWidthSlider = $state(5);
  let layersNudgeSlider = $state(6);

  $effect(() => {
    context.ui.settings.strokeWidthFactor.value = Math.pow(2, strokeWidthSlider) / 1e5;
  });

  $effect(() => {
    context.ui.settings.layersNudge.value = Math.pow(2, layersNudgeSlider) / 1e6;
  });

  $effect(() => {
    //const bounds = boundingBox(Frame.value);
    //const strokeWidthGuess =
    //  bounds && bounds.span
    //    ? getStrokeWidth(Frame.value, Math.max(...bounds.span))
    //    : getStrokeWidth(Frame.value);

    // todo: hardcoded
    const bounds = { span: [1, 1] };
    const strokeWidthGuess = 0.005;

    let newStrokeWidth: number = 0;
    untrack(() => {
      // invert this: Math.pow(2, strokeWidthSlider) / 1e5;
      strokeWidthSlider = Math.log2(strokeWidthGuess * 1e5);
      newStrokeWidth = Math.pow(2, strokeWidthSlider) / 1e5;
    });
    context.ui.settings.strokeWidthFactor.value = newStrokeWidth;

    // find a decent spacing between layers (LayerNudge)
    if (bounds && bounds.span) {
      const maxSpan = Math.max(...bounds.span);
      let newLayerNudge: number = 0;
      untrack(() => {
        layersNudgeSlider = Math.log2(maxSpan * 0.001 * 1e5);
        newLayerNudge = Math.pow(2, layersNudgeSlider) / 1e6;
      });
      context.ui.settings.layersNudge.value = newLayerNudge;
    }
  });
</script>

<div class="column gap">
  <div class="row gap">
    <button onclick={addSVGViewport}>+ {t("ui.viewports.SVG")}</button>
    <button onclick={addWebGLViewport}>+ {t("ui.viewports.WebGL")}</button>
  </div>

  <div class="row">
    <p>{context.ui.viewportManager.viewports.length} {t("ui.viewports")}</p>
  </div>

  <hr />

  <div class="row gap">
    <input
      type="checkbox"
      id="right-handed"
      bind:checked={context.ui.settings.rightHanded.value} />
    <label for="right-handed">right handed</label>
  </div>

  <div class="row">
    <label for="input-stroke-width-slider">{t("ui.viewports.stroke")}</label>
    <input
      id="input-stroke-width-slider"
      type="range"
      min="1"
      max="20"
      step="0.01"
      bind:value={strokeWidthSlider} />
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-grid"
      bind:checked={context.ui.settings.showGrid.value} /><label for="checkbox-show-grid"
      >show grid</label>
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-axes"
      bind:checked={context.ui.settings.showAxes.value} /><label for="checkbox-show-axes"
      >show axes</label>
  </div>

  <div class="row toggle-row">
    <button
      class={context.ui.settings.tiling.value === "triangle" ? "highlighted" : ""}
      onclick={(): string => (context.ui.settings.tiling.value = "triangle")}
      >triangle</button>
    <button
      class={context.ui.settings.tiling.value === "square" ? "highlighted" : ""}
      onclick={(): string => (context.ui.settings.tiling.value = "square")}>rect</button>
  </div>

  <div class="row">
    <div>
      <input
        type="range"
        min="1"
        max="20"
        step="0.01"
        id="slider-layer-nudge"
        bind:value={layersNudgeSlider} />
    </div>
    <div>
      <input
        type="text"
        class="long-input"
        bind:value={context.ui.settings.layersNudge.value} />
    </div>
  </div>

  <div class="row gap">
    <button onclick={(): void => context.ui.viewportManager.resetCameras()}
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
