<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import NewEdgeAssignment from "../../components/Panels/NewEdgeAssignment.svelte";
	import ShiftLockAngle from "../../components/Panels/ShiftLockAngle.svelte";
</script>

<Panel>
	<span slot="title">edge</span>
	<span slot="body">
		<NewEdgeAssignment />
		<hr />
		<ShiftLockAngle />
	</span>
</Panel>
