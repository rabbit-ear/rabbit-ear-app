<script lang="ts">
  import app from "../../app/App.svelte.ts";

  const logFile = (): void => {
    console.log(app.file);
  };
</script>

<div class="column gap">
  <div class="row gap">
    <button onclick={logFile}>log file</button>
  </div>
</div>

<style>
  button {
    width: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
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
