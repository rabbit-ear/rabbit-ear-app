<script lang="ts">
  import Settings from "../../app/Settings.svelte.ts";
</script>

<div class="column gap">
  <div class="row gap">
    <input type="checkbox" id="verticalUp" bind:checked={Settings.rightHanded} />
    <label for="verticalUp">y-axis up</label>
  </div>
</div>

<style>
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
    gap: 3px;
  }
</style>
