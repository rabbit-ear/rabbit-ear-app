import { autoPlanarize as aPlanarize } from "./functions.js";

export const autoPlanarize = (funcName, ...args) => {
	switch (funcName) {
	//case "splitEdges":
	case "snapAllVertices":
	case "addEdge":
	case "translateVertices":
	case "deleteComponents":
	case "repeatFoldLine":
		aPlanarize();
		break;
	default: break;
	}
};
