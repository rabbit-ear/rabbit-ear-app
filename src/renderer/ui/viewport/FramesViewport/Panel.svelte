<script lang="ts">
  //import settings from "../Settings.svelte.ts";
  import app from "../../../app/App.svelte.ts";

  let frame = $derived(1 + app.fileManager.file.activeFrame);
  let frameCount = $derived(app.fileManager.file.frames.length);
</script>

<div class="row">
  <p>frame {frame}/{frameCount}</p>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
  }
</style>
