<script lang="ts">
  import app from "../../../app/App.svelte.ts";
  import Wrapper from "../Wrapper.svelte";

  //let models = $derived(app.models.models);
  //let modelsKeys = $derived(Object.keys(app.models.models));
  let models = $derived(Object.values(app.models.models));
</script>

<div class="column gap">
  <div class="row">
    <p>models: {models.length}</p>
  </div>
  <div class="left-border">
    {#each models as model}
      {#if model.panel}
        <Wrapper title={model.name}>
          {#if model.errors?.length}
            {#each model.errors as error}
              <span class="error">{error}</span>
            {/each}
          {/if}
          <model.panel {model} />
        </Wrapper>
      {/if}
    {/each}
  </div>
</div>

<style>
  p {
    pointer-events: none;
  }
  .gap {
    gap: var(--form-gap);
  }

  .error {
    color: #e53;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .left-border {
    border-left: 2px solid var(--background-4);
  }
</style>
