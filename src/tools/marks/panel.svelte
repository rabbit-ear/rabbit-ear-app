<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import Assignment from "../../components/PanelParts/Assignment.svelte";

	export let showPanel;
</script>

<Panel {showPanel}>
	<span slot="title">Marks</span>
	<span slot="body">
		<Assignment />
	</span>
</Panel>
