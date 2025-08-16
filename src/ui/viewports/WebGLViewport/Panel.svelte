<script lang="ts">
  import { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import { niceNumber } from "../../../general/epsilon.ts";
</script>

<div class="column gap">
  <div class="row">
    {#if WebGLViewport.settings.cursor}
      <p>
        {niceNumber(WebGLViewport.settings.cursor[0], 4)}, {niceNumber(
          WebGLViewport.settings.cursor[1],
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
