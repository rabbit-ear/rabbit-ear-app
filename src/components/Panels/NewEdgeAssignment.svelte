<script>
	import { NewEdgeAssignment } from "../../stores/App.js";
	let options = ["U", "V", "M", "F", "B", "C"];
	let display_func = a => a;
		// "unassigned", "mountain", "valley", "flat", "boundary", "cut"

	let index = 0;
	let value;

	// $: $NewEdgeAssignment = options[index];

</script>

<p>new edges are:</p>
<select bind:value={$NewEdgeAssignment}>
  {#each options as option, i}
    <option value={option}>{display_func(option)}</option>
  {/each}
</select>
