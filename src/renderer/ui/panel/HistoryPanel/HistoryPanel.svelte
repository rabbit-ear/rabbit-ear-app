<script lang="ts">
  //import app from "../../../app/App.svelte.ts";
</script>

<div class="column gap">
  <div class="row gap">
    <p>item 1</p>
  </div>

  <div class="row gap">
    <p>item 2</p>
  </div>
</div>

<style>
  p {
    pointer-events: none;
  }
  .gap {
    gap: var(--form-gap);
  }
  /*.sm-gap {*/
  /*  gap: 3px;*/
  /*}*/

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
