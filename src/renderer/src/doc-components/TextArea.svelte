<script lang="ts">
  import { model } from "../state/model.svelte.ts";
  import file from "../state/file.svelte.ts";

  const oninput = () => (file.modified = true);
</script>

<textarea bind:value={model.value} {oninput}></textarea>

<style>
  textarea {
    font-family: monospace;
    color: #d7d9da;
    width: 80%;
    min-height: 15rem;
    resize: vertical;
    font-size: 1rem;
    padding: 1rem;
    border: 2px solid #555;
    border-radius: 0.5rem;
    background-color: #2b2a33;
    outline: none;
  }
</style>
