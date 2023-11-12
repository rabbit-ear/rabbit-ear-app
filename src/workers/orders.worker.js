// this one line, importing rabbit ear takes about 200ms
import { layer3d } from "rabbit-ear/layer/solver3d/index.js";
// import { layer } from "rabbit-ear/layer/solver2d/index.js";
// import { exposeWorker } from "./exposeWorker.js";

// onmessage = (e) => {
// 	console.log("Message received from main script");
// 	const workerResult = `Result: ${e.data[0] * e.data[1]}`;
// 	console.log("Posting message back to main script");
// 	postMessage(workerResult);
// };

// const faceOrdersWorker = ({ graph, epsilon }) => {
// 	if (!graph) { return {}; }
// 	try {
// 		const { root, branches, faces_winding } = layer3d(graph, epsilon);
// 		const solution = { root, branches, faces_winding };
// 		return { solution };
// 	} catch (error) {
// 		return { error };
// 	}
// }

// exposeWorker(faceOrdersWorker);

// things I learned:
// from inside the Web Worker, if the graph is an empty object, meaning
// "faces_vertices" doesn't exist, then calling each method results in:
// Test1: "DataCloneError: The object can not be cloned."
// Test2: no error.
//
const Test1 = ({ faces_vertices }) => faces_vertices.length;
const Test2 = ({ faces_vertices }) => "hi"

let cachedHash = "";

addEventListener("error", ({ error }) => (
	postMessage({ error, hash: cachedHash })
));

addEventListener("messageerror", ({ error }) => (
	postMessage({ error, hash: cachedHash })
));

addEventListener("message", ({ data }) => {
	if (!data) {
		postMessage({ error: "BIG ERROR: addEventListener. no data" });
		return;
	}
	const { graph, epsilon, hash } = data;
	cachedHash = hash;
	if (!graph) {
		postMessage({ hash, error: "no graph" });
		return;
	}
	try {
		if (!graph.vertices_coords || !graph.edges_vertices || !graph.faces_vertices) {
			postMessage({ hash, error: "empty graph" });
			return;
		}
		postMessage({ hash, solution: layer3d(graph, epsilon) });
		// postMessage({ error: "no error" });
	} catch (error) {
		postMessage({ hash, error });
	}
});
