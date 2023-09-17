<script>
	import modifiers from "../../modifiers/index.js";
	import { Modifiers } from "../../stores/Modifiers.js";
	import Panel from "./Panel.svelte";

	let modifierNames = [];
	$: modifierNames = Object.keys(modifiers);

	let checked = {};
	Object.keys(modifiers).forEach(name => {
		checked[name] = $Modifiers.filter(el => el.name === name).length > 0;
	});

	$: $Modifiers = Object.keys(checked)
		.filter(name => checked[name])
		.map(name => modifiers[name]);
</script>

<Panel>
	<span slot="title">modifiers</span>
	<span slot="body">
 		{#each modifierNames as name}
	 		<div>
				<input
					type="checkbox"
					bind:checked={checked[name]}
					id={`mod-check-${name}`}>
				<label for={`mod-check-${name}`}>{name}</label>
			</div>
		{/each}
	</span>
</Panel>
