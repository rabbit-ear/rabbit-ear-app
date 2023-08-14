import { autoPlanarize as aPlanarize } from "./functions.js";

export const autoPlanarize = (funcName, ...args) => {
	switch (funcName) {
	case "snapAllVertices":
	case "addEdge":
	//case "splitEdges":
	case "translateVertices":
		aPlanarize();
		break;
	default: break;
	}
};
