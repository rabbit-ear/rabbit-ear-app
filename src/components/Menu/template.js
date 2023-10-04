import { get } from "svelte/store";
import {
	execute,
	executeCommand,
} from "../../kernel/execute.js";
import {
	// Snapping,
	ShowCodeEditor,
	ShowFrames,
	ShowIndices,
	ShowFlatFoldableIssues,
	DialogNewFile,
	InputFile,
} from "../../stores/App.js";


import {
	open,
	save,
} from "@tauri-apps/api/dialog";

/**
 *
 */
export default [
	{
		label: "file",
		submenu: [
			{
				label: "new",
				click: () => get(DialogNewFile).showModal(),
			},
			{
				label: "open",
				click: () => get(InputFile).click(),
				// click: async () => {
				// 	const selected = await open({
				// 		multiple: false,
				// 		// filters: [{
				// 		// 	name: "Image",
				// 		// 	extensions: ["png", "jpeg"]
				// 		// }]
				// 		filters: [{
				// 			name: "FOLD",
				// 			extensions: ["fold"]
				// 		}]
				// 	});
				// }
			},
			{
				label: "save",
				click: () => executeCommand("download", "origami.fold"),
				// click: async () => {
				// 	const filePath = await save({
				// 		filters: [{
				// 			name: "FOLD",
				// 			extensions: ["fold"]
				// 		}]
				// 	});
				// }
			},
		],
	},
	{
		label: "graph",
		submenu: [
			{
				label: "duplicate",
				click: () => {
					executeCommand("duplicate");
					executeCommand("setTool", "translate");
				},
			},
			{
				type: "separator",
			},
			{
				label: "planarize",
				click: () => executeCommand("planarize"),
				toolTip: "make the graph planar, split overlapping edges, rebuild faces",
			},
			{
				type: "separator",
			},
			{
				label: "smart clean vertices",
				click: () => executeCommand("cleanVertices"),
				toolTip: "clean floating point rounding errors in coordinates",
			},
			{
				label: "merge nearby vertices",
				click: () => executeCommand("mergeNearbyVertices"),
				toolTip: "convert nearby vertices into one vertex",
			},
			{
				label: "snap to grid",
				click: () => executeCommand("snapAllVertices"),
				toolTip: "snap all vertices to the nearest grid intersection",
			},
			{
				label: "merge selected vertices",
				click: () => executeCommand("mergeSelectedVertices"),
				toolTip: "convert selected vertices into one vertex",
			},
		],
	},
	{
		label: "assignment",
		submenu: [
			{
				label: "rebuild boundary",
				click: () => executeCommand("rebuildBoundary"),
				toolTip: "walk around the graph to reassign boundaries",
			},
			{
				label: "invert assignments",
				click: () => executeCommand("invertAssignments"),
				toolTip: "swap mountain and valley assignments",
			},
			{
				label: "reassign selected",
				toolTip: "set the assignment of all selected edges",
				submenu: [
					{
						label: "boundary",
						click: () => execute(`setAssignment(getSelectedEdges(), "B")`),
					},
					{
						label: "mountain",
						click: () => execute(`setAssignment(getSelectedEdges(), "M")`),
					},
					{
						label: "valley",
						click: () => execute(`setAssignment(getSelectedEdges(), "V")`),
					},
					{
						label: "flat",
						click: () => execute(`setAssignment(getSelectedEdges(), "F")`),
					},
					{
						label: "cut",
						click: () => execute(`setAssignment(getSelectedEdges(), "C")`),
					},
					{
						label: "join",
						click: () => execute(`setAssignment(getSelectedEdges(), "J")`),
					},
					{
						label: "unassigned",
						click: () => execute(`setAssignment(getSelectedEdges(), "U")`),
					},
				],
			},
			// {
			// 	label: "set selected fold angles",
			// 	click: () => {},
			// 	toolTip: "set the fold angle of all selected edges",
			// },
			// {
			// 	label: "flatten 3D angles",
			// 	click: () => {},
			// 	toolTip: "make any 3D mountain or valley into flat-folded",
			// },
		],
	},
	{
		label: "select",
		submenu: [
			{
				label: "select all",
				click: () => executeCommand("selectAll"),
			},
			{
				label: "deselect all",
				click: () => executeCommand("deselectAll"),
			},
			// {
			// 	label: "invert selection",
			// 	click: () => {},
			// },
			{
				label: "select edges",
				submenu: [
					{
						label: "boundary",
						click: () => executeCommand("selectEdgesWithAssignment", "B"),
					},
					{
						label: "mountain",
						click: () => executeCommand("selectEdgesWithAssignment", "M"),
					},
					{
						label: "valley",
						click: () => executeCommand("selectEdgesWithAssignment", "V"),
					},
					{
						label: "flat",
						click: () => executeCommand("selectEdgesWithAssignment", "F"),
					},
					{
						label: "cut",
						click: () => executeCommand("selectEdgesWithAssignment", "C"),
					},
					{
						label: "join",
						click: () => executeCommand("selectEdgesWithAssignment", "J"),
					},
					{
						label: "unassigned",
						click: () => executeCommand("selectEdgesWithAssignment", "U"),
					},
					// {
					// 	type: "separator",
					// },
					// {
					// 	label: "flat-folded",
					// 	click: () => {},
					// },
					// {
					// 	label: "3D angles",
					// 	click: () => {},
					// },
				],
			},
		],
	},
	{
		label: "analysis",
		submenu: [
			// {
			// 	label: "single-vertex",
			// },
			{
				label: "flat-foldable issues",
				type: "checkbox",
				bind: ShowFlatFoldableIssues,
				toolTip: "violations of Kawasaki, Maekawa's theorems",
			},
			{
				label: "nearest two vertices",
				click: () => executeCommand("selectNearestVertices"),
				toolTip: "the distance between the two nearest vertices",
			},
			{
				label: "show graph indices",
				type: "checkbox",
				bind: ShowIndices,
				toolTip: "indices of the vertices, edges, and faces",
			},
		],
	},
	{
		label: "window",
		submenu: [
			// {
			// 	label: "show code editor",
			// 	type: "checkbox",
			// 	bind: ShowCodeEditor,
			// },
			{
				label: "show frames",
				type: "checkbox",
				bind: ShowFrames,
			},
		],
	},
];
