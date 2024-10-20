<script lang="ts">
  import settings from "./Settings.svelte.ts";
</script>

<div class="row toggle-row">
  <input type="text" bind:value={settings.filterString} />
</div>
