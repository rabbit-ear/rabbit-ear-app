import { get } from "svelte/store";
import {
	Graph,
	UpdateFrame,
} from "../../stores/Model.js";
import Planarize from "rabbit-ear/graph/planarize.js";
import populate from "rabbit-ear/graph/populate.js";

export const planarize = () => (
	UpdateFrame(populate(Planarize(get(Graph)), true))
);
