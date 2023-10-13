<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import Assignment from "../../components/PanelParts/Assignment.svelte";
	import { Step } from "./stores.js";

	export let showPanel;

	let classes;
	$: classes = Array.from(Array(5))
		.map(() => "todo")
		.map((str, i) => i === ($Step - 1) ? "current" : str)
		.map((str, i) => i < ($Step - 1) ? "done" : str);
</script>

<Panel {showPanel}>
	<span slot="title">Axiom 7</span>
	<span slot="body">
		<div class="flex-column">
			<p class="instruction">Bring a point to a line, and another line onto itself.</p>
			<ol>
				<li class={classes[0]}>press on a point</li>
				<li class={classes[1]}>release on a line</li>
				<li class={classes[2]}>press on a line</li>
				<li class={classes[3]}>draw segment</li>
			</ol>
		</div>
		<hr />
		<Assignment />
	</span>
</Panel>

<style>
	ol {
		list-style: decimal;
		padding-left: 1.2rem;
	}
	.done {
		color: var(--dim);
	}
	.current {
		color: var(--highlight);
		font-weight: bold;
	}
	.todo {
		color: var(--text);
	}
	.instruction {
		color: var(--dim);
		font-style: italic;
	}
</style>
