import { get } from "svelte/store";
import execute from "../../kernel/execute.js";
import {
	// Snapping,
	ShowSimulator,
	ShowTerminal,
	ShowFlatFoldableIssues,
	DialogNewFile,
	InputFile,
} from "../../stores/App.js";
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
			},
			{
				label: "save",
				click: () => execute("download", "origami.fold"),
			},
		],
	},
	{
		label: "graph",
		submenu: [
			{
				label: "repair",
			},
			{
				label: "planarize",
				click: () => execute("planarize"),
				toolTip: "make the graph planar, split overlapping edges, rebuild faces",
			},
			{
				label: "smart clean vertices",
				click: () => execute("cleanVertices"),
				toolTip: "clean floating point rounding errors in coordinates",
			},
			{
				label: "merge nearby vertices",
				click: () => execute("mergeNearbyVertices"),
				toolTip: "convert nearby vertices into one vertex",
			},
			{
				label: "snap to grid",
				click: () => execute("snapAllVertices"),
				toolTip: "snap all vertices to the nearest grid intersection",
			},
			{
				type: "separator",
			},
			{
				label: "modify selected",
			},
			{
				label: "merge selected vertices",
				click: () => {},
				toolTip: "convert selected vertices into one vertex",
			},
			{
				label: "set edges assignment",
				click: () => {},
				toolTip: "set the assignment of all selected edges",
			},
			{
				label: "set edges fold angle",
				click: () => {},
				toolTip: "set the fold angle of all selected edges",
			},
		],
	},
	{
		label: "assignment",
		submenu: [
			{
				label: "rebuild boundary",
				click: () => execute("findBoundary"),
				toolTip: "walk around the graph to reassign boundaries",
			},
			{
				label: "invert assignments",
				click: () => execute("invertAssignments"),
				toolTip: "swap mountain and valley assignments",
			},
			{
				label: "reassign selected",
				submenu: [
					{ label: "boundary" },
					{ label: "mountain" },
					{ label: "valley" },
					{ label: "flat" },
					{ label: "cut" },
					{ label: "join" },
					{ label: "unassigned" },
				],
			},
			{
				label: "flatten 3D angles",
				click: () => {},
				toolTip: "make any 3D mountain or valley into flat-folded",
			},
		],
	},
	{
		label: "select",
		submenu: [
			{
				label: "select all",
				click: () => execute("selectAll"),
			},
			{
				label: "deselect all",
				click: () => execute("clearSelection"),
			},
			{ type: "separator" },
			{
				label: "select by assignment",
				submenu: [
					{
						label: "boundary",
						click: () => {},
					},
					{
						label: "mountain",
						click: () => {},
					},
					{
						label: "valley",
						click: () => {},
					},
					{
						label: "flat",
						click: () => {},
					},
					{
						label: "cut",
						click: () => {},
					},
					{
						label: "join",
						click: () => {},
					},
					{
						label: "unassigned",
						click: () => {},
					},
				],
			},
			{
				label: "select by fold angle",
				submenu: [
					{
						label: "flat-folded",
						click: () => {},
					},
					{
						label: "3D angles",
						click: () => {},
					},
				],
			},
		],
	},
	{
		label: "analysis",
		submenu: [
			{
				label: "single-vertex",
			},
			{
				label: "flat-foldable issues",
				type: "checkbox",
				bind: ShowFlatFoldableIssues,
				toolTip: "violations of Kawasaki, Maekawa's theorems",
			},
			{
				label: "nearest vertex distance",
				click: () => {},
				toolTip: "the distance between the two nearest vertices",
			},
			// { type: "separator" },
			// { label: "show indices" },
			// {
			// 	label: "show vertices",
			// 	click: () => {},
			// },
			// {
			// 	label: "show edges",
			// 	click: () => {},
			// },
			// {
			// 	label: "show faces",
			// 	click: () => {},
			// },
		],
	},
	{
		label: "window",
		submenu: [
			{
				label: "show simulator",
				type: "checkbox",
				bind: ShowSimulator,
			},
			{
				label: "show terminal",
				type: "checkbox",
				bind: ShowTerminal,
			},
		],
	},
];
