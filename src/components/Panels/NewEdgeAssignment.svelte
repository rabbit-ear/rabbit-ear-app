<script>
	import { edgesAssignmentNames } from "rabbit-ear/fold/spec.js";
	import { NewEdgeAssignment } from "../../stores/App.js";

	const options = ["U", "V", "M", "F", "B", "C"];
</script>

<p>new edges are:</p>
<select bind:value={$NewEdgeAssignment}>
  {#each options as option, i}
    <option value={option}>{edgesAssignmentNames[option]}</option>
  {/each}
</select>
