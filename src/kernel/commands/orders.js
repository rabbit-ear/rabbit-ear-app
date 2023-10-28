import { layer3d } from "rabbit-ear/layer/solver3d/index.js";
// import { layer } from "rabbit-ear/layer/solver2d/index.js";
import { get } from "svelte/store";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { FoldedForm } from "../../stores/ModelFolded.js";

export const makeFaceOrders = () => {
	const solution = layer3d(get(FoldedForm));
	const faceOrders = solution.faceOrders();
	UpdateFrame({ ...get(CreasePattern), faceOrders });
	return faceOrders.length;
};

export const clearFaceOrders = () => {
	const graph = get(CreasePattern);
	delete graph.faceOrders;
	UpdateFrame({ ...graph });
};
