import { scale2 } from "rabbit-ear/math/algebra/vector.js";
import {
	multiplyMatrix2Vector2,
	makeMatrix2UniformScale,
} from "rabbit-ear/math/algebra/matrix2.js";
import { get } from "svelte/store";
import { viewBox } from "../stores/app.js";
import { selected } from "../stores/select.js";
import { graph, uiGraph } from "../stores/graph.js";
import { didTouchVertex } from "../js/nearest.js";
import { subgraphWithVertices, normalize } from "../js/subgraph.js";
import { execute } from "./app.js";

export const scrollEvent = ({ point, wheelDelta }) => {
	const box = get(viewBox);
	const scaleOffset = -(wheelDelta / 300);// * (wheelDelta > 0 ? 1 : -1);
	const scale = 1 + scaleOffset;
	//
	const scaled = scale2([box[2], box[3]], scale);
	const newViewBox = [box[0], box[1], scaled[0], scaled[1]];
	viewBox.set(newViewBox);
	//
	// const m = makeMatrix2UniformScale(scale, point);
	// const newOrigin = multiplyMatrix2Vector2(m, [box[0], box[1]]);
	// const newSize = multiplyMatrix2Vector2(m, [box[2], box[3]]);
	// viewBox.set([...newOrigin, ...newSize]);
};
