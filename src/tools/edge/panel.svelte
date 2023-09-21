<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import Assignment from "../../components/PanelParts/Assignment.svelte";
	import ShiftLockAngle from "../../components/PanelParts/ShiftLockAngle.svelte";
</script>

<Panel>
	<span slot="title">segment</span>
	<span slot="body">
		<Assignment />
		<hr />
		<ShiftLockAngle />
	</span>
</Panel>
