<script>
	import modifiers from "../../modifiers/index.js";
	import {
		Modifiers,
		FixedModifiers,
	} from "../../stores/Modifiers.js";
	import Panel from "./Panel.svelte";

	export let showPanel;

	let modifierNames = [];
	$: modifierNames = Object.keys(modifiers);

	let checked = {};
	Object.keys(modifiers)
		.forEach(name => {
			checked[name] = $Modifiers.filter(el => el.key === name).length > 0;
		});

	$: $Modifiers = Object.keys(checked)
		.filter(name => checked[name])
		.map(name => modifiers[name])
</script>

<Panel {showPanel}>
	<span slot="title">Modifiers</span>
	<span slot="body">
		<div class="flex-column gap">
	 		{#each modifierNames as name}
		 		<div class="flex-row">
					<input
						type="checkbox"
						bind:checked={checked[name]}
						disabled={name in FixedModifiers}
						id={`mod-check-${name}`}>
					<label for={`mod-check-${name}`}>{modifiers[name].name}</label>
				</div>
			{/each}
		</div>
	</span>
</Panel>
