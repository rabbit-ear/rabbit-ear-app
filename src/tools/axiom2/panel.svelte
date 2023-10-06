<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import Assignment from "../../components/PanelParts/Assignment.svelte";
	import { Step } from "./stores.js";

	let classes;
	$: classes = Array.from(Array(5))
		.map(() => "todo")
		.map((str, i) => i === $Step ? "current" : str)
		.map((str, i) => i < $Step ? "done" : str);
</script>

<Panel>
	<span slot="title">Axiom 2</span>
	<span slot="body">
		<div class="flex-column gap">
			<p class="instruction">Bring a point to another point.</p>
			<ol>
				<li class={classes[0]}>press on a point</li>
				<li class={classes[1]}>release on a point</li>
				<li class={classes[2]}>draw segment</li>
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
