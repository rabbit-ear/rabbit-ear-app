<script lang="ts">
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import { untrack } from "svelte";

  let strokeWidthSlider = $state(5);

  let { viewport }: { viewport: WebGLViewport } = $props();
  //let { panel }: { panel: ClassPanel } = $props();

  $effect(() => {
    viewport.constructor.settings.strokeWidth = Math.pow(2, strokeWidthSlider) / 1e5;
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
    viewport.constructor.settings.strokeWidth = newStrokeWidth;
  });
</script>

<div class="row toggle-row">
  <button>A</button>
  <button>B</button>
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

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
