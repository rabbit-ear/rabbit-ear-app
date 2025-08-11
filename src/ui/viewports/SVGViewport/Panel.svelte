<script lang="ts">
  import { SVGViewport } from "./SVGViewport.svelte.ts";
  import { niceNumber } from "../../../general/epsilon.ts";

  //let { viewport }: { viewport: SVGViewport } = $props();
  //let { panel }: { panel: ClassPanel } = $props();
</script>

<div class="column gap">
  <div class="row">
    {#if SVGViewport.settings.cursor}
      <p>
        {niceNumber(SVGViewport.settings.cursor[0], 4)}, {niceNumber(
          SVGViewport.settings.cursor[1],
          4,
        )}
      </p>
    {/if}
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
