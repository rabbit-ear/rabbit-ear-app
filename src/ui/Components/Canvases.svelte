<script lang="ts">
  import context from "../../app/context.svelte.ts";
  import ViewportDropdown from "../panels/ViewportDropdown.svelte";
  const viewports = $derived(context.ui?.viewportManager?.viewports || []);
</script>

<div class="column">
  <div class="canvases row gap">
    {#each viewports as viewport, index (viewport.id)}
      <div class="canvas">
        <ViewportDropdown {index} {viewport}>
          {#if viewport.dropdown}
            <viewport.dropdown {viewport} />
          {/if}
        </ViewportDropdown>
        <viewport.component {viewport} />
      </div>
    {/each}
  </div>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .gap {
    gap: var(--form-gap);
  }

  .canvases {
    /* todo: this needs to be dynamically calculated based on */
    /* whether or not other divs are above/below this */
    /* height: calc(100vh - 6rem - 6rem); */
    /* height: calc(100vh - 6rem); */
    height: calc(100vh - 1.5rem);
  }

  /*component wrapper is required because svg and canvas elements have*/
  /*strange competing sizing rules when inside the same flexbox container*/
  .canvas {
    flex: 1 1 auto;
    position: relative;
  }
</style>
