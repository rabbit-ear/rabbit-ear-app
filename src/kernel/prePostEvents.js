import { planarize } from "./functions.js";

export const autoPlanarize = (funcName, ...args) => {
	switch (funcName) {
	case "snapAllVertices":
	case "addEdge":
	//case "splitEdges":
	case "translateVertices":
		planarize();
		break;
	default: break;
	}
};
