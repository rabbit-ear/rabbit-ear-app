<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import Assignment from "../../components/PanelParts/Assignment.svelte";

	export let showPanel;
</script>

<Panel {showPanel}>
	<span slot="title">Rectangle</span>
	<span slot="body">
		<Assignment />
	</span>
</Panel>
