<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import Assignment from "../../components/PanelParts/Assignment.svelte";
	import ShiftLockAngle from "../../components/PanelParts/ShiftLockAngle.svelte";

	export let showPanel;
</script>

<Panel {showPanel}>
	<span slot="title">Segment</span>
	<span slot="body">
		<Assignment />
		<hr />
		<ShiftLockAngle />
	</span>
</Panel>
