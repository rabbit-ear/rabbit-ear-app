import { layer3d } from "rabbit-ear/layer/solver3d/index.js";
// import { layer } from "rabbit-ear/layer/solver2d/index.js";
import LayerPrototype from "rabbit-ear/layer/solver2d/prototype.js";

export const makeFaceOrders = (graph, epsilon) => {
	const solution = layer3d(graph, epsilon);
	const faceOrders = solution.faceOrders();
	return faceOrders;
};

export const solveFaceLayers = (graph, epsilon) => (
	new Promise((resolve, reject) => {
		try {
			resolve(layer3d(graph, epsilon));
		} catch (error) {
			reject(error);
		}
	})
);

// const worker = new Worker(
// 	new URL("../workers/orders.worker", import.meta.url),
// 	{type: "module"},
// );

export const solveFaceLayersWorker = (graph, epsilon) => (
	new Promise((resolve, reject) => {
		const worker = new Worker(
			new URL("../workers/orders.worker", import.meta.url),
			{type: "module"},
		);
		worker.onerror = reject;
		// worker.onerror = (e) => {
		// 	reject(e);
		// 	// sconsole.timeEnd("message");
		// };
		worker.onmessage = ({ data }) => {
			// console.timeEnd("message");
			// console.log("worker returned value", data)
			if (!data || !data.solution) { return; }
			// if (stringToHash(JSON.stringify(graph)) === this.layer_hash) {
			// 	resolve(data.solution)
			// }
			resolve(Object.assign(Object.create(LayerPrototype), data.solution));
		};
		// console.time("message");
		worker.postMessage({ graph, epsilon });
		// resolve(layer3d(graph, epsilon));
		// console.log("main thread solution", layer3d(graph, epsilon));
	})
);
