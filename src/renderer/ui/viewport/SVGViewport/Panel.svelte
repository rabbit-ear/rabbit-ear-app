<script lang="ts">
  import { untrack } from "svelte";
  //import type { ClassPanel } from "./ClassPanel.svelte.ts";
  //import type { SVGViewport } from "../SVGViewport.svelte.ts";
  import settings from "./Settings/Settings.svelte.ts";
  import { niceNumber } from "../../../general/epsilon.ts";

  //let { viewport }: { viewport: SVGViewport } = $props();
  //let { panel }: { panel: ClassPanel } = $props();

  let strokeWidthSlider = $state(5);

  $effect(() => {
    settings.strokeWidthFactor = Math.pow(2, strokeWidthSlider) / 1e5;
  });

  $effect(() => {
    //const bounds = boundingBox(Frame.value);
    //const strokeWidthGuess =
    //  bounds && bounds.span
    //    ? getStrokeWidth(Frame.value, Math.max(...bounds.span))
    //    : getStrokeWidth(Frame.value);

    // todo: hardcoded
    const strokeWidthGuess = 0.005;

    //
    let newStrokeWidth: number = 0;
    untrack(() => {
      // invert this: Math.pow(2, strokeWidthSlider) / 1e5;
      strokeWidthSlider = Math.log2(strokeWidthGuess * 1e5);
      newStrokeWidth = Math.pow(2, strokeWidthSlider) / 1e5;
    });
    settings.strokeWidthFactor = newStrokeWidth;
  });
</script>

<div class="column gap">
  <div class="row">
    {#if settings.cursor}
      <p>{niceNumber(settings.cursor[0], 4)}, {niceNumber(settings.cursor[1], 4)}</p>
    {/if}
  </div>

  <div class="row">
    <label for="input-stroke-width-slider">stroke</label>
    <input
      id="input-stroke-width-slider"
      type="range"
      min="1"
      max="20"
      step="0.01"
      bind:value={strokeWidthSlider} />
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
