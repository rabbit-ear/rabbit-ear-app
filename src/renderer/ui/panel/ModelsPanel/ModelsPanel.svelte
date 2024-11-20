<script lang="ts">
  import app from "../../../app/App.svelte.ts";

  let models = $derived(app.models.models);
</script>

<div class="column gap">
  <div class="row">
    <p>models: {models.length}</p>
  </div>
  <ul>
    {#each Object.values(models) as model}
      <li>{model.name}</li>
    {/each}
  </ul>
</div>

<style>
  p {
    pointer-events: none;
  }
  .gap {
    gap: var(--form-gap);
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  ul {
    list-style: disc;
    padding-left: 1rem;
  }
</style>
