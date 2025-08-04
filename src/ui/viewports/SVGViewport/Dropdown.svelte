<script lang="ts">
  import { SVGViewport } from "./SVGViewport.svelte.ts";
  //let { viewport }: { viewport: SVGViewport } = $props();
</script>

<div class="row toggle-row">
  <button
    class={SVGViewport.settings.tiling === "triangle" ? "highlighted" : ""}
    onclick={(): string => (SVGViewport.settings.tiling = "triangle")}>triangle</button>
  <button
    class={SVGViewport.settings.tiling === "square" ? "highlighted" : ""}
    onclick={(): string => (SVGViewport.settings.tiling = "square")}>rect</button>
</div>

<div class="row">
  <input
    type="checkbox"
    id="checkbox-show-grid"
    bind:checked={SVGViewport.settings.showGrid} /><label for="checkbox-show-grid"
    >show grid</label>
</div>

<div class="row">
  <input
    type="checkbox"
    id="checkbox-show-axes"
    bind:checked={SVGViewport.settings.showAxes} /><label for="checkbox-show-axes"
    >show axes</label>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
