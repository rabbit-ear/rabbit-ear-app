// import { layer3d } from "rabbit-ear/layer/solver3d/index.js";
// import { layer } from "rabbit-ear/layer/solver2d/index.js";
import { get } from "svelte/store";
import {
	IsolatedFrame,
	UpdateFrame,
} from "../../stores/Model.js";
import {
	FoldedForm,
	FaceOrders,
} from "../../stores/ModelFolded.js";

// export const makeFaceOrders = () => {
// 	const solution = layer3d(get(FoldedForm));
// 	const faceOrders = solution.faceOrders();
// 	UpdateFrame({ ...get(CreasePattern), faceOrders });
// 	return faceOrders.length;
// };

export const clearFaceOrders = () => {
	const graph = get(IsolatedFrame);
	delete graph.faceOrders;
	UpdateFrame({ ...graph });
};

export const saveFaceOrders = () => {
	const faceOrders = get(FaceOrders);
	UpdateFrame({ ...get(IsolatedFrame), faceOrders });
};
