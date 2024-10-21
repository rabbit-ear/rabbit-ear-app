<script lang="ts">
  import { untrack } from "svelte";
  import settings from "../Settings/ClassSettings.svelte.ts";

  let strokeWidthSlider = $state(5);

  $effect(() => {
    settings.strokeWidth = Math.pow(2, strokeWidthSlider) / 1e5;
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
    settings.strokeWidth = newStrokeWidth;
  });
</script>

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
