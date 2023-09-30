import { layer3d } from "rabbit-ear/layer/solver3d/index.js";
// import { layer } from "rabbit-ear/layer/solver2d/index.js";
import { get } from "svelte/store";
import {
	Graph,
	GraphFolded,
	UpdateFrame,
} from "../../stores/Model.js";

export const makeFaceOrders = () => {
	const solution = layer3d(get(GraphFolded));
	const faceOrders = solution.faceOrders();
	UpdateFrame({ ...get(Graph), faceOrders });
	return faceOrders.length;
};
