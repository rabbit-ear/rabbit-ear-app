<script lang="ts">
  // value is the logarithmic variable the slider is adjusting
  // radix creates a power of 10 with this many zeros after it,
  //   and scales the large exponential value down.
  let {
    value = $bindable(),
    radix = 5,
    id,
  }: { value: number; radix?: number; id?: string } = $props();

  let scale = $derived(Math.pow(10, radix));

  // ignore any warnings here
  let sliderValue = $state(Math.log2(value * scale));

  $effect(() => {
    value = Math.pow(2, sliderValue) / scale;
  });
</script>

<input {id} type="range" min="1" max="20" step="0.01" bind:value={sliderValue} />
