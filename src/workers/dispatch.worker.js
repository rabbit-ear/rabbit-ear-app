let worker;

addEventListener("message", ({ data }) => {
	// const { graph, epsilon, hash } = data;

	if (worker) {
		worker.terminate();
	}

	worker = new Worker(
		new URL("./orders.worker.js", import.meta.url),
		{ type: "module", name: "layer-solver-process" },
	);

	const onCallback = ({ data }) => {
		postMessage(data);
		worker = undefined;
	};

	worker.addEventListener("message", onCallback);
	worker.addEventListener("error", onCallback);

	worker.postMessage(data);
});

// addEventListener("message", ({ data }) => {
// 	const { graph, epsilon, hash } = data;

// 	if (worker) {
// 		worker.terminate();
// 	}
// 	worker = new Worker(
// 		new URL("./orders.worker.js", import.meta.url),
// 		{ type: "module", name: "layer-solver-process" },
// 	);

// 	// childHandlers.message = postMessage;
// 	// childHandlers.error = postMessage;

// 	const onCallback = (e) => {
// 		if (!e || !e.data || !e.data.hash) { return; }
// 		postMessage(e.data);
// 		worker = undefined;
// 	};

// 	worker.addEventListener("message", onCallback);
// 	worker.addEventListener("error", onCallback);

// 	try {
// 		if (!graph
// 			|| !graph.vertices_coords
// 			|| !graph.edges_vertices
// 			|| !graph.faces_vertices) {
// 			postMessage({ hash, error: "empty graph" });
// 			return;
// 		}
// 		// worker.postMessage({});
// 		worker.postMessage({ graph, epsilon, hash });
// 		// postMessage({ hash, solution: layer3d(graph, epsilon) });
// 	} catch (error) {
// 		postMessage({ hash, error: error.message });
// 	}
// });

addEventListener("error", ({ error }) => (
	console.warn("dispatch.worker.js, unhandled error")
));

addEventListener("messageerror", () => (
	console.warn("dispatch.worker.js, unhandled messageerror")
));
