<script lang="ts">
  import type { SimulatorViewport } from "./SimulatorViewport.svelte.ts";
  let { viewport }: { viewport: SimulatorViewport } = $props();
</script>

<div class="row toggle-row">
  <button
    class={viewport.view.perspective === "perspective" ? "highlighted" : ""}
    onclick={(): string => (viewport.view.perspective = "perspective")}>3D</button>
  <button
    class={viewport.view.perspective === "orthographic" ? "highlighted" : ""}
    onclick={(): string => (viewport.view.perspective = "orthographic")}>2D</button>
</div>

<div class="row toggle-row">
  <button
    class={viewport.view.renderStyle === "creasePattern" ? "highlighted" : ""}
    onclick={(): string => (viewport.view.renderStyle = "creasePattern")}>CP</button>
  <button
    class={viewport.view.renderStyle === "foldedForm" ? "highlighted" : ""}
    onclick={(): string => (viewport.view.renderStyle = "foldedForm")}>folded</button>
</div>

<div class="row gap">
  <p>lines</p>
  <input
    type="range"
    min="0"
    max="1"
    step="0.02"
    bind:value={viewport.style.lineOpacity} />
</div>
<div class="row gap">
  <input type="checkbox" id="show-boundary" bind:checked={viewport.style.showBoundary} />
  <input type="text" class="medium" bind:value={viewport.style.boundaryColor} />
  <label for="show-boundary">boundary</label>
</div>
<div class="row gap">
  <input type="checkbox" id="show-mountain" bind:checked={viewport.style.showMountain} />
  <input type="text" class="medium" bind:value={viewport.style.mountainColor} />
  <label for="show-mountain">mountain</label>
</div>
<div class="row gap">
  <input type="checkbox" id="show-valley" bind:checked={viewport.style.showValley} />
  <input type="text" class="medium" bind:value={viewport.style.valleyColor} />
  <label for="show-valley">valley</label>
</div>
<div class="row gap">
  <input type="checkbox" id="show-flat" bind:checked={viewport.style.showFlat} />
  <input type="text" class="medium" bind:value={viewport.style.flatColor} />
  <label for="show-flat">flat</label>
</div>
<div class="row gap">
  <input type="checkbox" id="show-join" bind:checked={viewport.style.showJoin} />
  <input type="text" class="medium" bind:value={viewport.style.joinColor} />
  <label for="show-join">triangulated</label>
</div>
<div class="row gap">
  <input
    type="checkbox"
    id="show-unassigned"
    bind:checked={viewport.style.showUnassigned} />
  <input type="text" class="medium" bind:value={viewport.style.unassignedColor} />
  <label for="show-unassigned">unassigned</label>
</div>

<!--
  <h3>
    show strain
    <input type="checkbox" bind:checked={Settings.strain} />
  </h3>

  <h3>
    front
    <input type="checkbox" id="show-faces-front" bind:checked={Style.showFront} />
    <input type="text" class="medium" bind:value={Style.frontColor} />
  </h3>
  <h3>
    back
    <input type="checkbox" id="show-faces-back" bind:checked={Style.showBack} />
    <input type="text" class="medium" bind:value={Style.backColor} />
  </h3>
-->

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .gap {
    gap: 0.5rem;
  }
  input[type="text"] {
    width: 4rem;
  }
</style>
