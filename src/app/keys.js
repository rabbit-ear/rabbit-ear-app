// "tool" is mentioned in:
// - Kernel.svelte
// - Toolbar.svelte
// - Panels/Tools.svelte
export const TOOL_SELECT = "toolSelect";
export const TOOL_DELETE = "toolDelete";
export const TOOL_CAMERA = "toolCamera";
export const TOOL_VERTEX = "toolVertex";
export const TOOL_EDGE = "toolEdge";
export const TOOL_SPLIT_EDGE = "toolSplitEdge";
export const TOOL_TRANSLATE = "toolTranslate";
export const TOOL_SCALE = "toolScale";
export const TOOL_ASSIGN = "toolAssign";
export const TOOL_FOLD_ANGLE = "toolFoldAngle";

export const TOOL_AXIOM_1 = "toolAxiom1";
export const TOOL_AXIOM_2 = "toolAxiom2";
export const TOOL_AXIOM_3 = "toolAxiom3";
export const TOOL_AXIOM_4 = "toolAxiom4";
export const TOOL_AXIOM_5 = "toolAxiom5";
export const TOOL_AXIOM_6 = "toolAxiom6";
export const TOOL_AXIOM_7 = "toolAxiom7";

export const TOOL_KAWASAKI = "toolKawasaki";
export const TOOL_PLEAT = "toolPleat";
export const TOOL_SCRIBBLE = "toolScribble";

// settings for TOOL_SELECT
export const SELECT_VERTEX = "vertices";
export const SELECT_EDGE = "edges";
export const SELECT_FACE = "faces";

// settings for TOOL_ASSIGN
export const ASSIGN_SWAP = "assignSwap";
export const ASSIGN_FLAT = "assignFlat";
export const ASSIGN_UNASSIGNED = "assignUnassigned";
export const ASSIGN_CUT = "assignCut";
export const ASSIGN_BOUNDARY = "assignBoundary";

// general settings
// export const SNAP_NONE = "snapNone";
// export const SNAP_GRID = "snapGrid";

export const nameForTool = {
	[TOOL_SELECT]: "select",
	[TOOL_VERTEX]: "vertex",
	[TOOL_EDGE]: "edge",
	[TOOL_SPLIT_EDGE]: "split edge",
	[TOOL_TRANSLATE]: "translate",
	[TOOL_SCALE]: "scale",
	[TOOL_ASSIGN]: "assignment",
	[TOOL_FOLD_ANGLE]: "fold angle",
	[TOOL_AXIOM_1]: "axiom 1",
	[TOOL_AXIOM_2]: "axiom 2",
	[TOOL_AXIOM_3]: "axiom 3",
	[TOOL_AXIOM_4]: "axiom 4",
	[TOOL_AXIOM_5]: "axiom 5",
	[TOOL_AXIOM_6]: "axiom 6",
	[TOOL_AXIOM_7]: "axiom 7",
	[TOOL_KAWASAKI]: "kawasaki",
	[TOOL_PLEAT]: "pleat",
	[TOOL_SCRIBBLE]: "scribble",
};
