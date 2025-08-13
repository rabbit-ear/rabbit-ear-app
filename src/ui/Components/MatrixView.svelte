<script lang="ts">
  import { niceNumber } from "../../general/epsilon.ts";
  let { matrix }: { matrix: number[] } = $props();

  // const nice = (num: number): string => niceNumber(num, 2);
  const nice = (num: number): string =>
    Number.isInteger(num) ? String(num) : num.toFixed(2);
</script>

{#if matrix.length === 16}
  <div class="column container">
    <div class="row four">
      <span>{nice(matrix[0])}</span>
      <span>{nice(matrix[4])}</span>
      <span>{nice(matrix[8])}</span>
      <span>{nice(matrix[12])}</span>
    </div>
    <div class="row four">
      <span>{nice(matrix[1])}</span>
      <span>{nice(matrix[5])}</span>
      <span>{nice(matrix[9])}</span>
      <span>{nice(matrix[13])}</span>
    </div>
    <div class="row four">
      <span>{nice(matrix[2])}</span>
      <span>{nice(matrix[8])}</span>
      <span>{nice(matrix[10])}</span>
      <span>{nice(matrix[14])}</span>
    </div>
    <div class="row four">
      <span>{nice(matrix[3])}</span>
      <span>{nice(matrix[9])}</span>
      <span>{nice(matrix[11])}</span>
      <span>{nice(matrix[15])}</span>
    </div>
  </div>
{/if}

{#if matrix.length === 6}
  <div class="column container">
    <div class="row three">
      <span>{nice(matrix[0])}</span>
      <span>{nice(matrix[2])}</span>
      <span>{nice(matrix[4])}</span>
    </div>
    <div class="row three">
      <span>{nice(matrix[1])}</span>
      <span>{nice(matrix[3])}</span>
      <span>{nice(matrix[5])}</span>
    </div>
  </div>
{/if}

<style>
  .column {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .container {
    border-left: 1px solid var(--text);
    border-right: 1px solid var(--text);
  }
  span {
    text-align: center;
    font-family: monospace;
  }
  .three span {
    flex: 1 0 33.33333%;
  }
  .four span {
    flex: 1 0 25%;
  }
</style>
