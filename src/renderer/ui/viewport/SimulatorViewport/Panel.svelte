<script lang="ts">
  let tool = $state("trackball");
</script>

<div class="column gap">
  <div class="row gap">
    <p>pointer tool</p>
    <div class="toggle-row">
      <button
        class={tool === "trackball" ? "highlighted" : ""}
        onclick={(): void => {
          tool = "trackball";
        }}>trackball</button>
      <button
        class={tool === "pull" ? "highlighted" : ""}
        onclick={(): void => {
          tool = "pull";
        }}>pull</button>
    </div>
  </div>
</div>

<style>
  button {
    width: 100%;
  }
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
