<script lang="ts">
  import type { CreasePattern } from "./CreasePattern.ts";

  const { embedding }: { model: CreasePattern } = $props();
</script>

<div class="column gap">
  <div class="row gap">
    <p>cp status</p>
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
