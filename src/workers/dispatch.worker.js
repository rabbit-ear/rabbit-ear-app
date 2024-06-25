let worker;

addEventListener("message", ({ data }) => {
	// const { graph, epsilon, hash } = data;

	if (worker) {
		worker.terminate();
	}

	worker = new Worker(new URL("./orders.worker.js", import.meta.url), {
		type: "module",
		name: "layer-solver-process",
	});

	const onCallback = ({ data }) => {
		postMessage(data);
		worker = undefined;
	};

	worker.addEventListener("message", onCallback);
	worker.addEventListener("error", onCallback);
	worker.postMessage(data);
});

addEventListener("error", ({ error }) =>
	console.warn("dispatch.worker.js, unhandled error"),
);

addEventListener("messageerror", () =>
	console.warn("dispatch.worker.js, unhandled messageerror"),
);
