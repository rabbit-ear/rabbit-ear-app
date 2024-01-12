import { layer3d } from "rabbit-ear/layer/solver3d/index.js";
// import { layer } from "rabbit-ear/layer/solver2d/index.js";
import LayerPrototype from "rabbit-ear/layer/solver2d/prototype.js";

const makeHash = () => (
	(Math.random() + 1).toString(36).substring(7)
	+ (Math.random() + 1).toString(36).substring(7));

const Callbacks = {};

const onCallback = (e) => {
	if (!e || !e.data || !e.data.hash) { return; }
	if (e.data.msgType) { console.log("UAWEFASDFALSKJFL"); }
	Callbacks[e.data.hash](e);
	delete Callbacks[e.data.hash];
};

// const worker = new Worker(
// 	new URL("../workers/orders.worker", import.meta.url),
// 	{ type: "module", name: "layer-solver-manager" },
// );
// worker.addEventListener("message", onCallback);
// worker.addEventListener("error", onCallback);
const worker = new Worker(
	new URL("../workers/dispatch.worker.js", import.meta.url),
	{ type: "module", name: "layer-solver-manager" },
);
worker.addEventListener("message", onCallback);
worker.addEventListener("error", onCallback);

// export const terminateWorker = worker.terminate;

/**
 * @description Asynchronous solver, runs in a web worker.
 */
export const solveFaceLayersWorker = (graph, epsilon) => (
	new Promise((resolve, reject) => {
		const hash = makeHash();
		Callbacks[hash] = ({ data }) => data && data.solution
			? resolve(Object.assign(Object.create(LayerPrototype), data.solution))
			: reject(data ? data.error : undefined);
		// worker.terminate();
		worker.postMessage({ graph, epsilon, hash });
	}));

/**
 * @description Synchronous solver, this will tie up the main thread.
 */
export const solveFaceLayers = (graph, epsilon) => (
	new Promise((resolve, reject) => {
		try {
			resolve(layer3d(graph, epsilon));
		} catch (error) {
			reject(error);
		}
	}));

// setInterval(() => console.log("messages", Object.keys(Promises).length), 1000);
