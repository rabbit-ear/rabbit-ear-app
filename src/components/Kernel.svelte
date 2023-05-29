<script>
	import { tool } from "../stores/app.js";
	import {
		graph,
		metadata,
	} from "../stores/graph.js";
	import {
		keyboard,
		presses,
		releases,
		moves,
		current,
	} from "../stores/ui.js";

	const newVertex = (eventType) => {
		switch (eventType) {
		case "press":
			// add vertex
			const newestVertex = $graph.vertices_coords.length;
			$metadata = { ...$metadata, newestVertex };
			$graph.vertices_coords.push($current);
			$graph = { ...$graph };
			break;
		case "move":
			if (!($metadata.newestVertex < $graph.vertices_coords.length)) { break; }
			$graph.vertices_coords[$metadata.newestVertex] = $current;
			$graph = { ...$graph };
			// move most recently added vertex.
			break;
		case "release":
			break;
		}
	};

	const processTool = (eventType) => {
		switch ($tool) {
		case "select": break;
		case "newVertex": return newVertex(eventType);
		default: break;
		}
	};

	export const press = (e) => {
		const { point } = e.detail;
		$presses.push(point);
		// console.log("point", point);
		return processTool("press");
	};

	export const move = (e) => {
		const { point, buttons } = e.detail;
		$current = point;
		if (!buttons) { return; }
		$moves.push(point);
		// console.log("point", point);
		return processTool("move");
	};

	export const release = (e) => {
		const { point } = e.detail;
		$releases.push(point);
		// console.log("point", point);
		return processTool("release");
	};

	// export const didPressAt = (e) => {
	// 	const vertices_coords = $graph.vertices_coords;
	// 	vertices_coords.push(point);
	// 	$graph = {
	// 		...$graph,
	// 		vertices_coords,
	// 	}
	// 	console.log("Graph", $graph);
	// };

</script>