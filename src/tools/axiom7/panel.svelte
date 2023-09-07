<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { ToolStep } from "./stores.js";

	let classes;
	$: classes = Array.from(Array(5))
		.map(() => "todo")
		.map((str, i) => i === $ToolStep ? "current" : str)
		.map((str, i) => i < $ToolStep ? "done" : str);
</script>

<Panel>
	<span slot="title">axiom 7</span>
	<span slot="body">
		<div class="container">
			<ol>
				<li class={classes[0]}>press on a point</li>
				<li class={classes[1]}>release on a line</li>
				<li class={classes[2]}>press on a line</li>
				<li class={classes[3]}>draw segment</li>
			</ol>
		</div>
	</span>
</Panel>

<style>
	ol {
		list-style: decimal;
		padding-left: 1.2rem;
	}
	.container {
		display: flex;
		flex-direction: column;
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
</style>
