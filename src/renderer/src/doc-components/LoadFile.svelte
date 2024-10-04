<script lang="ts">
  import { newFile } from "../interface/newFile.svelte.ts";
  import { openFile } from "../interface/openFile.svelte.ts";
  import { saveFile, saveFileAs } from "../interface/saveFile.svelte.ts";
</script>

<div>
  <button onclick={newFile}>New file</button>
  <button onclick={saveFile}>Save File</button>
  <button onclick={saveFileAs}>Save File As</button>
</div>

<div>
  <span>Drag and drop a file, or </span>
  <button onclick={openFile}>Load file</button>
</div>

<style>
  div {
    margin: 1rem 0;
  }
</style>
