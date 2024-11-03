<script lang="ts">
  import Settings from "./Settings.svelte.ts";
  import Style from "./Style.svelte.ts";
</script>

<div class={"container"}>
  <!--
  <h3>
    show strain
    <input type="checkbox" disabled={!Settings.active} bind:checked={Settings.strain} />
  </h3>
  -->
  <h3>
    show strain
    <input type="checkbox" bind:checked={Settings.strain} />
  </h3>

  <h3>
    show touches
    <input type="checkbox" bind:checked={Style.showTouches} />
  </h3>

  <h3>
    show shadows
    <input type="checkbox" disabled={Settings.strain} bind:checked={Style.showShadows} />
  </h3>

  <h3>
    background
    <input type="text" class="medium" bind:value={Style.backgroundColor} />
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

  <h3>lines</h3>
  <input type="range" min="0" max="1" step="0.02" bind:value={Style.lineOpacity} />
  <div>
    <input type="checkbox" id="show-line-boundary" bind:checked={Style.showBoundary} />
    <input type="text" class="medium" bind:value={Style.boundaryColor} />
    <label for="show-line-boundary">boundary</label>
    <br />
    <input type="checkbox" id="show-line-mountain" bind:checked={Style.showMountain} />
    <input type="text" class="medium" bind:value={Style.mountainColor} />
    <label for="show-line-mountain">mountain</label>
    <br />
    <input type="checkbox" id="show-line-valley" bind:checked={Style.showValley} />
    <input type="text" class="medium" bind:value={Style.valleyColor} />
    <label for="show-line-valley">valley</label>
    <br />
    <input type="checkbox" id="show-line-flat" bind:checked={Style.showFlat} />
    <input type="text" class="medium" bind:value={Style.flatColor} />
    <label for="show-line-flat">flat</label>
    <br />
    <input type="checkbox" id="show-line-join" bind:checked={Style.showJoin} />
    <input type="text" class="medium" bind:value={Style.joinColor} />
    <label for="show-line-join">triangulated</label>
    <br />
    <input
      type="checkbox"
      id="show-line-unassigned"
      bind:checked={Style.showUnassigned} />
    <input type="text" class="medium" bind:value={Style.unassignedColor} />
    <label for="show-line-unassigned">unassigned</label>
  </div>
</div>

<style>
  .container {
    background-color: #000b;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5rem;
    overflow-y: auto;
    max-height: 100vh;
    text-shadow:
      -1px -1px 0 #0008,
      1px -1px 0 #0008,
      -1px 1px 0 #0008,
      1px 1px 0 #0008;
  }
  .container > * {
    margin: 0.33rem 0;
  }
  /*.container input[type=radio] + * {*/
  .container input {
    margin: 0rem 0.25rem;
  }
</style>
