<script>
	import {
		TOOL_SELECT,
		TOOL_VERTEX,
	} from "../js/enums.js";
	import {
		tool,
		selectionRect,
	} from "../stores/app.js";
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

	const distance2 = (a, b) => {
		const x = a[0] - b[0];
		const y = a[1] - b[1];
		return Math.sqrt(x ** 2 + y ** 2);
	};

	const rectFromTwoPoints = (p, q) => {
		const xs = [p[0], q[0]].sort((a, b) => a - b);
		const ys = [p[1], q[1]].sort((a, b) => a - b);
		return {
			origin: [xs[0], ys[0]],
			span: [xs[1] - xs[0], ys[1] - ys[0]],
		};
	}

	const handleToolSelect = (eventType) => {
		switch (eventType) {
		case "press":
			$moves = [];
			$releases = [];
			$selectionRect = undefined;
			break;
		case "move":
			if (!$presses.length || !$moves.length) {
				$selectionRect = undefined;
				break;
			}
			$selectionRect = rectFromTwoPoints(
				$presses[$presses.length - 1],
				$moves[$moves.length - 1],
			);
			break;
		case "release":
			$selectionRect = undefined;
			$presses = [];
			$moves = [];
			$releases = [];
			break;
		}
	}

	const handleToolVertex = (eventType) => {
		switch (eventType) {
		case "press":
			const distances = $graph.vertices_coords
				.map(p => distance2(p, $current));
			const near = distances
				.map((d, i) => d < 0.3 ? i : undefined)
				.filter(a => a !== undefined)
				.sort((a, b) => distances[a] - distances[b])
				.shift();
			if (near !== undefined) {
				$metadata = { ...$metadata, newestVertex: near };
				break;
			}
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

	const handleTool = (eventType) => {
		switch ($tool) {
		case TOOL_SELECT: return handleToolSelect(eventType);
		case TOOL_VERTEX: return handleToolVertex(eventType);
		default: break;
		}
	};

	export const press = (e) => {
		const { point } = e.detail;
		$presses.push(point);
		// console.log("point", point);
		return handleTool("press");
	};

	export const move = (e) => {
		const { point, buttons } = e.detail;
		$current = point;
		if (!buttons) { return; }
		$moves.push(point);
		// console.log("point", point);
		return handleTool("move");
	};

	export const release = (e) => {
		const { point } = e.detail;
		$releases.push(point);
		// console.log("point", point);
		return handleTool("release");
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