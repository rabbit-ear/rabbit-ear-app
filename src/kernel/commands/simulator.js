import { get } from "svelte/store";
import {
	makeEdgesAssignmentSimple,
} from "rabbit-ear/graph/make/edgesAssignment.js";
import {
	makeEdgesFoldAngleFromFaces
} from "rabbit-ear/graph/make/edgesFoldAngle.js";
import {
	ExportModel,
	SimulatorFOLD,
} from "../../stores/Simulator.js";
import {
	UpdateFrame,
	IsoUpdateFrame,
} from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";

const assignKeep = {
	"B": true,
	"b": true,
	"C": true,
	"c": true,
	"U": true,
	"u": true,
	"J": true,
	"j": true,
};

export const saveSimulatorFoldAngles = () => {
	const graph = get(SimulatorFOLD)();
	const folded = get(ExportModel)();
	const creasePattern = get(CreasePattern);
	const foldAngles = makeEdgesFoldAngleFromFaces(folded);
	graph.edges_backmap.forEach((oldIndex, newIndex) => {
		if (oldIndex === undefined || newIndex === undefined) { return; }
		creasePattern.edges_foldAngle[oldIndex] = foldAngles[newIndex];
	});
	const newAssignments = makeEdgesAssignmentSimple(creasePattern);
	creasePattern.edges_assignment = creasePattern.edges_assignment
		.map((a, i) => assignKeep[a] ? a : newAssignments[i]);
	IsoUpdateFrame({ ...creasePattern });
};
