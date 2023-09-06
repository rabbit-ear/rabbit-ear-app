<script>
	import { ToolStep } from "../../stores/Tool.js";

	let classes = ["todo", "todo", "todo", "todo"];
	$: switch ($ToolStep) {
	case 0:
		classes[0] = "current";
		classes[1] = "todo";
		classes[2] = "todo";
		classes[3] = "todo";
		break;
	case 1:
		classes[0] = "done";
		classes[1] = "current";
		classes[2] = "todo";
		classes[3] = "todo";
		break;
	case 2:
		classes[0] = "done";
		classes[1] = "done";
		classes[2] = "current";
		classes[3] = "todo";
		break;
	case 3:
		classes[0] = "done";
		classes[1] = "done";
		classes[2] = "done";
		classes[3] = "current";
		break;
	}
</script>

<div class="container">
	<ol>
		<li class={classes[0]}>press on a point</li>
		<li class={classes[1]}>release on a line</li>
		<li class={classes[2]}>press on a point</li>
		<li class={classes[3]}>release on a line</li>
	</ol>
</div>

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
