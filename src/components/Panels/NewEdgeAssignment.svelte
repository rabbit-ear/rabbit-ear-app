<script>
	import { NewEdgeAssignment } from "../../stores/App.js";

	const options = ["U", "V", "M", "F", "B", "C"];

	const readable = {
		U: "unassigned",
		M: "mountain",
		V: "valley",
		F: "flat",
		B: "boundary",
		C: "cut",
	};

</script>

<p>new edges are:</p>
<select bind:value={$NewEdgeAssignment}>
  {#each options as option, i}
    <option value={option}>{readable[option]}</option>
  {/each}
</select>
