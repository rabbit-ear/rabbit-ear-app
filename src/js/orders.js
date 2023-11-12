import { layer3d } from "rabbit-ear/layer/solver3d/index.js";
// import { layer } from "rabbit-ear/layer/solver2d/index.js";
import LayerPrototype from "rabbit-ear/layer/solver2d/prototype.js";


const makeHash = () => (
	(Math.random() + 1).toString(36).substring(7)
	+ (Math.random() + 1).toString(36).substring(7));

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

const onErrors = {};
const onMessages = {};

const worker = new Worker(
	new URL("../workers/orders.worker", import.meta.url),
	{type: "module"},
);

setInterval(() => console.log("messages", Object.keys(onMessages).length, Object.keys(onErrors).length), 1000);

worker.onerror = (e) => {
	if (!e || !e.data || !e.data.hash) { return; }
	onErrors[e.data.hash](e);
	delete onErrors[e.data.hash];
	delete onMessages[e.data.hash];
};

worker.onmessage = (e) => {
	if (!e || !e.data || !e.data.hash) {
		console.log("worker.onmessage no hash", e);
		return;
	}
	onMessages[e.data.hash](e);
	delete onErrors[e.data.hash];
	delete onMessages[e.data.hash];
};

export const solveFaceLayersWorker = (graph, epsilon) => (
	new Promise((resolve, reject) => {
		const hash = makeHash();
		onErrors[hash] = reject;
		onMessages[hash] = ({ data }) => {
			if (data && data.solution) {
				resolve(Object.assign(Object.create(LayerPrototype), data.solution));
			} else {
				reject();
			}
		};
		worker.postMessage({ graph, epsilon, hash });
	}));

// export const solveFaceLayersWorker = (graph, epsilon) => {
// 	return new Promise((resolve, reject) => {
// 		worker.onmessage = ({ data }) => {
// 			// console.timeEnd("message");
// 			// console.log("worker returned value", data)
// 			if (!data || !data.solution) { return; }
// 			// if (stringToHash(JSON.stringify(graph)) === this.layer_hash) {
// 			// 	resolve(data.solution)
// 			// }
// 			resolve(Object.assign(Object.create(LayerPrototype), data.solution));
// 		};
// 		console.time("message");
// 		worker.postMessage({ graph, epsilon });
// 		resolve(layer3d(graph, epsilon));
// 		console.log("main thread solution", layer3d(graph, epsilon));
// 	});
// };

// export const solveFaceLayersWorker = (graph, epsilon) => (
// 	new Promise((resolve, reject) => {
// 		// const worker = new Worker(
// 		// 	new URL("../workers/orders.worker", import.meta.url),
// 		// 	{type: "module"},
// 		// );
// 		worker.onerror = reject;
// 		// worker.onerror = (e) => {
// 		// 	reject(e);
// 		// 	// sconsole.timeEnd("message");
// 		// };
// 		worker.onmessage = ({ data }) => {
// 			// console.timeEnd("message");
// 			// console.log("worker returned value", data)
// 			if (!data || !data.solution) { return; }
// 			// if (stringToHash(JSON.stringify(graph)) === this.layer_hash) {
// 			// 	resolve(data.solution)
// 			// }
// 			resolve(Object.assign(Object.create(LayerPrototype), data.solution));
// 		};
// 		// console.time("message");
// 		worker.postMessage({ graph, epsilon });
// 		// resolve(layer3d(graph, epsilon));
// 		// console.log("main thread solution", layer3d(graph, epsilon));
// 	})
// );
